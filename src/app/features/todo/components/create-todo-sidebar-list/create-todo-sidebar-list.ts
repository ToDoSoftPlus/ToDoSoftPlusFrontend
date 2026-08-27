import { Component, output, signal } from '@angular/core';
import { CreateToDoSidebarListModel } from '../../models/create-todo-sidebar-list.model';
import { form, maxLength, minLength, required, FormField } from '@angular/forms/signals';
import { AutofocusDirective } from "../../../../shared/directives/auto-focus.derective";

@Component({
  selector: 'app-create-todo-sidebar-list',
  imports: [FormField, AutofocusDirective],
  templateUrl: './create-todo-sidebar-list.html',
  styleUrl: './create-todo-sidebar-list.scss',
})
export class CreateToDoSidebarList {

  onSubmit = output<CreateToDoSidebarListModel>();
  onCancel = output<void>();

  createSidebarListModel = signal<CreateToDoSidebarListModel>({
    title: ''
  });

  createSidebarListForm = form(this.createSidebarListModel, (schema) => {
    required(schema.title);
    minLength(schema.title, 3);
    maxLength(schema.title, 100);
  });

  onSubmitForm(event: Event): void {
    event.preventDefault();
    if (this.createSidebarListForm().invalid()) {
      return;
    }

    this.onSubmit.emit({
      title: this.createSidebarListModel().title.trim()
    });
  }
}
