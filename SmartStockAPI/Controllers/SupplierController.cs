using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStockAPI.Data;
using SmartStockAPI.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SmartStockAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SupplierController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSuppliers()
        {
            var suppliers = await _context.Suppliers.ToListAsync();
            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplierById(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();
            return Ok(supplier);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterSupplier([FromBody] Supplier supplier)
        {
            if (await _context.Suppliers.AnyAsync(s => s.ContactEmail == supplier.ContactEmail))
            {
                return BadRequest("A supplier with this email already exists.");
            }

            supplier.PasswordHash = HashPassword(supplier.PasswordHash);

            supplier.IsApproved = false;

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return Ok("Supplier registered successfully. Pending admin approval.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginSupplier([FromBody] SupplierLoginDto loginDto)
        {
            var supplier = await _context.Suppliers.SingleOrDefaultAsync(s => s.ContactEmail == loginDto.ContactEmail);
            if (supplier == null || supplier.PasswordHash != HashPassword(loginDto.PasswordHash))
            {
                return BadRequest("Invalid credentials.");
            }

            if (!supplier.IsApproved)
            {
                return BadRequest("Supplier account is not yet approved by admin.");
            }

            return Ok("Login successful.");
        }

        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveSupplier(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
            {
                return NotFound("Supplier not found.");
            }

            supplier.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok("Supplier approved successfully.");
        }


        [HttpPost]
        public async Task<IActionResult> AddSupplier(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return Ok(supplier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, Supplier updatedSupplier)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();

            supplier.Name = updatedSupplier.Name;
            supplier.ContactEmail = updatedSupplier.ContactEmail;
            supplier.PhoneNumber = updatedSupplier.PhoneNumber;
            supplier.Address = updatedSupplier.Address;

            await _context.SaveChangesAsync();
            return Ok(supplier);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound();

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return Ok("Supplier deleted successfully");
        }

        // Utility: Hashing password for security
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
