namespace CardManagementSystem.Api.Models
{
    public class AuditLog
    {
        public int AuditLogId { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public string Action { get; set; } = string.Empty; // Create / Update / Delete / Approve / Reject...
        public string EntityName { get; set; } = string.Empty; // اسم الجدول المتأثر
        public int? EntityId { get; set; }
        public string? Details { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}