export const generateQueryString = (
  table: "users" | "addresses",
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

  const tableRelation = {
    users: userSelectQuery,
    addresses: addressSelectQuery,
  };

  return `WITH new_table AS (
    ${mainQueryString}
    RETURNING *
    )
    ${tableRelation[table]}`;
};
