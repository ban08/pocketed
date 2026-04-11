namespace PocketED.Api.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;

    public List<Expense> Expenses { get; set; } = [];
    public List<Budget> Budgets { get; set; } = [];
}
