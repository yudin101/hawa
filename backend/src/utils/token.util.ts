import jwt from "jsonwebtoken";

export const getTokenExipry = (token: string): Date | undefined => {
  try {
    const decodedPayload = jwt.decode(token);

    if (
      decodedPayload &&
      typeof decodedPayload === "object" &&
      "exp" in decodedPayload
    ) {
      const expTimestamp = decodedPayload.exp;

      if (expTimestamp) {
        const expiryDate = new Date(expTimestamp * 1000);
        return expiryDate;
      }
    }

    return undefined;
  } catch (err) {
    throw err;
  }
};

export const getTokenJti = (token: string): string | undefined => {
  try {
    const decodedPayload = jwt.decode(token);

    if (
      decodedPayload &&
      typeof decodedPayload === "object" &&
      "jti" in decodedPayload
    ) {
      return decodedPayload.jti as string;
    }

    return undefined;
  } catch (err) {
    throw err;
  }
};
