import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../book';
import { BookDetail } from '../book-detail/book-detail';
import { BookForm } from '../book-form/book-form';
import { getGenreColor } from '../../genre-colors';

@Component({
  selector: 'app-book-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, BookDetail, BookForm],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input.required<Book>();
  borrowed = output<void>();
  returned = output<void>();
  edited = output<Book>();
  deleted = output<void>();

  showDetails: boolean = false;
  favorite: boolean = false;
  editing: boolean = false;
  confirmingDelete: boolean = false;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  toggleFavorite(): void {
    this.book().favorite = !this.book().favorite;
  }

  startEdit(): void {
    this.editing = true;
  }

  saveEdit(book: Book): void {
    this.edited.emit(book);
    this.editing = false;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  askDelete(): void {
    this.confirmingDelete = true;
  }

  cancelDelete(): void {
    this.confirmingDelete = false;
  }

  confirmDelete(): void {
    this.deleted.emit();
  }

  borrow(): void {
    this.borrowed.emit();
  }

  giveBack(): void {
    this.returned.emit();
  }

  genreColor(): string {
    return getGenreColor(this.book().genre);
  }
}