
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId:string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodoItem(userId:string, todoId:string, newTodo: CreateTodoRequest): Promise<TodoItem> {
    return todoAccess.createTodoItem(userId, todoId, newTodo)
}

export async function updateTodoItem(userId:string, todoId:string, updatedTodo: TodoUpdate): Promise<TodoUpdate> {
    return todoAccess.updateTodoItem(userId, todoId, updatedTodo)
}

export async function deleteTodoItem(userId:string, todoId:string): Promise<TodoItem> {
    return todoAccess.deleteTodoItem(userId, todoId)
}

export async function updateImageTodoItem(userId:string, todoId:string, imageUrl:string): Promise<TodoItem> {
    return todoAccess.updateImageTodoItem(userId, todoId, imageUrl)
}
