# Hawa E-commerce API

## Run Locally

**Clone the project**

```bash
git clone https://github.com/yudin101/hawa.git
```

**Go to the project directory**

```bash
cd hawa
```

**Install dependencies**

```bash
npm install
```

**Setup environment vairables**

```bash
echo "NODE_ENV='production'" > .env
echo "FRONTEND_URL='https://frontend.url'" >> .env
echo "SERVER_URL='https://server.url'" >> .env
echo "SERVER_PORT=server_port" >> .env
echo "DB_USER='db_username'" >> .env
echo "DB_PASSWORD='db_password'" >> .env
echo "DB_HOST='db_host'" >> .env
echo "DB_NAME='db_name'" >> .env
echo "DB_PORT=db_port" >> .env
echo "JWT_SECRET='jwt_secret'" >> .env
echo "JWT_REFRESH_SECRET='jwt_refresh_secret'" >> .env
```

**Start the development server**

```bash
npm run dev
```
> [!IMPORTANT]
> After starting the development server, find the docs at `/api/docs`

## Contributing

Contributions are always welcome!

If you'd like to contribute to this project, you can:

- **Create an Issue**: Report bugs or suggest features by [creating an issue](https://github.com/yudin101/hawa/issues/new).
- **Open a Pull Request**: Submit code changes or improvements by [opening a pull request](https://github.com/yudin101/hawa/pulls).

## License

This project is licensed under the [MIT License](https://github.com/yudin101/hawa/blob/main/LICENSE).
