import { randomBytes } from "node:crypto";

export const generateTransactionId = () => {
  return `TXN-${Date.now()}-${randomBytes(4).toString("hex")}`;
};
