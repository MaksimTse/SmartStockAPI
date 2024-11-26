using System.ComponentModel.DataAnnotations;

public class SupplierLoginDto
{
    [Required]
    public string ContactEmail { get; set; }

    [Required]
    public string PasswordHash { get; set; }
}
