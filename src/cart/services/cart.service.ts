import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem, CartProductItem } from '../models';
import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false,
  },
};

export async function getDBClient() {
  const client = new Client(dbOptions);
  await client.connect();

  return client;
}

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const client = await getDBClient();
    const cartResult = await client.query(
      `SELECT id FROM carts WHERE user_id='${userId}'`,
    );

    const result = await client.query(
      `SELECT * FROM carts INNER JOIN cart_items ON carts.id=cart_items.cart_id WHERE user_id='${userId}'`,
    );

    if (!result.rows.length) {
      if (cartResult.rows.length) {
        return {
          id: cartResult.rows[0].id,
          items: [],
        };
      }
      return null;
    }

    return {
      id: result.rows[0].cart_id,
      items: result.rows.reduce(
        (memo, row) => [
          ...memo,
          {
            id: row.product_id,
            count: row.count,
          },
        ],
        [],
      ),
    };
  }

  async createByUserId(userId: string) {
    const id = v4(v4());

    const client = await getDBClient();

    await client.query(
      `INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
      ('${id}', '${userId}', '${new Date().toISOString()}', '${new Date().toISOString()}', 'OPEN')`,
    );

    return {
      id,
      items: [],
    };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { product, count }: CartProductItem,
  ): Promise<Cart> {
    const { id, items } = await this.findOrCreateByUserId(userId);

    const client = await getDBClient();

    const item = items.find(({ id }) => id == product.id);

    if (item) {
      if (!count) {
        return await client.query(
          `DELETE FROM cart_items WHERE product_id='${product.id}'`,
        );
      }
      return await client.query(
        `UPDATE cart_items SET count=${count} WHERE product_id='${product.id}'`,
      );
    } else {
      return await client.query(
        `INSERT INTO cart_items (cart_id, product_id, count) VALUES
        ('${id}', '${product.id}', 1)`,
      );
    }
  }

  async removeByUserId(userId): Promise<void> {
    const client = await getDBClient();
    await client.query(`DELETE FROM carts WHERE user_id='${userId}'`);
  }
}
