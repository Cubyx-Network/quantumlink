import { Request, Response } from "express";
import { prisma } from "./main";
import {
  status400,
  status401,
  status404,
  status409,
  status500,
} from "./response";

export async function POST(req: Request, res: Response) {
  const { id, url, description } = req.body;
  const auth = req.headers.authorization;

  if (!id || !url) return res.status(400).send("Bad Request");
  if (auth !== process.env.ADMIN_KEY) {
    return status401(res);
  }

  const link = await prisma.link
    .create({
      data: {
        id,
        url,
        description,
      },
    })
    .catch((err) => {
      if (err.code === "P2002") {
        return status409(res);
      }
      return status500(res);
    });

  return res.json(link);
}

export async function DELETE(req: Request, res: Response) {
  const { id } = req.body;
  const auth = req.headers.authorization;

  if (!id) return status400(res);
  if (auth !== process.env.ADMIN_KEY) {
    return status401(res);
  }

  const link = await prisma.link
    .delete({
      where: {
        id,
      },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        return status404(res);
      }
      return status500(res);
    });

  return res.json(link);
}

export async function PATCH(req: Request, res: Response) {
  const { id, url, description } = req.body;
  const auth = req.headers.authorization;

  if (!id || !url) return status400(res);
  if (auth !== process.env.ADMIN_KEY) {
    return status401(res);
  }

  const link = await prisma.link
    .update({
      where: {
        id,
      },
      data: {
        url,
        description,
      },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        return status404(res);
      }
      return status500(res);
    });

  return res.json(link);
}
