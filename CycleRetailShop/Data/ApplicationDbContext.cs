using Microsoft.EntityFrameworkCore;
using CycleRetailShop.API.Models;

namespace CycleRetailShop.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Cycle> Cycles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<PaymentDetails> PaymentDetails { get; set; }
    }
}
