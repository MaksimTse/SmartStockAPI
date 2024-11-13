using System;
using System.ComponentModel.DataAnnotations;

namespace SmartStockAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; } = "user";

        public DateTime LastLoginDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? PhoneNumber { get; set; }
    }
}
