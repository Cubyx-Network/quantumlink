import { NextFunction, Request, Response } from 'express'
import { config, prisma } from './main'
import { status401 } from './response'

export async function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const route = req.originalUrl

  const link = await prisma.link.findFirst({
    where: {
      id: route,
    },
  })

  if (req.params.raw === 'true') {
    const auth = req.headers.authorization
    if (auth !== config.admin_secret) {
      return status401(res)
    }
    return res.json(link)
  }

  if (!link) return next()

  res.redirect(link.url)
}
