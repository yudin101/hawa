import { Pool, types } from "pg";
import env from "./env";

// Converting any number values returned from db into string
types.setTypeParser(23, (val) => val.toString());

const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  database: env.DB_NAME,
  port: env.DB_PORT,
});

export const initializeSchema = async (): Promise<void> => {
  try {
    const roles = `
      CREATE TABLE IF NOT EXISTS roles (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        role VARCHAR(30) UNIQUE NOT NULL
    );`;

    const categories = `
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        category VARCHAR(50) UNIQUE NOT NULL
    );`;

    const addresses = `
      CREATE TABLE IF NOT EXISTS addresses (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        district VARCHAR(50) NOT NULL,
        municipality VARCHAR(50) NOT NULL,
        street_name VARCHAR(50) NOT NULL
    );`;

    const users = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        role_id BIGINT NOT NULL REFERENCES roles (id),
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR (72) NOT NULL,
        phone_number BIGINT UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address_id BIGINT NOT NULL REFERENCES addresses(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

    const refreshTokens = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        jti VARCHAR(36) PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`;

    const products = `
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        picture_url TEXT NOT NULL,
        body TEXT NOT NULL,
        category_id BIGINT NOT NULL REFERENCES categories (id),
        seller_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        available_units BIGINT NOT NULL,
        price NUMERIC(10, 2) NOT NULL
    );`;

    const carts = `
      CREATE TABLE IF NOT EXISTS carts (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (user_id)
    );`;

    const cartItems = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        cart_id BIGINT NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
        product_id BIGINT NOT NULL REFERENCES products (id),
        quantity INTEGER NOT NULL,
        UNIQUE (cart_id, product_id)
    );`;

    const orders = `
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users (id),
        status TEXT NOT NULL DEFAULT 'PENDING'
          CONSTRAINT chk_order_status
          CHECK (status IN ('PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
        order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        total_price NUMERIC(10, 2) NOT NULL,
        delivery_address_id BIGINT NOT NULL REFERENCES addresses (id),
        payment_method TEXT NOT NULL
          CONSTRAINT chk_order_payment_method
          CHECK (payment_method IN ('CASH', 'ONLINE'))
    );`;

    const orderItems = `
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        order_id BIGINT NOT NULL REFERENCES orders (id),
        product_id BIGINT NOT NULL REFERENCES products (id),
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        UNIQUE (order_id, product_id)
    );`;

    const updateFunction = `
      CREATE OR REPLACE FUNCTION set_last_modified_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.last_modified = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    const cartUpdateTrigger = `
      DROP TRIGGER IF EXISTS set_cart_timestamp ON carts;

      CREATE TRIGGER set_cart_timestamp
      BEFORE UPDATE ON carts
      FOR EACH ROW
      EXECUTE PROCEDURE set_last_modified_timestamp();
    `;

    const tableQueries =
      roles +
      categories +
      addresses +
      users +
      refreshTokens +
      products +
      carts +
      cartItems +
      orders +
      orderItems;
    const updateTriggerQueies = updateFunction + cartUpdateTrigger;

    const finalQuery = tableQueries + updateTriggerQueies;

    await pool.query(finalQuery);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default pool;
