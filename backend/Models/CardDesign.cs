namespace CardManagementSystem.Api.Models
{
    public class CardDesign
    {
        public int CardDesignId { get; set; }

        public int RequestId { get; set; }
        public CardRequest? Request { get; set; }

        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;

        public string PhotoPath { get; set; } = string.Empty;
        public int CopyNumber { get; set; } = 1;
        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        public bool IsLocked { get; set; } = false;
        public bool IsPrinted { get; set; } = false;
        public DateTime? PrintedAt { get; set; }

        public int? LastEditedByUserId { get; set; }
        public DateTime? LastEditedAt { get; set; }
    }
}