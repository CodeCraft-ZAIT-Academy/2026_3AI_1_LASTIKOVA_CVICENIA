
import { Injectable, signal, computed } from '@angular/core';
import { Book } from './book';
import { generateBooks } from './book-generator';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly myBooks: Book[] = [
    {
      id: 1,
      title: 'Hobit',
      author: 'J. R. R. Tolkien',
      year: 1937,
      available: true,
      genre: 'Fantasy',
      rating: 5,
      pages: 310,
      favorite: false
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      available: false,
      genre: 'Dystopia',
      rating: 4,
      pages: 328,
      favorite: false
    },
    {
      id: 3,
      title: 'Malý princ',
      author: 'Antoine de Saint-Exupéry',
      year: 1943,
      available: true,
      genre: 'Fiction',
      rating: 5,
      pages: 96,
      favorite: false
    }
  ];

  private maxBorrowed: number = 10;

  private readonly _books = signal<Book[]>(
    this.limitBorrowed(this.myBooks.concat(generateBooks(40, 4)))
  );

  readonly books = this._books.asReadonly();

  readonly borrowedBooks = computed(() =>
    this.books().filter(book => !book.available)
  );

  readonly availableBooks = computed(() =>
    this.books().filter(book => book.available)
  );

  readonly favoriteBooks = computed(() =>
    this.books().filter(book => book.favorite)
  );

  limitBorrowed(books: Book[]): Book[] {
    let borrowedCount = 0;

    return books.map(book => {
      if (book.available) {
        return book;
      }

      borrowedCount++;

      if (borrowedCount > this.maxBorrowed) {
        return { ...book, available: true };
      }

      return book;
    });
  }

  getBooks(): Book[] {
    return [...this.books()];
  }

  getBookById(id: number): Book | undefined {
    return this.books().find(book => book.id === id);
  }

  getAvailableBooks(): Book[] {
    return this.availableBooks();
  }

  getFavoriteBooks(): Book[] {
    return this.favoriteBooks();
  }

  getTotalBookCount(): number {
    return this.books().length;
  }

  getBorrowedBookCount(): number {
    return this.borrowedBooks().length;
  }

  canBorrow(id: number): boolean {
    const book = this.getBookById(id);

    return !!book &&
      book.available &&
      this.borrowedBooks().length < this.maxBorrowed;
  }

  addBook(book: Book): void {
    this._books.update(oldBooks => {
      const maxId = Math.max(0, ...oldBooks.map(b => b.id));

      return [{ ...book, id: maxId + 1 }, ...oldBooks];
    });
  }

  updateBook(updated: Book): void {
    this._books.update(books =>
      books.map(book =>
        book.id === updated.id ? updated : book
      )
    );
  }

  deleteBook(id: number): void {
    this._books.update(books =>
      books.filter(book => book.id !== id)
    );
  }

  borrowBook(id: number): boolean {
    if (!this.canBorrow(id)) {
      return false;
    }

    this._books.update(books =>
      books.map(book =>
        book.id === id
          ? { ...book, available: false }
          : book
      )
    );

    return true;
  }

  returnBook(id: number): void {
    this._books.update(books =>
      books.map(book =>
        book.id === id
          ? { ...book, available: true }
          : book
      )
    );
  }

  toggleFavorite(id: number): void {
    this._books.update(books =>
      books.map(book =>
        book.id === id
          ? { ...book, favorite: !book.favorite }
          : book
      )
    );
  }

  getFilteredBooks(
    searchText: string,
    availability: string,
    sortBy: string
  ): Book[] {
    const text = searchText.trim().toLowerCase();

    let result = this.books().filter(book =>
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text)
    );

    if (availability === 'available') {
      result = result.filter(book => book.available);
    } else if (availability === 'borrowed') {
      result = result.filter(book => !book.available);
    }

    switch (sortBy) {
      case 'title':
        result = [...result].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case 'year':
        result = [...result].sort((a, b) => b.year - a.year);
        break;

      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }

  countAvailableBooks(): number {
    return this.availableBooks().length;
  }

  countFavoriteBooks(): number {
    return this.favoriteBooks().length;
  }

  countAllBooks(): number {
    return this.books().length;
  }
}
