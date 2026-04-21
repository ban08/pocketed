# pocketED Mermaid UML diagrams
*first revision / april 2026*

## Domain model

The following UML class diagram illustrates the key concepts and their relationships within pocketED:

```mermaid
  classDiagram
  User "1" --> "1" Wallet : owns
  Wallet "1" --> "*" Transaction : records
  Transaction <|-- Income
  Transaction <|-- Expense
  Expense "*" --> "1" Category : belongs to
  Statistics --> Transaction : analyzes
  
  class User {
      username : String
      email : String
  }
  
  class Wallet {
      totalBalance : Double
      monthlyLimit : Double
  }
  
  class Transaction {
      amount : Double
      date : Date
      description : String
  }
  
  class Income {
      source : String
  }
  
  class Expense {
      categoryId : String
  }
  
  class Category {
      name : String
  }
  
  class Statistics {
      totalIn : Double
      totalOut : Double
  }
```

## Logical architecture

The logical structure of the current implementation is organized into the following packages:

```mermaid
flowchart LR
    subgraph Routes["app/ - Expo Router layer"]
        RootLayout["_layout.tsx\nRoot stack + providers"]
        AuthRoutes["auth/\nwelcome, login, register"]
        TabRoutes["(tabs)/\nindex, explore"]
        ModalRoute["modal.tsx"]
    end

    subgraph Screens["src/screens/ - Presentation layer"]
        WelcomeScreen["WelcomeScreen"]
        LoginScreen["LoginScreen"]
        RegisterScreen["RegisterScreen"]
        DashboardScreen["DashboardScreen"]
    end

    subgraph State["src/context/ - State layer"]
        AuthContext["AuthContext"]
        AuthReducer["authReducer"]
    end

    subgraph Services["src/services/ - Service layer"]
        AuthService["authService"]
        ExpenseService["expenseService"]
    end

    subgraph Domain["src/models/ - Domain layer"]
        UserModel["User"]
        ExpenseModel["Expense"]
    end

    subgraph Shared["Shared resources"]
        Theme["src/theme/\ncolors, spacing, typography"]
        Data["src/data/\nexpenses.json"]
        Assets["src/resources/\nimages"]
    end

    RootLayout --> AuthRoutes
    RootLayout --> TabRoutes
    RootLayout --> ModalRoute
    RootLayout --> AuthContext

    AuthRoutes --> WelcomeScreen
    AuthRoutes --> LoginScreen
    AuthRoutes --> RegisterScreen
    TabRoutes --> DashboardScreen

    WelcomeScreen --> Theme
    WelcomeScreen --> Assets
    LoginScreen --> Theme
    LoginScreen --> Assets
    RegisterScreen --> Theme
    RegisterScreen --> Assets
    DashboardScreen --> Theme

    LoginScreen --> AuthContext
    RegisterScreen --> AuthContext
    DashboardScreen --> AuthContext
    AuthContext --> AuthReducer
    AuthContext --> UserModel

    LoginScreen -. future integration .-> AuthService
    RegisterScreen -. future integration .-> AuthService
    DashboardScreen --> ExpenseService
    ExpenseService --> ExpenseModel
    ExpenseService --> Data
```
- `app/`: route entry points and layouts. The root layout defines the navigation stack and wraps the app with the authentication provider.
- `src/screens/`: screen-level UI implementations such as welcome, login, register and dashboard.
- `src/context/`: shared application state, currently centered on `AuthContext` and its reducer.
- `src/services/`: data access and business-facing operations, such as loading expenses from the local dataset.
- `src/models/`: typed domain entities like `User` and `Expense`.
- `src/theme/`: shared visual tokens, including colors, spacing, and typography.
- `src/data/` and `src/resources/`: bundled mock data and static media assets.

The dependency flow is intentionally one-directional: routes render screens, screens consume context and services, and services rely on models plus local data sources. This reduces coupling and keeps the UI replaceable without changing the lower layers.