import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as AWS  from 'aws-sdk'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

function createDynamoDBClient() {
    return new AWS.DynamoDB.DocumentClient()
}

  
export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexTable = process.env.INDEX_NAME
     ) {
  }

  async getAllTodos(userId:string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.indexTable,
        ProjectionExpression: "todoId, createdAt, #name, dueDate, done, attachmentUrl",
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeNames: {
         "#name": "name",
       },   
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()     

    const items = result.Items
    return items as TodoItem[]
  }

  
  async updateTodoItem(userId:string, todoId:string, updatedTodo: TodoUpdate): Promise<TodoUpdate> {

    var params = {
        TableName:this.todosTable,
        Key:{
          "userId": userId,
          "todoId": todoId
        },
        UpdateExpression: "SET #name = :newName, dueDate = :newDueDate, done = :newDone",
        ExpressionAttributeNames: {
          "#name": "name"
        }, 
        ExpressionAttributeValues:{
            ":newName": updatedTodo.name,
            ":newDueDate": updatedTodo.dueDate,
            ":newDone": updatedTodo.done
        },
        ReturnValues:"UPDATED_NEW"
      };
    
      const result = await this.docClient.update(params).promise()
      return result.Attributes as TodoUpdate
  }

  async updateImageTodoItem(userId:string, todoId:string, imageUrl:string): Promise<TodoItem> {
    var params = {
        TableName: this.todosTable,
        Key:{
          "userId": userId,
          "todoId": todoId
        },
        UpdateExpression: "SET attachmentUrl = :url",
        ExpressionAttributeValues:{
            ":url": imageUrl
        },
        ReturnValues:"UPDATED_NEW"
      }
    
      const result = await this.docClient.update(params).promise()
      return result.Attributes as TodoItem
  }
  
  async createTodoItem(userId:string, todoId:string, newTodo:CreateTodoRequest): Promise<TodoItem> {
    const newItem = {
        userId: userId, // Can be abbreviated to just "userId,"        
        todoId : todoId,
        createdAt: new Date().toISOString(),
        done: false,
        //attachmentUrl: "http://example.com/image.png", // This will be added with generateUploadUrl
        ...newTodo
    }
  
    await this.docClient.put({
        TableName: this.todosTable,
        Item : newItem
    }).promise()
    
    return newItem as TodoItem
  }
  

  async deleteTodoItem(userId: string, todoId:string): Promise<TodoItem> {
    var params = {
        TableName: this.todosTable,
        Key:{
          "userId": userId,      
          "todoId":todoId
        }
      };
    
    const result = await this.docClient.delete(params).promise()
    return result.Attributes as TodoItem
  }
}
