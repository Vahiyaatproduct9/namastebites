export const NEXT_PUBLIC_RZP_KEY = process.env.NEXT_PUBLIC_RZP_KEY!;
if (!NEXT_PUBLIC_RZP_KEY) {
  console.error("NEXT_PUBLIC_RZP_KEY missing!");
}
