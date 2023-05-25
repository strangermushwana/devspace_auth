import express from 'express'
import jwt from 'jsonwebtoken'
import db from './db.js'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('I am alive!')
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  const user = db.find((_user) => _user.username === username && _user.password === password)
  if (user) {
    // const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, '')
    return res.json(user)
  }
  res.status(400).json('Username or Password incorrect')
})

app.listen(7300, () => {
  console.log('Server rocking on port 7300', )
})