using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PocketED.Api.Data;
using PocketED.Api.DTOs;

namespace PocketED.Api.Controllers;

[ApiController]
[Route("api/users/{userId}/categories")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCategories(string userId)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId))
            return NotFound(new { message = "User not found." });

        var categories = await CategoryCatalog.SyncUserCategoriesAsync(db, userId);

        return Ok(categories.Select(c => new CategoryResponse(c.Id, c.Name)).ToList());
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory(string userId, CategoryRequest req)
    {
        if (!await db.Users.AnyAsync(u => u.Id == userId))
            return NotFound(new { message = "User not found." });

        try
        {
            var result = await CategoryCatalog.EnsureCategoryAsync(db, userId, req.Name);
            await db.SaveChangesAsync();

            var response = new CategoryResponse(result.Category.Id, result.Category.Name);
            return result.Created ? Created(string.Empty, response) : Ok(response);
        }
        catch (ArgumentException)
        {
            return BadRequest(new { message = "Category name is required." });
        }
    }
}
