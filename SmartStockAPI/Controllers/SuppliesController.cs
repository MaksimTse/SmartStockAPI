using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStockAPI.Data;
using SmartStockAPI.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SmartStockAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SuppliesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToSupply([FromBody] Supply supply)
        {
            if (supply.Quantity <= 0)
                return BadRequest("Invalid quantity.");

            var product = await _context.Storage.FindAsync(supply.ProductId);
            if (product == null)
                return NotFound("Product not found.");

            product.Quantity += supply.Quantity;

            _context.Supplies.Add(supply);
            await _context.SaveChangesAsync();

            return Ok("Product added to supply.");
        }

        [HttpGet("view")]
        public async Task<IActionResult> GetSupplies(int supplierId)
        {
            var supplies = await _context.Supplies
                .Where(s => s.SupplierId == supplierId)
                .Include(s => s.Product)
                .Select(s => new
                {
                    s.Id,
                    s.Quantity,
                    s.SupplyDate,
                    ProductName = s.Product.ProductName,
                    SupplierPrice = s.Product.SupplierPrice
                })
                .ToListAsync();

            if (supplies == null || supplies.Count == 0)
                return NotFound("No supplies found for this supplier.");

            return Ok(supplies);
        }
    }
}
