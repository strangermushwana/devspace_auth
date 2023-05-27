import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { verify } from "../middleware/verifyAuth.js"
import { generateAccessToken, generateRefreshToken } from '../utils/utils.js'
import db from '../../db.js'

const router = express.Router()
dotenv.config({ path: '../../.env' })
const PATH = '/api/auth'
let refreshTokens = []

router.use(express.json())

router.get('/', (req, res) => {
  res.status(200).json('I am alive!')
})

router.post(`${PATH}/login`, (req, res) => {
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

router.post(`${PATH}/logout`, verify, (req, res) => {
  const refreshToken = req.body.token
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
  res.status(200).json('Logged out')
})

router.post(`${PATH}/refresh`, (req, res) => {
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

router.delete(`${PATH}/delete/:id`, verify, (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    return res.status(200).json('User deleted')
  }
  return res.status(403).json('You are not allowed to delete this user')
})

export default router