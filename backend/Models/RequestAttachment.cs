namespace CardManagementSystem.Api.Models
{
    public class RequestAttachment
    {
        public int AttachmentId { get; set; }

        public int RequestId { get; set; }
        public CardRequest? Request { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}