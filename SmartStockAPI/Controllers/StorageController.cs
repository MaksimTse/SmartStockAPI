using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStockAPI.Data;
using SmartStockAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace SmartStockAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StorageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StorageController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all products in storage
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Storage.ToListAsync();
            return Ok(products);
        }

        // Get product by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Storage.FindAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // Add a new product
        [HttpPost]
        public async Task<IActionResult> AddProduct(Storage product)
        {
            _context.Storage.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // Update an existing product
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Storage updatedProduct)
        {
            var product = await _context.Storage.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Category = updatedProduct.Category;
            product.Location = updatedProduct.Location;
            product.ProductName = updatedProduct.ProductName;
            product.Quantity = updatedProduct.Quantity;
            product.Orderer = updatedProduct.Orderer;
            product.Date = updatedProduct.Date;
            product.AdditionalInfo = updatedProduct.AdditionalInfo;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // Delete a product
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Storage.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Storage.Remove(product);
            await _context.SaveChangesAsync();
            return Ok("Product deleted successfully");
        }

        // View inventory by location
        [HttpGet("by-country/{location}")]
        public async Task<IActionResult> GetProductsByCountry(string location)
        {
            var products = await _context.Storage
                                         .Where(p => p.Location == location)
                                         .ToListAsync();
            return Ok(products);
        }

        // Generate a simple invoice (JSON response with selected fields)
        [HttpGet("generate-invoice/{id}")]
        public async Task<IActionResult> GenerateInvoice(int id)
        {
            var product = await _context.Storage.FindAsync(id);
            if (product == null)
                return NotFound();

            var invoice = new
            {
                InvoiceNumber = $"INV-{id}-{DateTime.Now:yyyyMMddHHmmss}",
                ProductName = product.ProductName,
                Quantity = product.Quantity,
                UnitPrice = 10,
                TotalPrice = product.Quantity * 10,
                Orderer = product.Orderer,
                OrderDate = product.Date,
                AdditionalInfo = product.AdditionalInfo,
                DueDate = DateTime.Now.AddDays(30)
            };

            return Ok(invoice);
        }
    }
}
