namespace PocketED.Api.DTOs;

public record BudgetRequest(string Category, double Limit, string Period);
