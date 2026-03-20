using Bookstore.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreDb")));
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

app.MapGet("/api/books", async (
    BookstoreContext context,
    int pageSize = 5,
    int pageNum = 1,
    string sort = "asc") =>
{
    var normalizedPageSize = Math.Clamp(pageSize, 1, 100);
    var normalizedPageNum = Math.Max(pageNum, 1);
    var sortDescending = string.Equals(sort, "desc", StringComparison.OrdinalIgnoreCase);

    var query = sortDescending
        ? context.Books.OrderByDescending(b => b.Title)
        : context.Books.OrderBy(b => b.Title);

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
