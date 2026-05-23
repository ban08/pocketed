namespace PocketED.Api.DTOs;

public record ExpenseResponse(string Id, string Title, double Amount, string Category, string Date);
public record BudgetResponse(string Id, string Category, double Limit, string Period);
public record CategoryResponse(string Id, string Name);
public record UserAccountResponse(
    string Id,
    string Email,
    string Name,
    List<ExpenseResponse> Expenses,
    List<BudgetResponse> Budgets,
    List<CategoryResponse> Categories);
