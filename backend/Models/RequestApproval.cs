namespace CardManagementSystem.Api.Models
{
    public class RequestApproval
    {
        public int ApprovalId { get; set; }

        public int RequestId { get; set; }
        public CardRequest? Request { get; set; }

        public int ApproverId { get; set; }
        public User? Approver { get; set; }

        public string ApprovalStage { get; set; } = string.Empty; // DirectManager / CommStaff / CommManager
        public string Decision { get; set; } = string.Empty; // Approved / Rejected
        public string? Notes { get; set; }

        public DateTime DecidedAt { get; set; } = DateTime.UtcNow;
    }
}