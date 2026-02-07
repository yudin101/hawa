declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    SERVER_PORT: string;
    SESSION_SECRET: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_NAME: string;
    DB_PORT: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
  }
}
