using System;
using System.ComponentModel.DataAnnotations;

namespace SmartStockAPI.Models
{
    public class Storage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public string Orderer { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string AdditionalInfo { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
