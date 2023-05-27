import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config({ path: '../../.env' })

export function generateAccessToken(user) {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin },
    process.env['JWT_SECRET'], { expiresIn: '59m' })
}

export function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin},
    process.env['JWT_REFRESH_SECRET'])
}
