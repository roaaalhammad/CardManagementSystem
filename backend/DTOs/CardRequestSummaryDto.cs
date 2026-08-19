namespace CardManagementSystem.Api.DTOs
{
    public class CardRequestSummaryDto
    {
        public int RequestId { get; set; }
        public string RequestType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public bool ReadyForDelivery { get; set; }
        public bool IsDelivered { get; set; }

        public string EmployeeNameAr { get; set; } = string.Empty;
        public string EmployeeNationalId { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
    }
}