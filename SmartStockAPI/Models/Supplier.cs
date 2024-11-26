using System.ComponentModel.DataAnnotations;

namespace SmartStockAPI.Models
{
    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string ContactEmail { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public bool IsApproved { get; set; } = false;
    }
}
