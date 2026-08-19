namespace CardManagementSystem.Api.Models
{
    public class CardRequest
    {
        public int RequestId { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public string RequestType { get; set; } = string.Empty; // إصدار جديد / تجديد / فقدان / إتلاف
        public string Status { get; set; } = "قيد المراجعة";

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool ReadyForDelivery { get; set; } = false;
        public bool IsDelivered { get; set; } = false;

        public ICollection<RequestAttachment> Attachments { get; set; } = new List<RequestAttachment>();
        public ICollection<RequestApproval> Approvals { get; set; } = new List<RequestApproval>();
    }
}