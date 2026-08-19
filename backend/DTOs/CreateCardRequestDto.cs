namespace CardManagementSystem.Api.DTOs
{
    public class CreateCardRequestDto
    {
        public string RequestType { get; set; } = string.Empty; // إصدار جديد / تجديد / فقدان / إتلاف
        public IFormFile? Photo { get; set; }
    }
}