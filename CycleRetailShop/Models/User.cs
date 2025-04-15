using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; } = "Customer";  // Default role

        public string? Email { get; set; }

        public string? Phone { get; set; }
    }
}
