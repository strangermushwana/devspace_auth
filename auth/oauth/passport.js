import passport from 'passport'
import dotenv from 'dotenv'
import * as psg from 'passport-google-oauth20'

export function ps() {
  dotenv.config({ path: '../../.env' })
  const GoogleStrategy = psg.Strategy
  passport.use(
    new GoogleStrategy({
      clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
      callbackURL:'/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile)
      done(null, profile)
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}