using SmartStockAPI.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Order
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public Storage? Product { get; set; } // Сделать опциональным

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; } // Сделать опциональным

    [Required]
    public int Quantity { get; set; }

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.Now;

    public string? Notes { get; set; }
}
