import { Request, Response } from "express";
import { prisma } from "./main";

export async function POST(req: Request, res: Response) {
  const { id, url, description } = req.body;
  const auth = req.headers.authorization;

  if (!id || !url) return res.status(400).send("Bad Request");
  if (auth !== process.env.ADMIN_KEY) {
    return res.status(401).send("Unauthorized");
  }

  const link = await prisma.link.create({
    data: {
      id,
      url,
      description,
    },
  });

  return res.json(link);
}

export async function DELETE(req: Request, res: Response) {
  const { id } = req.body;
  const auth = req.headers.authorization;

  if (!id) return res.status(400).send("Bad Request");
  if (auth !== process.env.ADMIN_KEY) {
    return res.status(401).send("Unauthorized");
  }

  const link = await prisma.link.delete({
    where: {
      id,
    },
  });

  return res.json(link);
}

export async function PATCH(req: Request, res: Response) {
  const { id, url, description } = req.body;
  const auth = req.headers.authorization;

  if (!id || !url) return res.status(400).send("Bad Request");
  if (auth !== process.env.ADMIN_KEY) {
    return res.status(401).send("Unauthorized");
  }

  const link = await prisma.link.update({
    where: {
      id,
    },
    data: {
      url,
      description,
    },
  });

  return res.json(link);
}