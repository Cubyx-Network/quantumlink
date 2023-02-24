import { Response } from "express";

export function status(res: Response, code: number, message: string) {
  res.status(code).json({ message });
}

export function status200(res: Response) {
  status(res, 200, "OK");
}

export function status400(res: Response) {
  status(res, 400, "Bad Request");
}

export function status401(res: Response) {
  status(res, 401, "Unauthorized");
}

export function status404(res: Response) {
  status(res, 404, "Not Found");
}

export function status409(res: Response) {
  status(res, 409, "Conflict");
}

export function status500(res: Response) {
  status(res, 500, "Internal Server Error");
}
