import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookForm } from '../../../books/components/book-form/book-form';
import { BookService } from '../../../books/book.service';
import { Book } from '../../../books/book';

@Component({
  selector: 'app-admin-book-edit',
  imports: [BookForm, RouterLink],
  templateUrl: './admin-book-edit.html',
  styleUrl: './admin-book-edit.css'
})
export class AdminBookEdit {
  private bookService = inject(BookService);
  private router = inject(Router);

  id = input<string>();

  readonly isEditMode = computed(() => this.id() !== undefined);
  readonly book = computed(() => {
    const currentId = this.id();
    return currentId ? this.bookService.getBookById(Number(currentId)) : undefined;
  });

  save(book: Book): void {
    if (this.isEditMode()) {
      this.bookService.updateBook(book);
    } else {
      this.bookService.addBook(book);
    }
    this.router.navigate(['/admin']);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}