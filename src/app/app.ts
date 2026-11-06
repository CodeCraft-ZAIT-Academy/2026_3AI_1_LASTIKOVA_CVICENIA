import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BookService } from './books/book.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatBadgeModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private bookService = inject(BookService);
  readonly borrowedBooks = this.bookService.borrowedBooks;
}