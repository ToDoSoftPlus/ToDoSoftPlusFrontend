import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSidebarList } from './todo-sidebar-list';

describe('TodoSidebarList', () => {
  let component: TodoSidebarList;
  let fixture: ComponentFixture<TodoSidebarList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSidebarList],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoSidebarList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
