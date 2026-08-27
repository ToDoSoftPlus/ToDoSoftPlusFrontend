import { TestBed } from '@angular/core/testing';

import { TodoSubItemService } from './todo-sub-item';

describe('TodoSubItem', () => {
  let service: TodoSubItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoSubItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
