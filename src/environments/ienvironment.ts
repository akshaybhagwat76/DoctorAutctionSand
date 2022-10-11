export interface Environment {
  name: 'dev' | 'stage' | 'prod';
  production: boolean;
  apiBaseUrl: string;
  documentsBaseUrl: string;
}
