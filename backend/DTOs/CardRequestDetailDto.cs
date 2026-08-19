namespace CardManagementSystem.Api.DTOs
{
    public class CardRequestDetailDto
    {
        public int RequestId { get; set; }
        public string RequestType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool ReadyForDelivery { get; set; }
        public bool IsDelivered { get; set; }

        public string EmployeeNameAr { get; set; } = string.Empty;
        public string EmployeeNameEn { get; set; } = string.Empty;
        public string EmployeeNationalId { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;

        public List<AttachmentDto> Attachments { get; set; } = new();
        public List<ApprovalHistoryDto> Approvals { get; set; } = new();
    }

    public class AttachmentDto
    {
        public int AttachmentId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
    }

    public class ApprovalHistoryDto
    {
        public string ApprovalStage { get; set; } = string.Empty;
        public string Decision { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string ApproverNameAr { get; set; } = string.Empty;
        public DateTime DecidedAt { get; set; }
    }
}