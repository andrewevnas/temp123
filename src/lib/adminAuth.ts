import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

function getKey() {
  const s = process.env.ADMIN_COOKIE_SECRET
  if (!s) throw new Error('ADMIN_COOKIE_SECRET not set')
  return new TextEncoder().encode(s)
}

export async function createAdminToken(sub = 'admin') {
  return new SignJWT({ role: 'admin', sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey())
}

export async function verifyAdminToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getKey())
  if (payload.role !== 'admin') throw new Error('invalid role')
  return payload
}
