import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToDoSidebarList } from './create-todo-sidebar-list';

describe('CreateTodoSidebarList', () => {
  let component: CreateToDoSidebarList;
  let fixture: ComponentFixture<CreateToDoSidebarList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateToDoSidebarList],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateToDoSidebarList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
