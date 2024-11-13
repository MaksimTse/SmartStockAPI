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
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("User already exists");
            }

            user.PasswordHash = HashPassword(user.PasswordHash);
            user.CreatedDate = DateTime.Now;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully");
        }

        // Login a user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == login.Email);
            if (user == null || user.PasswordHash != HashPassword(login.PasswordHash))
            {
                return BadRequest(new { title = "Invalid credentials", status = 400 });
            }

            user.LastLoginDate = DateTime.Now;
            await _context.SaveChangesAsync();
            var role = user.Role;

            return Ok(new { message = "Login successful", role });
        }

        // Get all users (admin-only)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // Deactivate a user (admin-only)
        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok("User deactivated successfully");
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
