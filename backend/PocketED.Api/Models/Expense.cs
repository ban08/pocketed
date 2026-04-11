namespace PocketED.Api.Models;

public class Expense
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public double Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}
