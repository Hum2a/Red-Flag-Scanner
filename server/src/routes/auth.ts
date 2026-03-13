import { Router, type Request, type Response } from 'express'
import { getAuthUrl, exchangeCodeForToken } from '../services/instagramService.js'

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

export function createAuthRouter() {
  const router = Router()

  router.get('/instagram', (_req: Request, res: Response) => {
    try {
      const url = getAuthUrl()
      res.redirect(url)
    } catch (e) {
      console.error('Auth URL error:', e)
      res.redirect(`${FRONTEND_URL}?error=instagram_not_configured`)
    }
  })

  router.get('/instagram/callback', async (req: Request, res: Response) => {
    const { code, error } = req.query
    if (error) {
      res.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(String(error))}`)
      return
    }
    if (!code || typeof code !== 'string') {
      res.redirect(`${FRONTEND_URL}?error=no_code`)
      return
    }

    try {
      const { accessToken, userId } = await exchangeCodeForToken(code)
      req.session.instagramAccessToken = accessToken
      req.session.instagramUserId = userId
      req.session.save((err: Error | null) => {
        if (err) {
          console.error('Session save error:', err)
          res.redirect(`${FRONTEND_URL}?error=session_failed`)
          return
        }
        res.redirect(`${FRONTEND_URL}?instagram=connected`)
      })
    } catch (e) {
      console.error('OAuth callback error:', e)
      const msg = e instanceof Error ? e.message : 'auth_failed'
      res.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(msg)}`)
    }
  })

  router.get('/instagram/status', (req: Request, res: Response) => {
    const connected = !!req.session.instagramAccessToken
    res.json({ data: { connected } })
  })

  router.post('/instagram/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ data: { ok: true } })
    })
  })

  return router
}
