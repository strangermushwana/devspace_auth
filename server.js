import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from "express-session"
import passport from 'passport'
import router from './auth/routes/routes.js'
import { ps } from "./auth/oauth/passport.js"

const app = express()
dotenv.config({ path: './.env' })

app.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}))

app.use(session({
  secret:  process.env.EXPRESS_SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
ps() 

app.use(router)

app.listen(process.env.PORT, () => {
  console.log(`Server 🚀 on port ${process.env.PORT}`)
})
