import { Link } from "@prisma/client";
import { Request, Response } from "express";
import { config, logger, prisma } from "./main";
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
  if (auth !== config.admin_secret) {
    return status401(res);
  }

  const link = await createLink(id, url, description).catch((err) => {
    if (err === 409) {
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
  if (auth !== config.admin_secret) {
    return status401(res);
  }

  const link = await deleteLink(id).catch((err) => {
    if (err === 404) {
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
  if (auth !== config.admin_secret) {
    return status401(res);
  }

  const link = await updateLink(id, url, description).catch((err) => {
    if (err === 404) {
      return status404(res);
    }
    return status500(res);
  });

  return res.json(link);
}

/**
 * Creates a new link.
 * @param id The ID of the link (will be the endpoint).
 * @param url The URL the link points to.
 * @param description? The description of the link.
 * @returns The created link.
 * @throws 409 if the link already exists.
 * @throws 500 if an error occurred.
 */
export async function createLink(
  id: string,
  url: string,
  description?: string
): Promise<Link> {
  logger.info(`Creating link with ID ${id}...`);
  return prisma.link
    .create({
      data: {
        id,
        url,
        description,
      },
    })
    .catch((err) => {
      if (err.code === "P2002") {
        throw 409;
      }
      logger.error(err);
      throw 500;
    });
}

/**
 * Deletes a link.
 * @param id The ID of the link.
 * @returns The deleted link.
 * @throws 404 if the link does not exist.
 * @throws 500 if an error occurred.
 */
export async function deleteLink(id: string): Promise<Link> {
  logger.info(`Deleting link with ID ${id}...`);
  return prisma.link
    .delete({
      where: {
        id,
      },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        throw 404;
      }
      logger.error(err);
      throw 500;
    });
}

/**
 * Updates a link.
 * @param id The ID of the link.
 * @param url The URL the link points to.
 * @param description? The description of the link.
 * @returns The updated link.
 * @throws 404 if the link does not exist.
 * @throws 500 if an error occurred.
 */
export async function updateLink(
  id: string,
  url: string,
  description?: string
): Promise<Link> {
  logger.info(`Updating link with ID ${id}...`);
  return prisma.link
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
        throw 404;
      }
      logger.error(err);
      throw 500;
    });
}
