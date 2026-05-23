using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketED.Api.Data;
using PocketED.Api.DTOs;
using PocketED.Api.Models;

namespace PocketED.Api.Controllers;

[ApiController]
[Route("api/users/{userId}/expenses")]
public class ExpensesController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddExpense(string userId, ExpenseRequest req)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId))
            return NotFound(new { message = "User not found." });

        var expense = new Expense
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Title = req.Title,
            Amount = req.Amount,
            Category = req.Category,
            Date = req.Date,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        db.Expenses.Add(expense);
        await db.SaveChangesAsync();

        return Created(string.Empty, new ExpenseResponse(expense.Id, expense.Title, expense.Amount, expense.Category, expense.Date));
    }
}
