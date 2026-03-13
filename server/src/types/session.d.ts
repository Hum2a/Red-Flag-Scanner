import 'express-session'

declare module 'express-session' {
  interface SessionData {
    instagramAccessToken?: string
    instagramUserId?: string
  }
}
