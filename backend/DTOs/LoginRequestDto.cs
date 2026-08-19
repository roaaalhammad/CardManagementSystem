namespace CardManagementSystem.Api.DTOs
{
    public class LoginRequestDto
    {
        public string NationalId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}