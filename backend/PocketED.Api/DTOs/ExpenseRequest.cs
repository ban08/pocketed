namespace PocketED.Api.DTOs;

public record ExpenseRequest(string Title, double Amount, string Category, string Date);
