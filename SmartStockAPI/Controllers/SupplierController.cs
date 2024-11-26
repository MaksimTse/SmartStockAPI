using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartStockAPI.Data;
using SmartStockAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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

            // Генерация токена
            var token = GenerateJwtToken(supplier.Id, "supplier");

            return Ok(new
            {
                message = "Login successful",
                token
            });
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

        // Utility: Hashing password for security
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        // Utility: Generate JWT token
        private string GenerateJwtToken(int supplierId, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKey"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, supplierId.ToString()),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "YourIssuer",
                audience: "YourAudience",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
