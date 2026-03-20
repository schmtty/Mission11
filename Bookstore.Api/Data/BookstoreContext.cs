using System;
using System.Collections.Generic;
using Bookstore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Data;

// EF Core DbContext that maps C# classes to database tables.
public partial class BookstoreContext : DbContext
{
    public BookstoreContext()
    {
    }

    public BookstoreContext(DbContextOptions<BookstoreContext> options)
        : base(options)
    {
    }

    // Represents the Books table in Bookstore.sqlite.
    public virtual DbSet<Book> Books { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            // Mirrors the unique index that exists in the SQLite database.
            entity.HasIndex(e => e.BookId, "IX_Books_BookID").IsUnique();

            // Maps C# property names to exact column names in the table.
            entity.Property(e => e.BookId).HasColumnName("BookID");
            entity.Property(e => e.Isbn).HasColumnName("ISBN");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
