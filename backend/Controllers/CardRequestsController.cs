using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CardManagementSystem.Api.Data;
using CardManagementSystem.Api.DTOs;
using CardManagementSystem.Api.Models;

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

        public CardRequestsController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
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
            // CommStaff: بدون فلترة، يشوف كل الطلبات

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

            // CommStaff: بدون تحقق إضافي، يشوف كل الطلبات

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
                    FileSizeBytes = a.FileSizeBytes
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

            var cardRequest = await _db.CardRequests.FirstOrDefaultAsync(r => r.RequestId == id);

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

            string? otpCode = null;

            if (decision.Decision == "Approved")
            {
                otpCode = Random.Shared.Next(100000, 999999).ToString();

                _db.OtpVerifications.Add(new OtpVerification
                {
                    RequestId = cardRequest.RequestId,
                    Code = otpCode,
                    GeneratedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });

                cardRequest.Status = "بانتظار التسليم";
                cardRequest.ReadyForDelivery = true;
            }
            else
            {
                cardRequest.Status = "مرفوض من التواصل الداخلي";
            }

            cardRequest.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "تم تسجيل القرار بنجاح", status = cardRequest.Status, otpCode });
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

            var cardRequest = await _db.CardRequests.FirstOrDefaultAsync(r => r.RequestId == id);

            if (cardRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            if (cardRequest.Status != "بانتظار التسليم" || cardRequest.IsDelivered)
            {
                return BadRequest(new { message = "هذا الطلب غير جاهز للتسليم" });
            }

            var otp = await _db.OtpVerifications
                .Where(o => o.RequestId == id && !o.IsVerified)
                .OrderByDescending(o => o.GeneratedAt)
                .FirstOrDefaultAsync();

            if (otp == null)
            {
                return BadRequest(new { message = "لا يوجد رمز تحقق فعال لهذا الطلب" });
            }

            if (otp.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "انتهت صلاحية رمز التحقق" });
            }

            if (otp.AttemptCount >= MaxOtpAttempts)
            {
                return BadRequest(new { message = "تجاوزت الحد الأقصى لمحاولات إدخال الرمز" });
            }

            if (otp.Code != request.Code)
            {
                otp.AttemptCount += 1;
                await _db.SaveChangesAsync();
                return BadRequest(new { message = "رمز التحقق غير صحيح", attemptsRemaining = MaxOtpAttempts - otp.AttemptCount });
            }

            otp.IsVerified = true;
            otp.VerifiedAt = DateTime.UtcNow;

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