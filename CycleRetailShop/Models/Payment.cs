using System.ComponentModel.DataAnnotations;

public class PaymentRequest
{
    [Required]
    public string PaymentMethod { get; set; }
    public string TransactionId { get; set; }
}
