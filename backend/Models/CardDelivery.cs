namespace CardManagementSystem.Api.Models
{
    public class CardDelivery
    {
        public int DeliveryId { get; set; }

        public int RequestId { get; set; }
        public CardRequest? Request { get; set; }

        public int DeliveredById { get; set; }
        public User? DeliveredBy { get; set; }

        public DateTime DeliveredAt { get; set; } = DateTime.UtcNow;
    }
}