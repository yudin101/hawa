export const generateQueryString = (
  table:
    | "users"
    | "addresses"
    | "categories"
    | "products"
    | "carts"
    | "cart_items"
    | "order_items",
  mainQueryString: string,
) => {
  const userSelectQuery = `
    SELECT
      n.id,
      r.role,
      n.username,
      n.email,
      n.phone_number AS "phoneNumber",
      a.id AS "addressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName"
    FROM new_table n
    JOIN roles r ON n.role_id = r.id
    JOIN addresses a ON n.address_id = a.id`;

  const addressSelectQuery = `
    SELECT
      id,
      district,
      municipality,
      street_name AS "streetName"
    FROM new_table n
    WHERE id = n.id`;

  const categoriesSelectQuery = `
    SELECT
      id,
      category
    FROM new_table n
    WHERE id = n.id`;

  const productsSelectQuery = `
    SELECT
      n.id,
      n.name,
      n.picture_url AS "pictureUrl",
      n.body,
      c.id AS "categoryId",
      c.category,
      u.id AS "sellerId",
      u.username AS "sellerName",
      n.available_units AS "availableUnits",
      n.price
    FROM new_table n
    INNER JOIN categories c ON n.category_id = c.id
    INNER JOIN users u ON n.seller_id = u.id`;

  const cartsSelectQuery = `
    SELECT
      id,
      user_id AS "userId"
    FROM new_table`;

  const cartItemsSelectQuery = `
    SELECT
      c.id AS "cartId",
      n.id AS "itemId",
      p.id AS "productId",
      p.name AS "productName",
      p.picture_url AS "productPictureUrl",
      p.body AS "productBody",
      ct.category AS "productCategory",
      u.id AS "sellerId",
      u.username AS "seller",
      p.available_units AS "availableUnits",
      p.price AS "unitPrice",
      n.quantity,
      (n.quantity * p.price) AS "totalPrice",
      c.last_modified AS "lastModified"
    FROM new_table n
    LEFT JOIN carts c ON c.id = n.cart_id
    LEFT JOIN products p ON p.id = n.product_id
    LEFT JOIN categories ct ON ct.id = p.category_id
    LEFT JOIN users u ON u.id = p.seller_id`;

  const orderItemsSelectQuery = `
    SELECT
      o.id AS "orderId",
      o.status,
      o.order_date AS "orderDate",
      o.total_price AS "totalPrice",
      o.delivery_address_id AS "deliveryAddressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName",
      o.payment_method AS "paymentMethod",
      oi.product_id AS "productId",
      p.name AS "productName",
      oi.quantity,
      oi.unit_price AS "unitPrice"
    FROM new_table oi
    INNER JOIN products p ON oi.product_id = p.id
    INNER JOIN orders o ON oi.order_id = o.id
    INNER JOIN addresses a ON o.delivery_address_id = a.id`

  const tableRelation = {
    users: userSelectQuery,
    addresses: addressSelectQuery,
    categories: categoriesSelectQuery,
    products: productsSelectQuery,
    carts: cartsSelectQuery,
    cart_items: cartItemsSelectQuery,
    order_items: orderItemsSelectQuery,
  };

  return `WITH new_table AS (
    ${mainQueryString}
    RETURNING *
    )
    ${tableRelation[table]}`;
};
