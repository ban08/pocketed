using Microsoft.EntityFrameworkCore;
using PocketED.Api.Models;

namespace PocketED.Api.Data;

public static class CategoryCatalog
{
    public static string CleanName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return string.Empty;
        }

        var parts = name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return string.Join(' ', parts);
    }

    public static string NormalizeName(string? name) => CleanName(name).ToUpperInvariant();

    public static async Task<(Category Category, bool Created)> EnsureCategoryAsync(
        AppDbContext db,
        string userId,
        string name)
    {
        var cleanName = CleanName(name);
        if (string.IsNullOrWhiteSpace(cleanName))
        {
            throw new ArgumentException("Category name is required.", nameof(name));
        }

        var normalizedName = NormalizeName(cleanName);
        var existing = await db.Categories.FirstOrDefaultAsync(c =>
            c.UserId == userId && c.NormalizedName == normalizedName);

        if (existing is not null)
        {
            return (existing, false);
        }

        var category = new Category
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Name = cleanName,
            NormalizedName = normalizedName,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        db.Categories.Add(category);
        return (category, true);
    }

    public static async Task<List<Category>> SyncUserCategoriesAsync(AppDbContext db, string userId)
    {
        var categories = await db.Categories
            .Where(c => c.UserId == userId)
            .ToListAsync();

        var known = categories.ToDictionary(c => c.NormalizedName, c => c);
        var expenseCategories = await db.Expenses
            .Where(e => e.UserId == userId && e.Amount >= 0 && e.Category != string.Empty)
            .Select(e => e.Category)
            .ToListAsync();

        var budgetCategories = await db.Budgets
            .Where(b => b.UserId == userId && b.Category != string.Empty)
            .Select(b => b.Category)
            .ToListAsync();

        var createdAny = false;
        foreach (var name in expenseCategories.Concat(budgetCategories))
        {
            var cleanName = CleanName(name);
            if (string.IsNullOrWhiteSpace(cleanName))
            {
                continue;
            }

            var normalizedName = NormalizeName(cleanName);
            if (known.ContainsKey(normalizedName))
            {
                continue;
            }

            var category = new Category
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Name = cleanName,
                NormalizedName = normalizedName,
                CreatedAt = DateTime.UtcNow.ToString("o")
            };

            db.Categories.Add(category);
            categories.Add(category);
            known[normalizedName] = category;
            createdAny = true;
        }

        if (createdAny)
        {
            await db.SaveChangesAsync();
        }

        return categories.OrderBy(c => c.Name).ToList();
    }
}
