import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BookService } from '../../../books/book.service';
import { Book } from '../../../books/book';

@Component({
  selector: 'app-admin-books',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './admin-books.html',
  styleUrl: './admin-books.css'
})
export class AdminBooks {
  private bookService = inject(BookService);

  readonly books = this.bookService.books;
  readonly confirmingDeleteId = signal<number | undefined>(undefined);

  askDelete(book: Book): void {
    this.confirmingDeleteId.set(book.id);
  }

  cancelDelete(): void {
    this.confirmingDeleteId.set(undefined);
  }

  confirmDelete(book: Book): void {
    this.bookService.deleteBook(book.id);
    this.confirmingDeleteId.set(undefined);
  }
}