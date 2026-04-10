using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketED.Api.Data;
using PocketED.Api.DTOs;
using PocketED.Api.Models;

namespace PocketED.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already in use." });

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = req.Name,
            Email = req.Email,
            Password = req.Password,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAccount), new { id = user.Id }, new { user.Id, user.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email && u.Password == req.Password);
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(new { user.Id, user.Email });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccount(string id)
    {
        var user = await db.Users
            .Include(u => u.Expenses)
            .Include(u => u.Budgets)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            return NotFound(new { message = "User not found." });

        var response = new UserAccountResponse(
            user.Id,
            user.Email,
            user.Name,
            user.Expenses.Select(e => new ExpenseResponse(e.Id, e.Title, e.Amount, e.Category, e.Date)).ToList(),
            user.Budgets.Select(b => new BudgetResponse(b.Id, b.Category, b.Limit, b.Period)).ToList()
        );

        return Ok(response);
    }
}
