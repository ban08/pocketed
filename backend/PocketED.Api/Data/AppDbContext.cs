using Microsoft.EntityFrameworkCore;
using PocketED.Api.Models;

namespace PocketED.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasMany(u => u.Expenses).WithOne(ex => ex.User).HasForeignKey(ex => ex.UserId);
            e.HasMany(u => u.Budgets).WithOne(b => b.User).HasForeignKey(b => b.UserId);
            e.HasMany(u => u.Categories).WithOne(c => c.User).HasForeignKey(c => c.UserId);
        });

        modelBuilder.Entity<Expense>(e => e.HasKey(ex => ex.Id));
        modelBuilder.Entity<Budget>(e => e.HasKey(b => b.Id));
        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => new { c.UserId, c.NormalizedName }).IsUnique();
        });
    }
}
