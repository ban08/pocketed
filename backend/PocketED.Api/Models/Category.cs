namespace PocketED.Api.Models;

public class Category
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}
