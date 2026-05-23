using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketED.Api.Data;
using PocketED.Api.DTOs;
using PocketED.Api.Models;

namespace PocketED.Api.Controllers;

[ApiController]
[Route("api/users/{userId}/budgets")]
public class BudgetsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddOrUpdateBudget(string userId, BudgetRequest req)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId))
            return NotFound(new { message = "User not found." });

        var categoryName = CategoryCatalog.CleanName(req.Category);
        if (string.IsNullOrWhiteSpace(categoryName))
            return BadRequest(new { message = "Category is required." });

        var category = await CategoryCatalog.EnsureCategoryAsync(db, userId, categoryName);
        categoryName = category.Category.Name;

        var existing = await db.Budgets.FirstOrDefaultAsync(b =>
            b.UserId == userId && b.Category == categoryName && b.Period == req.Period);

        if (existing is not null)
        {
            existing.Limit = req.Limit;
            await db.SaveChangesAsync();
            return Created(string.Empty, new BudgetResponse(existing.Id, existing.Category, existing.Limit, existing.Period));
        }

        var budget = new Budget
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Category = categoryName,
            Limit = req.Limit,
            Period = req.Period,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        db.Budgets.Add(budget);
        await db.SaveChangesAsync();

        return Created(string.Empty, new BudgetResponse(budget.Id, budget.Category, budget.Limit, budget.Period));
    }
}
