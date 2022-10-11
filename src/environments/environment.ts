import { Environment } from './ienvironment';

export const environment: Environment = {
  name: 'dev',
  production: false,
  // apiBaseUrl: 'https://www.doctorsand.com/api/api/',
  apiBaseUrl: 'http://localhost:8000/api/',
  // documentsBaseUrl: 'https://www.doctorsand.com/api',
  // apiBaseUrl: 'http://localhost:8000/api/',
  documentsBaseUrl: 'http://localhost:8000',
};