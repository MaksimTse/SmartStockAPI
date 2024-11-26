using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartStockAPI.Models
{
    public class Storage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Required]
        public int Quantity { get; set; }

        public string? Orderer { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string? AdditionalInfo { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [ForeignKey("Supplier")]
        public int? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }

        [Required]
        public decimal SupplierPrice { get; set; } 

        [Required]
        public decimal UserPrice { get; set; }
    }
}
