import pool from "../config/db";
import { Address } from "../types/address";
import { generateQueryString } from "../utils/generateQueryString.util";

export const findAddress = async (
  valueType: "id" | "other",
  addressData: {
    addressId?: string;
    district?: string;
    municipality?: string;
    streetName?: string;
  },
): Promise<false | Address> => {
  const { addressId, district, municipality, streetName } = addressData;

  if (valueType === "other" && (!district || !municipality || !streetName)) {
    return false;
  }

  let whereClause;
  let queryValues: (string | undefined)[] = [];

  if (addressId && valueType === "id") {
    whereClause = `id = $1`;
    queryValues = [addressId];
  } else {
    whereClause = `district = $1
      AND municipality = $2
      AND street_name = $3`;
    queryValues = [district, municipality, streetName];
  }

  const result = await pool.query(
    `SELECT * FROM addresses 
    WHERE ${whereClause}`,
    queryValues,
  );

  if (result.rows.length === 1) {
    return result.rows[0] as Address;
  }
  return false;
};

export const insertAddress = async (addressData: {
  district: string;
  municipality: string;
  streetName: string;
}) => {
  const { district, municipality, streetName } = addressData;

  const result = await pool.query(
    generateQueryString(
      "addresses",
      `INSERT INTO addresses (
        district,
        municipality,
        street_name
      ) VALUES ($1, $2, $3)`,
    ),
    [district, municipality, streetName],
  );

  return result.rows[0];
};
