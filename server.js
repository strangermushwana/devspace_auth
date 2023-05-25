import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from './db.js'

const app = express()
dotenv.config({ path: './.env' })
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('I am alive!')
})

let refreshTokens = []

const verify = (req, res, next) => {
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

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin},
    process.env['JWT_SECRET'], { expiresIn: '10m' })
}

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin},
    process.env['JWT_REFRESH_SECRET'], { expiresIn: '10m' })
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = db.find((_user) => _user.username === username && _user.password === password)
  if (user) {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokens.push(refreshToken)
    return res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken: accessToken,
      refreshToken: refreshToken,
    })
  }
  res.status(400).json('Username or Password incorrect')
})



app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.status(401).json('Not authenticated')
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json('Invalid token')
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    err && console.log(err)
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    refreshTokens.push(newRefreshToken)
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  })
})

app.delete('/api/auth/delete/:id', verify, (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    return res.status(200).json('User deleted')
  }
  return res.status(403).json('You are not allowed to delete this user')
})

app.listen(7300, () => {
  console.log('Server rocking on port 7300', )
})