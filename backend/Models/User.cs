namespace CardManagementSystem.Api.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string FullNameAr { get; set; } = string.Empty;
        public string FullNameEn { get; set; } = string.Empty;
        public string NationalId { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }

        public int RoleId { get; set; }
        public Role? Role { get; set; }

        // المدير المباشر (نفس الجدول، علاقة ذاتية)
        public int? ManagerId { get; set; }
        public User? Manager { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}