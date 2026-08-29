import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemView } from './todo-item-view';

describe('TodoItemView', () => {
  let component: TodoItemView;
  let fixture: ComponentFixture<TodoItemView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemView],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
