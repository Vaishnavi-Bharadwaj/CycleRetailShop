using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.API.Models
{
    public class Cycle
    {
        public int Id { get; set; }

        [Required]
        public string ModelName { get; set; }

        [Required]
        public string Brand { get; set; }

        public string Type { get; set; }  // Road, Mountain, Hybrid, Electric

        public decimal Price { get; set; }

        public int Stock { get; set; }  // Quantity Available
    }
}
