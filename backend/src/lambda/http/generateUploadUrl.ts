import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { updateImageTodoItem } from '../../businessLogic/todos'


const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

//const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("todoId", todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log('Processing event: ', event)

  // generate url 
  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  const userId = getUserId(event)

  //update the todoitem with the imageUrl
  /*
  var params = {
    TableName:todosTable,
    Key:{
      "userId": userId,
      "todoId": todoId
    },
    UpdateExpression: "SET attachmentUrl = :url",
    ExpressionAttributeValues:{
        ":url": imageUrl
    },
    ReturnValues:"UPDATED_NEW"
  };

  const result = await docClient.update(params).promise()
  */
  const result = await updateImageTodoItem(userId, todoId, imageUrl)
  console.log("result getUpdateURl", result)


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },    
    body: JSON.stringify({
        uploadUrl: url
    })
  }

}


function getUploadUrl(imageId: string){
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: parseInt(urlExpiration)
    })
}
