# pocketED — Backend API Documentation

> **ASP.NET Core 10 · SQLite3 · REST**

---

> [!CAUTION]
> ## THIS IS NOT A COMMERCIAL PRODUCT
>
> This backend is a **proof-of-concept prototype** built for academic demonstration purposes only.
>
> - Passwords are stored in **plain text** — no hashing, no encryption.
> - There is **no authentication token system** — any caller who knows a user's ID can read or modify their data.
> - There is **no HTTPS** in the default configuration.
> - Data is **not secured** in any meaningful way.
>
> **Do not use this to store real personal or financial data. Do not expose this to the public internet without understanding these risks.**

---

## Table of Contents

1. [Overview](#overview)
2. [Running the API](#running-the-api)
3. [Reaching the API Over the Web](#reaching-the-api-over-the-web)
4. [Interactive Docs (Scalar UI)](#interactive-docs-scalar-ui)
5. [Database](#database)
6. [Endpoints](#endpoints)
   - [Register](#post-apiusersregister)
   - [Login](#post-apiuserslogin)
   - [Get Account](#get-apiusersid)
   - [List Categories](#get-apiusersidcategories)
   - [Create Category](#post-apiusersidcategories)
   - [Add Expense](#post-apiusersidhexpenses)
   - [Add / Update Budget](#post-apiusersidbudgets)
7. [Error Reference](#error-reference)

---

## Overview

The pocketED backend exposes a simple REST API that the mobile app consumes. It handles user accounts, expense history, and budget tracking. All data is persisted in a local SQLite file (`pocketed.db`) that is created automatically on first run.

**Base URL (local):** `http://localhost:5022`  
**Base URL (network):** `http://<server-ip>:5022`

---

## Running the API

Requirements: [.NET 10 SDK](https://dotnet.microsoft.com/download)

```bash
cd backend/PocketED.Api
dotnet run
```

On first launch the database file `pocketed.db` is created automatically in the project directory. No manual migration steps are needed.

You should see:

```
Now listening on: http://0.0.0.0:5022
Application started. Press Ctrl+C to shut down.
```

To keep the API running permanently (survives terminal close and reboots), see the [systemd section](#running-permanently-with-systemd) below.

---

## Reaching the API Over the Web

The machine running this API has a fixed public IPv4 address. As long as the API is running and port `5022` is open in the firewall, any device on the internet can reach it.

### One-time firewall setup (run on the server)

```bash
sudo ufw allow 5022/tcp
sudo ufw reload
```

### Accessing it

Replace `<server-ip>` with the machine's fixed IPv4 address in every request:

```
http://<server-ip>:5022/api/users/register
http://<server-ip>:5022/api/users/login
http://<server-ip>:5022/api/users/{id}
...
```

The interactive docs are also accessible remotely at:

```
http://<server-ip>:5022/scalar/v1
```

### Running Permanently with systemd

```bash
# 1. Publish a release build
cd backend/PocketED.Api
dotnet publish -c Release -o /opt/pocketed-api

# 2. Create the service file
sudo nano /etc/systemd/system/pocketed-api.service
```

Paste the following:

```ini
[Unit]
Description=pocketED ASP.NET API
After=network.target

[Service]
WorkingDirectory=/opt/pocketed-api
ExecStart=/usr/bin/dotnet /opt/pocketed-api/PocketED.Api.dll
Restart=always
RestartSec=5
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://0.0.0.0:5022

[Install]
WantedBy=multi-user.target
```

```bash
# 3. Enable and start
sudo systemctl daemon-reload
sudo systemctl enable pocketed-api
sudo systemctl start pocketed-api

# 4. Check it's running
sudo systemctl status pocketed-api

# View live logs
journalctl -u pocketed-api -f
```

---

## Interactive Docs (Scalar UI)

The API ships with a built-in interactive interface powered by [Scalar](https://scalar.com). Open it in any browser:

```
http://localhost:5022/scalar/v1          # local
http://<server-ip>:5022/scalar/v1       # remote
```

From here you can read endpoint descriptions and send real requests without needing any external tool like Postman.

---

## Database

SQLite file: `backend/PocketED.Api/pocketed.db`

### Tables

#### `Users`

| Column      | Type | Notes                        |
|-------------|------|------------------------------|
| `Id`        | TEXT | Primary key, GUID            |
| `Name`      | TEXT | Display name                 |
| `Email`     | TEXT | Unique                       |
| `Password`  | TEXT | Plain text (PoC only)        |
| `CreatedAt` | TEXT | ISO 8601 datetime (UTC)      |

#### `Expenses`

| Column      | Type | Notes                                   |
|-------------|------|-----------------------------------------|
| `Id`        | TEXT | Primary key, GUID                       |
| `UserId`    | TEXT | Foreign key → `Users.Id`                |
| `Title`     | TEXT | Short description, e.g. `"Groceries"`   |
| `Amount`    | REAL | Decimal value, e.g. `25.5`              |
| `Category`  | TEXT | e.g. `"Food"`, `"Transport"`            |
| `Date`      | TEXT | ISO 8601 date, e.g. `"2026-04-10"`      |
| `CreatedAt` | TEXT | ISO 8601 datetime (UTC)                 |

#### `Budgets`

| Column      | Type | Notes                                      |
|-------------|------|--------------------------------------------|
| `Id`        | TEXT | Primary key, GUID                          |
| `UserId`    | TEXT | Foreign key → `Users.Id`                   |
| `Category`  | TEXT | e.g. `"Food"`, `"Transport"`               |
| `Limit`     | REAL | Maximum spending for this category         |
| `Period`    | TEXT | `"monthly"` or `"weekly"`                  |
| `CreatedAt` | TEXT | ISO 8601 datetime (UTC)                    |

> Each user can have one budget per `(Category, Period)` combination. Posting a duplicate upserts the `Limit`.

#### `Categories`

| Column           | Type | Notes                                      |
|------------------|------|--------------------------------------------|
| `Id`             | TEXT | Primary key, GUID                          |
| `UserId`         | TEXT | Foreign key -> `Users.Id`                  |
| `Name`           | TEXT | Display name, e.g. `"Food"`                |
| `NormalizedName` | TEXT | Uppercased name for duplicate prevention   |
| `CreatedAt`      | TEXT | ISO 8601 datetime (UTC)                    |

> Each user can only have one category per normalized name. The API also syncs categories from existing positive expenses and budgets so older data remains visible.

---

## Endpoints

### `POST /api/users/register`

Creates a new user account.

**Request body**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "1234"
}
```

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `name`     | string | yes      | Display name         |
| `email`    | string | yes      | Must be unique       |
| `password` | string | yes      | Plain text (PoC)     |

**Response `201 Created`**

```json
{
  "id": "8e3fee0c-d6a4-4568-b7d2-a5367adfe6b8",
  "email": "alice@example.com"
}
```

Save the returned `id` — it is required for all subsequent requests for this user.

**Response `409 Conflict`** — email already registered

```json
{ "message": "Email already in use." }
```

---

### `POST /api/users/login`

Validates credentials and returns the user's ID.

**Request body**

```json
{
  "email": "alice@example.com",
  "password": "1234"
}
```

**Response `200 OK`**

```json
{
  "id": "8e3fee0c-d6a4-4568-b7d2-a5367adfe6b8",
  "email": "alice@example.com"
}
```

**Response `401 Unauthorized`** — wrong email or password

```json
{ "message": "Invalid email or password." }
```

---

### `GET /api/users/{id}`

Returns the full account snapshot for a user, including all their expenses, budgets, and managed categories. This is the main endpoint the dashboard screen consumes.

**Path parameter**

| Parameter | Description                          |
|-----------|--------------------------------------|
| `id`      | The user's GUID returned at register/login |

**Example request**

```
GET /api/users/8e3fee0c-d6a4-4568-b7d2-a5367adfe6b8
```

**Response `200 OK`**

```json
{
  "id": "8e3fee0c-d6a4-4568-b7d2-a5367adfe6b8",
  "email": "alice@example.com",
  "name": "Alice",
  "expenses": [
    {
      "id": "f43a95f5-16fb-40d8-ac70-6b0e68717ecc",
      "title": "Groceries",
      "amount": 25.0,
      "category": "Food",
      "date": "2026-04-10"
    }
  ],
  "budgets": [
    {
      "id": "55f7938f-1457-4aaa-a940-2d641a6e48f1",
      "category": "Food",
      "limit": 300.0,
      "period": "monthly"
    }
  ],
  "categories": [
    {
      "id": "5ea9ce3d-6a77-4ab6-bfea-2481e3a3ed01",
      "name": "Food"
    }
  ]
}
```

**Response `404 Not Found`**

```json
{ "message": "User not found." }
```

---

### `GET /api/users/{id}/categories`

Returns the user's categories ordered by name.

**Response `200 OK`**

```json
[
  {
    "id": "5ea9ce3d-6a77-4ab6-bfea-2481e3a3ed01",
    "name": "Food"
  }
]
```

**Response `404 Not Found`** — user ID does not exist

```json
{ "message": "User not found." }
```

---

### `POST /api/users/{id}/categories`

Creates a managed category for the user. Names are trimmed, repeated spaces are collapsed, and duplicate names are matched case-insensitively.

**Request body**

```json
{
  "name": "Groceries"
}
```

**Response `201 Created`**

```json
{
  "id": "5ea9ce3d-6a77-4ab6-bfea-2481e3a3ed01",
  "name": "Groceries"
}
```

**Response `200 OK`** — category already exists

```json
{
  "id": "5ea9ce3d-6a77-4ab6-bfea-2481e3a3ed01",
  "name": "Groceries"
}
```

**Response `400 Bad Request`** — category name is blank

```json
{ "message": "Category name is required." }
```

---

### `POST /api/users/{id}/expenses`

Adds a new expense entry to the user's history. Positive expenses automatically create the category if it does not already exist.

**Path parameter**

| Parameter | Description         |
|-----------|---------------------|
| `id`      | The user's GUID     |

**Request body**

```json
{
  "title": "Bus ticket",
  "amount": 12.0,
  "category": "Transport",
  "date": "2026-04-10"
}
```

| Field      | Type   | Required | Description                          |
|------------|--------|----------|--------------------------------------|
| `title`    | string | yes      | Short description of the expense     |
| `amount`   | number | yes      | Cost as a decimal                    |
| `category` | string | yes      | Managed category label               |
| `date`     | string | yes      | ISO 8601 date (`"YYYY-MM-DD"`)       |

**Response `201 Created`**

```json
{
  "id": "a1b2c3d4-...",
  "title": "Bus ticket",
  "amount": 12.0,
  "category": "Transport",
  "date": "2026-04-10"
}
```

**Response `404 Not Found`** — user ID does not exist

```json
{ "message": "User not found." }
```

---

### `POST /api/users/{id}/budgets`

Adds a budget for a category and automatically creates the category if it does not already exist. If a budget for the same `(category, period)` already exists for this user, it updates the limit instead of creating a duplicate.

**Path parameter**

| Parameter | Description         |
|-----------|---------------------|
| `id`      | The user's GUID     |

**Request body**

```json
{
  "category": "Food",
  "limit": 300.0,
  "period": "monthly"
}
```

| Field      | Type   | Required | Description                               |
|------------|--------|----------|-------------------------------------------|
| `category` | string | yes      | Category to budget for                    |
| `limit`    | number | yes      | Maximum spending allowed                  |
| `period`   | string | yes      | `"monthly"` or `"weekly"`                 |

**Response `201 Created`**

```json
{
  "id": "55f7938f-...",
  "category": "Food",
  "limit": 300.0,
  "period": "monthly"
}
```

**Response `404 Not Found`** — user ID does not exist

```json
{ "message": "User not found." }
```

---

## Error Reference

| Status | Meaning                                                          |
|--------|------------------------------------------------------------------|
| `201`  | Resource created successfully                                    |
| `200`  | Request succeeded                                                |
| `401`  | Wrong credentials (login only)                                   |
| `404`  | The user ID provided does not exist                              |
| `409`  | Email already registered (register only)                         |
| `400`  | Malformed request body (missing required fields)                 |

All error responses follow the shape `{ "message": "..." }`.
