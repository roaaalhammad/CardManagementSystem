using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CardManagementSystem.Api.Data;
using CardManagementSystem.Api.DTOs;
using CardManagementSystem.Api.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using CardManagementSystem.Api.Services;

namespace CardManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardRequestsController : ControllerBase
    {
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
        private const int MaxOtpAttempts = 5;

        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly AuthenticaService _authentica;

        public CardRequestsController(AppDbContext db, IWebHostEnvironment env, AuthenticaService authentica)
        {
            _db = db;
            _env = env;
            _authentica = authentica;
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return claim != null && int.TryParse(claim, out var id) ? id : null;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var currentUser = await _db.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId.Value);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var query = _db.CardRequests
                .Include(r => r.User)
                .AsQueryable();

            var roleName = currentUser.Role!.RoleName;

            if (roleName == "Employee")
            {
                query = query.Where(r => r.UserId == userId.Value);
            }
            else if (roleName == "DirectManager")
            {
                query = query.Where(r => r.User!.ManagerId == userId.Value);
            }

            var requests = await query
                .OrderByDescending(r => r.SubmittedAt)
                .Select(r => new CardRequestSummaryDto
                {
                    RequestId = r.RequestId,
                    RequestType = r.RequestType,
                    Status = r.Status,
                    SubmittedAt = r.SubmittedAt,
                    ReadyForDelivery = r.ReadyForDelivery,
                    IsDelivered = r.IsDelivered,
                    EmployeeNameAr = r.User!.FullNameAr,
                    EmployeeNationalId = r.User.NationalId,
                    EmployeeNumber = r.User.EmployeeNumber
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var currentUser = await _db.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId.Value);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .Include(r => r.Attachments)
                .Include(r => r.Approvals)
                    .ThenInclude(a => a.Approver)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            var roleName = currentUser.Role!.RoleName;

            if (roleName == "Employee" && cardRequest.UserId != userId.Value)
            {
                return Forbid();
            }

            if (roleName == "DirectManager" && cardRequest.User!.ManagerId != userId.Value)
            {
                return Forbid();
            }

            var dto = new CardRequestDetailDto
            {
                RequestId = cardRequest.RequestId,
                RequestType = cardRequest.RequestType,
                Status = cardRequest.Status,
                SubmittedAt = cardRequest.SubmittedAt,
                UpdatedAt = cardRequest.UpdatedAt,
                ReadyForDelivery = cardRequest.ReadyForDelivery,
                IsDelivered = cardRequest.IsDelivered,
                EmployeeNameAr = cardRequest.User!.FullNameAr,
                EmployeeNameEn = cardRequest.User.FullNameEn,
                EmployeeNationalId = cardRequest.User.NationalId,
                EmployeeNumber = cardRequest.User.EmployeeNumber,
                JobTitle = cardRequest.User.JobTitle,
                Department = cardRequest.User.Department,
                Attachments = cardRequest.Attachments.Select(a => new AttachmentDto
                {
                    AttachmentId = a.AttachmentId,
                    FileName = a.FileName,
                    ContentType = a.ContentType,
                    FileSizeBytes = a.FileSizeBytes,
                    Url = $"/api/cardrequests/attachments/{a.AttachmentId}/file"
                }).ToList(),
                Approvals = cardRequest.Approvals.Select(a => new ApprovalHistoryDto
                {
                    ApprovalStage = a.ApprovalStage,
                    Decision = a.Decision,
                    Notes = a.Notes,
                    ApproverNameAr = a.Approver!.FullNameAr,
                    DecidedAt = a.DecidedAt
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpGet("attachments/{attachmentId}/file")]
        [Authorize]
        public async Task<IActionResult> GetAttachmentFile(int attachmentId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var currentUser = await _db.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId.Value);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var attachment = await _db.RequestAttachments
                .Include(a => a.Request)
                    .ThenInclude(r => r!.User)
                .FirstOrDefaultAsync(a => a.AttachmentId == attachmentId);

            if (attachment == null || attachment.Request == null)
            {
                return NotFound();
            }

            var roleName = currentUser.Role!.RoleName;

            if (roleName == "Employee" && attachment.Request.UserId != userId.Value)
            {
                return Forbid();
            }

            if (roleName == "DirectManager" && attachment.Request.User!.ManagerId != userId.Value)
            {
                return Forbid();
            }

            if (!System.IO.File.Exists(attachment.FilePath))
            {
                return NotFound();
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);
            var contentType = string.IsNullOrEmpty(attachment.ContentType) ? "application/octet-stream" : attachment.ContentType;
            return File(bytes, contentType);
        }

        [HttpGet("{id}/design")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> GetCardDesign(int id)
        {
            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            var design = await _db.CardDesigns.FirstOrDefaultAsync(d => d.RequestId == id);
            var latestAttachment = await _db.RequestAttachments
                .Where(a => a.RequestId == id)
                .OrderByDescending(a => a.UploadedAt)
                .FirstOrDefaultAsync();

            string? designPhotoUrl;
            if (design != null && !string.IsNullOrEmpty(design.PhotoPath))
            {
                designPhotoUrl = $"/api/cardrequests/{id}/design/photo";
            }
            else if (latestAttachment != null)
            {
                designPhotoUrl = $"/api/cardrequests/attachments/{latestAttachment.AttachmentId}/file";
            }
            else
            {
                designPhotoUrl = null;
            }

            var dto = new CardDesignDto
            {
                RequestId = id,
                NameAr = !string.IsNullOrWhiteSpace(design?.NameAr) ? design!.NameAr : cardRequest.User!.FullNameAr,
                NameEn = !string.IsNullOrWhiteSpace(design?.NameEn) ? design!.NameEn : cardRequest.User!.FullNameEn,
                JobTitle = !string.IsNullOrWhiteSpace(design?.JobTitle) ? design!.JobTitle : cardRequest.User!.JobTitle,
                NationalId = cardRequest.User!.NationalId,
                EmployeeNumber = cardRequest.User.EmployeeNumber,
                Department = cardRequest.User.Department,
                CopyNumber = design?.CopyNumber ?? 1,
                IssueDate = design?.IssueDate ?? DateTime.UtcNow,
                PhotoUrl = designPhotoUrl,
                IsLocked = design?.IsLocked ?? false
            };

            return Ok(dto);
        }

        [HttpGet("{id}/design/photo")]
        [Authorize]
        public async Task<IActionResult> GetCardDesignPhoto(int id)
        {
            var design = await _db.CardDesigns.FirstOrDefaultAsync(d => d.RequestId == id);

            if (design == null || string.IsNullOrEmpty(design.PhotoPath) || !System.IO.File.Exists(design.PhotoPath))
            {
                return NotFound();
            }

            var ext = Path.GetExtension(design.PhotoPath).ToLowerInvariant();
            var contentType = ext == ".png" ? "image/png" : "image/jpeg";

            var bytes = await System.IO.File.ReadAllBytesAsync(design.PhotoPath);
            return File(bytes, contentType);
        }

        [HttpPost("{id}/design")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> SaveCardDesign(int id, [FromForm] SaveCardDesignDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            var design = await _db.CardDesigns.FirstOrDefaultAsync(d => d.RequestId == id);

            if (design != null && design.IsLocked)
            {
                return BadRequest(new { message = "تم قفل تصميم البطاقة، لا يمكن تعديله" });
            }

            if (design == null)
            {
                design = new CardDesign { RequestId = id };
                _db.CardDesigns.Add(design);
            }

            design.NameAr = string.IsNullOrWhiteSpace(dto.NameAr) ? cardRequest.User!.FullNameAr : dto.NameAr;
            design.NameEn = string.IsNullOrWhiteSpace(dto.NameEn) ? cardRequest.User!.FullNameEn : dto.NameEn;
            design.JobTitle = string.IsNullOrWhiteSpace(dto.JobTitle) ? cardRequest.User!.JobTitle : dto.JobTitle;

            if (dto.Photo != null)
            {
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", "CardDesigns");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{id}_{Guid.NewGuid()}{Path.GetExtension(dto.Photo.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(stream);
                }

                design.PhotoPath = filePath;
            }

            design.LastEditedByUserId = userId.Value;
            design.LastEditedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم حفظ تصميم البطاقة بنجاح" });
        }

        [HttpPost("{id}/design/lock")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> LockCardDesign(int id)
        {
            var design = await _db.CardDesigns.FirstOrDefaultAsync(d => d.RequestId == id);

            if (design == null)
            {
                return BadRequest(new { message = "يجب حفظ تصميم البطاقة أولاً قبل القفل" });
            }

            if (design.IsLocked)
            {
                return BadRequest(new { message = "تصميم البطاقة مقفل مسبقاً" });
            }

            design.IsLocked = true;
            design.IsPrinted = true;
            design.PrintedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم قفل تصميم البطاقة بنجاح" });
        }

        [HttpGet("{id}/design/pdf")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> ExportCardDesignPdf(int id)
        {
            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            var design = await _db.CardDesigns.FirstOrDefaultAsync(d => d.RequestId == id);

            if (design == null)
            {
                return BadRequest(new { message = "يجب حفظ تصميم البطاقة أولاً" });
            }

            byte[]? photoBytes = null;
            if (!string.IsNullOrEmpty(design.PhotoPath) && System.IO.File.Exists(design.PhotoPath))
            {
                photoBytes = await System.IO.File.ReadAllBytesAsync(design.PhotoPath);
            }
            else
            {
                var latestAttachment = await _db.RequestAttachments
                    .Where(a => a.RequestId == id)
                    .OrderByDescending(a => a.UploadedAt)
                    .FirstOrDefaultAsync();

                if (latestAttachment != null && System.IO.File.Exists(latestAttachment.FilePath))
                {
                    photoBytes = await System.IO.File.ReadAllBytesAsync(latestAttachment.FilePath);
                }
            }

            var templatePath = Path.Combine(_env.ContentRootPath, "Assets", "card-template.png");
            byte[]? templateBytes = System.IO.File.Exists(templatePath)
                ? await System.IO.File.ReadAllBytesAsync(templatePath)
                : null;

            const string goldColor = "#B08D57";

            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(new PageSize(350, 550));
                    page.Margin(0);
                    page.ContentFromRightToLeft();

                    if (templateBytes != null)
                    {
                        page.Background().Image(templateBytes).FitArea();
                    }

                    page.Content().PaddingTop(132).Column(col =>
                    {
                        col.Item().AlignCenter().Width(156).Height(156).Element(c =>
                        {
                            if (photoBytes != null)
                            {
                                c.CornerRadius(78).Image(photoBytes).FitArea();
                            }
                            else
                            {
                                c.CornerRadius(78).Background(Colors.Grey.Lighten3);
                            }
                        });

                        col.Item().PaddingTop(20).AlignCenter().Text(design.NameAr).FontSize(16).Bold();
                        col.Item().AlignCenter().Text(design.NameEn).FontSize(12);
                        col.Item().PaddingTop(4).AlignCenter().Text(design.JobTitle).FontSize(11).FontColor(goldColor).Bold();
                        col.Item().PaddingTop(10).AlignCenter().Text($"السجل المدني: {cardRequest.User!.NationalId}").FontSize(10);
                        col.Item().AlignCenter().Text($"الرقم الوظيفي: {cardRequest.User.EmployeeNumber}").FontSize(10);

                        col.Item().PaddingTop(60).Row(row =>
                        {
                            row.RelativeItem().Element(c => c
                            .Background(goldColor)
                            .PaddingVertical(2).PaddingHorizontal(6)
                            .Text($"نسخة: {design.CopyNumber}").FontSize(9).FontColor(Colors.White));
                            row.RelativeItem().AlignLeft().Text(cardRequest.User.Department).FontSize(9);
                        });

                        col.Item().PaddingTop(4).AlignRight().Text($"تاريخ الإصدار: {design.IssueDate:dd/MM/yyyy}").FontSize(9).FontColor(Colors.Black);
                    });
                });
            }).GeneratePdf();

            return File(pdfBytes, "application/pdf", $"card-{id}.pdf");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateCardRequestDto request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.RequestType))
            {
                return BadRequest(new { message = "نوع الطلب مطلوب" });
            }

            var cardRequest = new CardRequest
            {
                UserId = userId.Value,
                RequestType = request.RequestType,
                Status = "قيد المراجعة",
                SubmittedAt = DateTime.UtcNow
            };

            _db.CardRequests.Add(cardRequest);
            await _db.SaveChangesAsync();

            if (request.Photo != null)
            {
                if (request.Photo.Length > MaxFileSizeBytes)
                {
                    return BadRequest(new { message = "حجم الصورة يتجاوز الحد الأقصى المسموح (5 ميجابايت)" });
                }

                var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", "Requests");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{cardRequest.RequestId}_{Guid.NewGuid()}{Path.GetExtension(request.Photo.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Photo.CopyToAsync(stream);
                }

                _db.RequestAttachments.Add(new RequestAttachment
                {
                    RequestId = cardRequest.RequestId,
                    FileName = request.Photo.FileName,
                    FilePath = filePath,
                    ContentType = request.Photo.ContentType,
                    FileSizeBytes = request.Photo.Length
                });

                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "تم تقديم الطلب بنجاح", requestId = cardRequest.RequestId });
        }

        [HttpPut("{id}/manager-decision")]
        [Authorize(Roles = "DirectManager")]
        public async Task<IActionResult> ManagerDecision(int id, ApprovalDecisionDto decision)
        {
            var managerId = GetCurrentUserId();
            if (managerId == null)
            {
                return Unauthorized();
            }

            if (decision.Decision != "Approved" && decision.Decision != "Rejected")
            {
                return BadRequest(new { message = "القرار يجب أن يكون Approved أو Rejected" });
            }

            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            if (cardRequest.User?.ManagerId != managerId)
            {
                return Forbid();
            }

            if (cardRequest.Status != "قيد المراجعة")
            {
                return BadRequest(new { message = "لا يمكن اتخاذ قرار على هذا الطلب بحالته الحالية" });
            }

            _db.RequestApprovals.Add(new RequestApproval
            {
                RequestId = cardRequest.RequestId,
                ApproverId = managerId.Value,
                ApprovalStage = "DirectManager",
                Decision = decision.Decision,
                Notes = decision.Notes,
                DecidedAt = DateTime.UtcNow
            });

            cardRequest.Status = decision.Decision == "Approved"
                ? "قيد مراجعة التواصل الداخلي"
                : "مرفوض من المدير المباشر";
            cardRequest.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم تسجيل القرار بنجاح", status = cardRequest.Status });
        }

        [HttpPut("{id}/commstaff-decision")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> CommStaffDecision(int id, ApprovalDecisionDto decision)
        {
            var staffId = GetCurrentUserId();
            if (staffId == null)
            {
                return Unauthorized();
            }

            if (decision.Decision != "Approved" && decision.Decision != "Rejected")
            {
                return BadRequest(new { message = "القرار يجب أن يكون Approved أو Rejected" });
            }

            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            if (cardRequest.Status != "قيد مراجعة التواصل الداخلي")
            {
                return BadRequest(new { message = "لا يمكن اتخاذ قرار على هذا الطلب بحالته الحالية" });
            }

            _db.RequestApprovals.Add(new RequestApproval
            {
                RequestId = cardRequest.RequestId,
                ApproverId = staffId.Value,
                ApprovalStage = "CommStaff",
                Decision = decision.Decision,
                Notes = decision.Notes,
                DecidedAt = DateTime.UtcNow
            });

            string otpMessage = string.Empty;

            if (decision.Decision == "Approved")
            {
                cardRequest.Status = "بانتظار التسليم";
                cardRequest.ReadyForDelivery = true;

                if (!string.IsNullOrWhiteSpace(cardRequest.User?.PhoneNumber))
                {
                    var (success, message) = await _authentica.SendOtpAsync(cardRequest.User!.PhoneNumber!);
                    otpMessage = message;
                }
                else
                {
                    otpMessage = "لا يوجد رقم جوال مسجل للموظف لإرسال رمز التحقق";
                }
            }
            else
            {
                cardRequest.Status = "مرفوض من التواصل الداخلي";
            }

            cardRequest.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم تسجيل القرار بنجاح", status = cardRequest.Status, otpMessage });
        }

        [HttpPost("{id}/deliver")]
        [Authorize(Roles = "CommStaff")]
        public async Task<IActionResult> Deliver(int id, VerifyOtpDto request)
        {
            var staffId = GetCurrentUserId();
            if (staffId == null)
            {
                return Unauthorized();
            }

            var cardRequest = await _db.CardRequests
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            if (cardRequest.Status != "بانتظار التسليم" || cardRequest.IsDelivered)
            {
                return BadRequest(new { message = "هذا الطلب غير جاهز للتسليم" });
            }

            if (string.IsNullOrWhiteSpace(cardRequest.User?.PhoneNumber))
            {
                return BadRequest(new { message = "لا يوجد رقم جوال مسجل للموظف" });
            }

            var (verified, verifyMessage) = await _authentica.VerifyOtpAsync(cardRequest.User!.PhoneNumber!, request.Code);

            if (!verified)
            {
                return BadRequest(new { message = verifyMessage });
            }

            _db.CardDeliveries.Add(new CardDelivery
            {
                RequestId = cardRequest.RequestId,
                DeliveredById = staffId.Value,
                DeliveredAt = DateTime.UtcNow
            });

            cardRequest.IsDelivered = true;
            cardRequest.Status = "تم التسليم";
            cardRequest.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم تسليم البطاقة بنجاح", status = cardRequest.Status });
        }
    }
}