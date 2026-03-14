export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;
if (!WEBHOOK_SECRET) {
  throw new Error("WEBHOOK_SECRET environment variable is missing");
}
export const RZP_ID = process.env.RZP_ID!;
if (!RZP_ID) {
  throw new Error("RZP_ID environment variable is missing");
}
export const RZP_SECRET = process.env.RZP_SECRET!;
if (!RZP_SECRET) {
  throw new Error("RZP_SECRET environment variable is missing");
}
