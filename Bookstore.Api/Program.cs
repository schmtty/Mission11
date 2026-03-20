using Bookstore.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Enables OpenAPI metadata for easier endpoint testing in development.
builder.Services.AddOpenApi();
// Registers EF Core so we can query Bookstore.sqlite through BookstoreContext.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreDb")));
// Allows the Vite client app to call this API from a different origin.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowClient");

// Returns a paged list of books plus total count for client-side pagination UI.
app.MapGet("/api/books", async (
    BookstoreContext context,
    int pageSize = 5,
    int pageNum = 1,
    string sort = "asc") =>
{
    // Guards against invalid query values and very large page sizes.
    var normalizedPageSize = Math.Clamp(pageSize, 1, 100);
    var normalizedPageNum = Math.Max(pageNum, 1);
    var sortDescending = string.Equals(sort, "desc", StringComparison.OrdinalIgnoreCase);

    // Sorts by title in ascending or descending order.
    var query = sortDescending
        ? context.Books.OrderByDescending(b => b.Title)
        : context.Books.OrderBy(b => b.Title);

    // Count all books, then return only the requested page.
    var totalBooks = await context.Books.CountAsync();
    var books = await query
        .Skip((normalizedPageNum - 1) * normalizedPageSize)
        .Take(normalizedPageSize)
        .ToListAsync();

    return Results.Ok(new
    {
        books,
        totalBooks
    });
});

app.Run();
