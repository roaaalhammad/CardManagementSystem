namespace CardManagementSystem.Api.DTOs
{
    public class CardDesignDto
    {
        public int RequestId { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string NationalId { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int CopyNumber { get; set; }
        public DateTime IssueDate { get; set; }
        public string? PhotoUrl { get; set; }
        public bool IsLocked { get; set; }
    }

    public class SaveCardDesignDto
    {
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public IFormFile? Photo { get; set; }
    }
}