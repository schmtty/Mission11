# Mission 11 - Online Bookstore

This project is an online bookstore app built with:

- `.NET 10` ASP.NET Core Web API
- `React + Vite + TypeScript`
- `SQLite` database (`Bookstore.sqlite`)
- `Bootstrap` for styling

The app displays books from the database and supports:

- Pagination (default 5 books per page)
- User-selectable page size
- Sorting by book title (A to Z / Z to A)

## Project Structure

- `Bookstore.Api` - Backend API and EF Core data access
- `bookstore-client` - Frontend React app
- `Bookstore.sqlite` - SQLite database used by the API

## Prerequisites

- .NET SDK 10+
- Node.js 22+ and npm

## How to Run

Run the API and client in separate terminals.

### 1) Start the API

```bash
cd Bookstore.Api
dotnet run
```

The API runs at `http://localhost:5000`.

### 2) Start the React Client

```bash
cd bookstore-client
npm install
npm run dev
```

The client runs at `http://localhost:5173`.

## Useful Commands

### Backend

```bash
cd Bookstore.Api
dotnet build
```

### Frontend

```bash
cd bookstore-client
npm run lint
npm run build
npm run format
```

## Notes

- The frontend is configured to proxy `/api` requests to `http://localhost:5000`.
- The API uses the SQLite connection string from `Bookstore.Api/appsettings.json`.
