namespace CardManagementSystem.Api.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string FullNameAr { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
}