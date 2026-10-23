
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { BookCard } from '../book-card/book-card';
import { BookForm } from '../book-form/book-form';
import { Cart } from '../../../cart/components/cart/cart';
import { Book } from '../../book';
import { BookService } from '../../book.service';

@Component({
  selector: 'app-book-list',
  imports: [
    BookCard,
    BookForm,
    Cart,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList {
  private bookService = inject(BookService);

  readonly books = this.bookService.books;
  readonly borrowedBooks = this.bookService.borrowedBooks;
  readonly maxBorrowed = this.bookService['maxBorrowed'];

  readonly totalBooks = computed(() => this.bookService.books().length);
  readonly totalAvailableBooks = computed(() => this.bookService.availableBooks().length);

  readonly searchText = signal('');
  readonly availability = signal('all');
  readonly sortBy = signal('none');
  readonly showFavorites = signal(false);

  readonly currentPage = signal(1);
  readonly pageSize = signal(5);
  readonly pageSizes = [5, 10, 20];

  resetFilters(): void {
    this.searchText.set('');
    this.availability.set('all');
    this.sortBy.set('none');
    this.showFavorites.set(false);
    this.firstPage();
  }

  refreshBooks(): void {
    this.bookService.getBooks();
  }

  clearSearch(): void {
    this.searchText.set('');
    this.firstPage();
  }

  addBook(book: Book): void {
    this.bookService.addBook(book);
    this.firstPage();
  }

  updateBook(updated: Book): void {
    this.bookService.updateBook(updated);
  }

  deleteBook(deleted: Book): void {
    this.bookService.deleteBook(deleted.id);

    if (this.currentPage() > this.pageCount()) {
      this.lastPage();
    }
  }

  borrow(book: Book): void {
    if (!this.bookService.borrowBook(book.id)) {
      alert('Knihu teraz nie je možné vypožičať.');
    }
  }

  giveBack(book: Book): void {
    this.bookService.returnBook(book.id);
  }

  readonly visibleBooks = computed(() => {
    let result = this.bookService.getFilteredBooks(
      this.searchText(),
      this.availability(),
      this.sortBy()
    );

    if (this.showFavorites()) {
      result = result.filter(book => book.favorite);
    }

    return result;
  });

  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.visibleBooks().length / this.pageSize()))
  );

  readonly pagedBooks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();

    return this.visibleBooks().slice(
      start,
      start + this.pageSize()
    );
  });

  readonly firstShown = computed(() =>
    this.visibleBooks().length === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1
  );

  readonly lastShown = computed(() =>
    Math.min(
      this.currentPage() * this.pageSize(),
      this.visibleBooks().length
    )
  );

  readonly pages = computed(() =>
    Array.from({ length: this.pageCount() }, (_, i) => i + 1)
  );

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    this.currentPage.update(p => Math.min(this.pageCount(), p + 1));
  }

  firstPage(): void {
    this.currentPage.set(1);
  }

  lastPage(): void {
    this.currentPage.set(this.pageCount());
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.max(1, Math.min(page, this.pageCount())));
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.firstPage();
  }

  toggleFavorite(book: Book): void {
    this.bookService.toggleFavorite(book.id);
  }
}
