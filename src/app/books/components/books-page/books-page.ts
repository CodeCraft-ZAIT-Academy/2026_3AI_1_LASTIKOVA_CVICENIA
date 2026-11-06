import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookDetail } from '../book-detail/book-detail';
import { BookService } from '../../book.service';
import { Book } from '../../book';

@Component({
  selector: 'app-book-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, BookDetail],
  templateUrl: './books-page.html',
  styleUrl: './books-page.css'
})
export class BookPage {
  private bookService = inject(BookService);

  id = input.required<string>();

  readonly book = computed(() => this.bookService.getBookById(Number(this.id())));

  borrow(book: Book): void {
    if (!this.bookService.borrowBook(book.id)) {
      alert('Knihu teraz nie je možné vypožičať.');
    }
  }

  giveBack(book: Book): void {
    this.bookService.returnBook(book.id);
  }

  toggleFavorite(book: Book): void {
    this.bookService.toggleFavorite(book.id);
  }
}