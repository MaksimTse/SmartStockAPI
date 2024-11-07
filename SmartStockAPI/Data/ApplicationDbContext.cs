using Microsoft.EntityFrameworkCore;
using SmartStockAPI.Models;
using System.Collections.Generic;

namespace SmartStockAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Storage> Storages { get; set; }
    }
}
