namespace CardManagementSystem.Api.DTOs
{
    public class ApprovalDecisionDto
    {
        public string Decision { get; set; } = string.Empty; // Approved / Rejected
        public string? Notes { get; set; }
    }
}