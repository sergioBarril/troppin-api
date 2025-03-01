import { Request } from "express";
import { Params } from "nestjs-pino";

const DEV_CONFIG: Params = {
  pinoHttp: {
    transport: {
      target: "pino-pretty",
    },
    autoLogging: false,
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        body: req.body as unknown,
      }),
    },
  },
};

const PROD_CONFIG: Params = {
  pinoHttp: {
    transport: {
      targets: [
        {
          target: "pino/file",
          options: {
            destination: "./logs/apps.log",
            mkdir: true,
          },
        },
        {
          target: "pino-pretty",
        },
      ],
    },
    autoLogging: false,
  },
};

export default function getPinoConfig(): Params {
  if (process.env.NODE_ENV === "production") {
    return PROD_CONFIG;
  }

  return DEV_CONFIG;
}
