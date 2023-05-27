import express from 'express'
import dotenv from 'dotenv'
import router from './auth/routes/routes.js'

const app = express()
dotenv.config({ path: './.env' })

app.use(router)

app.listen(7300, () => {
  console.log(`Server rocking on port ${process.env.PORT}`)
})
