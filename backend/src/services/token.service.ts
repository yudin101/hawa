import jwt from "jsonwebtoken";

export const getTokenExipry = (token: string): Date | undefined => {
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
};

export const getTokenJti = (token: string): string | undefined => {
  const decodedPayload = jwt.decode(token);

  if (
    decodedPayload &&
    typeof decodedPayload === "object" &&
    "jti" in decodedPayload
  ) {
    return decodedPayload.jti as string;
  }

  return undefined;
};
