import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories';

const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
const patter = /(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})/;


export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!emailRegex.test(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'Password must be minimum 8 characters',
    );
  }



  if (!patter.test(credentials.password)) {
    throw new HttpErrors.UnprocessableEntity(
      'The key must contain uppercase, lowercase and digits'
    );
  }
}
