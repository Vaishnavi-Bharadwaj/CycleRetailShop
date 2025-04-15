using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.API.Models
{
    public class Customer
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } 

        [Required]
        public string Email { get; set; }

        public string Phone { get; set; } 
    }
}
