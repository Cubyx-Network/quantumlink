import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import log4js, { getLogger } from "log4js";

console.log(`=----------------------------=`);
console.log(`  C U B Y X   N E T W O R K `);
console.log(`     QuantumLink v1.0.0`);
console.log(`=----------------------------=`);
console.log();

// INIT LOGGER
log4js.configure({
  appenders: {
    console: { type: "console" },
    file: { type: "file", filename: "logs/quantumlink.log" },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "debug" },
  },
});
const logger = getLogger("console");
logger.level = "debug";

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

// ROUTES

// ERROR HANDLING
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).send("Internal Server Error");
});

// START SERVER
app.listen(3000, () => {
  logger.info(`Listening on http://127.0.0.1:${3000}`);
});

export default app;
export { logger };
