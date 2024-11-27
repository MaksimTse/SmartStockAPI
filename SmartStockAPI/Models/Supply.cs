using SmartStockAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Supply
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public Storage? Product { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [ForeignKey("SupplierId")]
    public Supplier? Supplier { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public DateTime SupplyDate { get; set; } = DateTime.Now;

    public string? Notes { get; set; }
}
