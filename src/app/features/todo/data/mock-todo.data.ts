import { ToDoList } from "../../../core/models/todos/todo-list/todo-list.model";

export const USERID: number = 1;

export const TODO_LISTS: ToDoList[] = [
    {
        id: 1,
        title: "list1",
        description: "description1",
        toDoItemsList: [
            {
                id: 1,
                title: "item1",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 1,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },

            {
                id: 2,
                title: "item2",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 1,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },
        ],
        userId: 1,
        createdAt: Date.now(),
        updatedetAt: Date.now()
    },

    {
        id: 2,
        title: "list2",
        description: "description2",
        toDoItemsList: [
            {
                id: 3,
                title: "item1",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 2,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },

            {
                id: 4,
                title: "item2",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 2,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },
        ],
        userId: 1,
        createdAt: Date.now(),
        updatedetAt: Date.now()
    },

    {
        id: 3,
        title: "list3",
        description: "description3",
        toDoItemsList: [
            {
                id: 5,
                title: "item1",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 3,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },

            {
                id: 6,
                title: "item2",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 3,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },

            {
                id: 7,
                title: "item3",
                description: null,
                isCompleted: false,
                isImportant: false,
                toDoListId: 3,
                completedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                toDoSubItems: null
            },
        ],
        userId: 1,
        createdAt: Date.now(),
        updatedetAt: Date.now()
    },
]