import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  page = input.required<number>();
  pageSize = input.required<number>();
  totalCount = input.required<number>();
  totalPages = input.required<number>();
  hasNextPage = input.required<boolean>();
  hasPreviousPage = input.required<boolean>();

  nextPage = output<void>();
  previousPage = output<void>();

  firstPage = output<void>();
  lastPage = output<void>();

  onPreviousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    this.previousPage.emit();
  }

  onNextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.nextPage.emit();
  }

  onFirstPage(): void {
    if (this.page() === 1) {
      return;
    }

    this.firstPage.emit();
  }

  onLastPage(): void {
    if (this.page() === this.totalPages()) {
      return;
    }

    this.lastPage.emit();
  }
}
