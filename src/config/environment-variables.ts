import 'dotenv/config';

const requireProcessEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }

  return process.env[name];
};

export type EnvironmentVariables = {
  PORT: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  JWT_EXPIRES: string;
  SHOW_DOCS: boolean;
  STORAGE_TYPE: string;
  FILES_STORAGE_TYPE: 'local' | 'remote';
  API_URL: string;
  FRONT_URL: string;
  FRONT_BACKOFFICE_URL: string;
  SMTP_SERVICE?: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SHOULD_SEND_EMAILS: boolean;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
};

const environmentVariables: EnvironmentVariables = {
  PORT: process.env.PORT || '3001',
  JWT_SECRET: requireProcessEnv('JWT_SECRET'),
  DATABASE_URL: requireProcessEnv('DATABASE_URL'),
  JWT_EXPIRES: requireProcessEnv('JWT_EXPIRES'),
  STORAGE_TYPE: requireProcessEnv('STORAGE_TYPE'),
  FILES_STORAGE_TYPE: requireProcessEnv('FILES_STORAGE_TYPE') as
    | 'local'
    | 'remote',
  API_URL: requireProcessEnv('API_URL'),
  SHOW_DOCS: requireProcessEnv('SHOW_DOCS').toLowerCase() === 'true',
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_HOST: requireProcessEnv('SMTP_HOST'),
  SMTP_PORT: +requireProcessEnv('SMTP_PORT'),
  SMTP_USER: requireProcessEnv('SMTP_USER'),
  SMTP_PASS: requireProcessEnv('SMTP_PASS'),
  FRONT_URL: requireProcessEnv('FRONT_URL'),
  FRONT_BACKOFFICE_URL: requireProcessEnv('FRONT_BACKOFFICE_URL'),
  SHOULD_SEND_EMAILS:
    requireProcessEnv('SHOULD_SEND_EMAILS').toLowerCase() === 'true',
  AWS_REGION: requireProcessEnv('AWS_REGION'),
  AWS_ACCESS_KEY_ID: requireProcessEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: requireProcessEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_S3_BUCKET: requireProcessEnv('AWS_S3_BUCKET'),
};

export { environmentVariables };
