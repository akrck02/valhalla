import { Request, Response } from "express";
import { Database } from "./db";
import { Router } from "./router";

const express = require("express");

export class API {
  private app: any;
  private hostname: string;
  private port: number;
  private router: Router;
  private db: Database;

  constructor(Database: Database) {
    this.app = express();
    this.hostname = "0.0.0.0";
    this.port = 4444;
    this.router = new Router();
    this.db = Database;
  }

  public start(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    /* CORS Control */
    this.app.use((req: Request, res: Response, next: Function) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
      );
      next();
    });

    /* Define every route with callbacks */
    const paths = this.router.PATHS;
    for (const key in paths) {
      const callback = paths[key];
      this.app.post(
        this.router.API + key + "/",
        (req: Request, res: Response) =>
          this.handleRequest(key, req, res, callback),
      );
      this.app.get(
        this.router.API + key + "/",
        (req: Request, res: Response) => {
          this.getParametersToBody(req);
          this.handleRequest(key, req, res, callback);
        },
      );
    }

    /* Start API listener */
    this.app.listen(this.port, this.hostname).on("error", (err: any) => {
      console.log(`Something is already listening port ${this.port}`);
      
      process.exit(1);
    });
  }

  handleRequest(
    key: string,
    req: Request,
    res: Response,
    callback: (db: Database, req: Request, res: Response) => Promise<any>,
  ) {
    const promise = callback(this.db, req, res);

    promise
      .then((data) => {
        if (data.status == "failed") {
          res.statusCode = 400;
        }
        res.send(data);
      })
      .catch((err: any) => {
        res.statusCode = 500;
        res.send({
          status: "failed",
          reason: err.message,
        });
      });
  }

  getParametersToBody(req: Request) {
    let url = req.url;
    url = url.substring(url.lastIndexOf("?") + 1);

    const params = url.split("&");
    const body: { [key: string]: string } = {};

    params.forEach((param) => {
      const parts = param.split("=");
      body[parts[0]] = parts[1];
    });

    req.body = body;
  }
}
