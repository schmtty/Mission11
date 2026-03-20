import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Book = {
  bookId: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

type BooksResponse = {
  books: Book[]
  totalBooks: number
}

function App() {
  // UI state for the current page of books and paging controls.
  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Computes total pages each time totalBooks or pageSize changes.
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalBooks / pageSize)),
    [totalBooks, pageSize],
  )

  useEffect(() => {
    // Lets us cancel an in-flight fetch if inputs change quickly.
    const abortController = new AbortController()

    const loadBooks = async () => {
      try {
        setLoading(true)
        setError('')

        // Calls backend endpoint with paging and sorting query params.
        const response = await fetch(
          `/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sortOrder}`,
          { signal: abortController.signal },
        )

        if (!response.ok) {
          throw new Error('Failed to load books.')
        }

        const data: BooksResponse = await response.json()
        setBooks(data.books)
        setTotalBooks(data.totalBooks)
      } catch (err) {
        // Ignore abort errors, since those are expected during cleanup.
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError('Could not load books. Make sure the API is running.')
      } finally {
        setLoading(false)
      }
    }

    void loadBooks()

    // Cleanup runs when effect dependencies change or component unmounts.
    return () => abortController.abort()
  }, [pageNum, pageSize, sortOrder])

  useEffect(() => {
    // Keeps current page valid if page size changes and reduces page count.
    if (pageNum > totalPages) {
      setPageNum(totalPages)
    }
  }, [pageNum, totalPages])

  return (
    <main className="container py-4">
      <h1 className="mb-4">Online Bookstore</h1>

      <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
        <div>
          <label htmlFor="page-size" className="form-label mb-1">
            Results per page
          </label>
          <select
            id="page-size"
            className="form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPageNum(1)
            }}
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort-order" className="form-label mb-1">
            Sort by title
          </label>
          <select
            id="sort-order"
            className="form-select"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc')
              setPageNum(1)
            }}
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading books...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-primary"
          disabled={pageNum <= 1}
          onClick={() => setPageNum((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {pageNum} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={pageNum >= totalPages}
          onClick={() => setPageNum((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </main>
  )
}

export default App
