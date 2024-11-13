using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStockAPI.Data;
using SmartStockAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SmartStockAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Product)
                .Include(o => o.User)
                .Select(o => new
                {
                    o.Id,
                    ProductName = o.Product.ProductName,
                    UserEmail = o.User.Email,
                    o.Quantity,
                    o.OrderDate,
                    o.Notes
                })
                .ToListAsync();

            return Ok(orders);
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = await _context.Storage.FindAsync(order.ProductId);
                if (product == null)
                {
                    return NotFound(new { message = "Product not found" });
                }

                if (product.Quantity < order.Quantity)
                {
                    return BadRequest(new { message = "Insufficient product quantity" });
                }

                var user = await _context.Users.FindAsync(order.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                product.Quantity -= order.Quantity;
                order.OrderDate = DateTime.UtcNow;
                _context.Orders.Add(order);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Order created successfully" });
            }
            catch (Exception ex)
            {
                // Логируем ошибку
                Console.WriteLine($"Error creating order: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderNotes(int id, [FromBody] Order order)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            existingOrder.Notes = order.Notes; // Обновляем заметку

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order notes updated successfully" });
        }

    }
}
