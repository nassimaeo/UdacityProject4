import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-g1xa92ox.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
  //START - MY CODE
  // we decoded jwt to check that the certificate we get from Auth0 will have the same kid as jwt
  // get information from the header sent by the user
  const decodedTokenKid = jwt.header.kid
  console.log("decoded toked (jwt) ", jwt)
  console.log("decodedTokenKid", decodedTokenKid)

  // getting the public key from Auth0
  var jwks;
  await Axios(jwksUrl).then((res)=>{
    console.log("res ", res)
    jwks = res.data; // or keys
    console.log("keys ", jwks)
  })
  
  //get the key pair used to sign the token included in the header
  const keyUser = getKey(jwks.keys, decodedTokenKid)
  //const cert = jwks.keys[0].x5t
  //console.log("cert (jwks.keys[0].x5t)", cert)
  const cert = keyUser.x5c[0]
  console.log("cert (jwks.keys[0].x5c[0])", cert)

  // converting certToPEM to make look better
  const pem = certToPEM(cert)
  console.log("pem ", pem)

  // vertifying the certifications
  const rs = verify(token, pem, { algorithms: ['RS256'] }) as JwtPayload
  //console.log("rs", rs)
  return rs
  //END - MY CODE
}

// Added this function, in case may certificates are return by Auth0
// we will get only the pair used by the token in the header
function getKey(keys, kid){
  return keys.find(key => key.kid === kid );
}

// Added this function to generate pem certificate
function certToPEM( cert ) {
  let pem = cert.match( /.{1,64}/g ).join( '\n' );
  pem = `-----BEGIN CERTIFICATE-----\n${ cert }\n-----END CERTIFICATE-----\n`;
  return pem;
}



function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
