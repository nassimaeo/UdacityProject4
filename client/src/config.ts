// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'tw6yisagx0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-g1xa92ox.auth0.com',            // Auth0 domain
  clientId: 'huXNluDb1z6SbH2DDZfHx5nT9URFGz54',          // Auth0 client id
  callbackUrl: 'https://sheltered-mesa-3475.herokuapp.com/callback'
}
