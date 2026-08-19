namespace CardManagementSystem.Api.Models
{
    public class CustodyReturn
    {
        public int CustodyReturnId { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int ReceivedById { get; set; }
        public User? ReceivedBy { get; set; }

        public string Reason { get; set; } = string.Empty; // استقالة / نقل / انتهاء عقد
        public DateTime ReturnedAt { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
    }
}