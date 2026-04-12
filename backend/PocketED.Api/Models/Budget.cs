namespace PocketED.Api.Models;

public class Budget
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double Limit { get; set; }
    public string Period { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}
