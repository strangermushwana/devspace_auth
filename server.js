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

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = db.find((_user) => _user.username === username && _user.password === password)
  if (user) {
    const accessToken = jwt.sign(
      { 
        id: user.id, isAdmin: user.isAdmin
      },
      process.env['JWT_SECRET'],
      { expiresIn: 30 })
    return res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      token: accessToken,
    })
  }
  res.status(400).json('Username or Password incorrect')
})

// app.post('/api/auth/refresh', (req, res) => {

// })

app.delete('/api/auth/delete/:id', verify, (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    return res.status(200).json('User deleted')
  }
  return res.status(403).json('You are not allowed to delete this user')
})

app.listen(7300, () => {
  console.log('Server rocking on port 7300', )
})