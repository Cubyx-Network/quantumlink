import { NextFunction, Request, Response } from "express";
import { prisma } from "./main";

export async function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const route = req.originalUrl;

  const link = await prisma.link.findFirst({
    where: {
      id: route,
    },
  });

  if (!link) return next();

  res.redirect(link.url);
}
