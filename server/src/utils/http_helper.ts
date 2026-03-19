import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`https://famous-dassie-15.clerk.accounts.dev/.well-known/jwks.json`),
);

async function getClerkId(headers: Record<string, string>) {
  const token = headers["authorization"]?.split(" ")[1];
  if (!token)
    return {
      clerk_id: null,
      success: false,
    };

  const { payload } = await jwtVerify(token, JWKS);
  return {
    clerk_id: payload.sub as string,
    success: true,
  }; // this is the clerk user id
}

export { getClerkId };
