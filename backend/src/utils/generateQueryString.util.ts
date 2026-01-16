export const generateQueryString = (
  table: "users" | "addresses" | "categories" | "products",
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

  const tableRelation = {
    users: userSelectQuery,
    addresses: addressSelectQuery,
    categories: categoriesSelectQuery,
    products: productsSelectQuery,
  };

  return `WITH new_table AS (
    ${mainQueryString}
    RETURNING *
    )
    ${tableRelation[table]}`;
};
