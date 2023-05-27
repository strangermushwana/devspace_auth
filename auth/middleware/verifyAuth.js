import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config({ path: '../../.env' })

export function verify(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json('Invalid token')
      }
      req.user = user
      next()
    })
    return
  }
  res.status(401).json('Not authenticated')
}
