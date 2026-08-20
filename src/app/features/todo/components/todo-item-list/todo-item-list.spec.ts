import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemList } from './todo-item-list';

describe('TodoItemList', () => {
  let component: TodoItemList;
  let fixture: ComponentFixture<TodoItemList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemList],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
