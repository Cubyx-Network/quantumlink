import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "log4js";
import { middleware } from "./middleware";
import { DELETE, PATCH, POST } from "./admin";
import { config } from "dotenv";
import { status, status500 } from "./response";

console.log(`=----------------------------=`);
console.log(`  C U B Y X   N E T W O R K `);
console.log(`     QuantumLink v1.0.0`);
console.log(`=----------------------------=`);
console.log();

config();

// INIT LOGGER
const logger = getLogger("console");
logger.level = "debug";

// INIT PRISMA
const prisma = new PrismaClient();

// INIT EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ACCESS LOGGING
app.use((req, _res, next) => {
  logger.info(
    `${req.ip} - - [${new Date().toISOString()}] "${req.method} ${
      req.originalUrl
    } HTTP/${req.httpVersion}" - "${req.headers["user-agent"]}"`
  );
  next();
});

// MIDDLEWARE
app.use(middleware);

// ROUTES
app.get("/*", async (req, res) => {
  const defaultLink = await prisma.link.findFirst({
    where: {
      id: "default",
    },
  });

  if (defaultLink) return res.redirect(`${defaultLink.url}${req.originalUrl}`);

  status(res, 420, "Mayonaise ist kein Instrument, Patrick.");
});

app.post("/", POST);
app.delete("/", DELETE);
app.patch("/", PATCH);

// ERROR HANDLING
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  status500(res);
});

// START SERVER
app.listen(3000, () => {
  logger.info(`Listening on http://127.0.0.1:${3000}`);
});

process.on("SIGINT", () => {
  logger.info("Shutting down...");
  prisma.$disconnect();
  process.exit();
});

export default app;
export { logger, prisma };
