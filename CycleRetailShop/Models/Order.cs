using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CycleRetailShop.API.Models
{
    public class Order
    {
        public int Id { get; set; }
 
        [Required]
        public int UserId { get; set; }
 
        [ForeignKey("UserId")]
        [JsonIgnore] // Prevents circular reference
        public User User { get; set; }
 
        [Required]
        public int CycleId { get; set; }
 
        [ForeignKey("CycleId")]
        public Cycle Cycle { get; set; }
 
        public int Quantity { get; set; }
 
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
 
        public string Status { get; set; } = "Pending";

        [Required]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }

    }
}
