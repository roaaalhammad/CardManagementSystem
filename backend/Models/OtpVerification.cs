namespace CardManagementSystem.Api.Models
{
    public class OtpVerification
    {
        public int OtpId { get; set; }

        public int RequestId { get; set; }
        public CardRequest? Request { get; set; }

        public string Code { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }

        public bool IsVerified { get; set; } = false;
        public DateTime? VerifiedAt { get; set; }
        public int AttemptCount { get; set; } = 0;
    }
}