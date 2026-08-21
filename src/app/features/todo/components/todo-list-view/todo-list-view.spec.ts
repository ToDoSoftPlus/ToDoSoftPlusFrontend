import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListView } from './todo-list-view';

describe('TodoListView', () => {
  let component: TodoListView;
  let fixture: ComponentFixture<TodoListView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListView],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
