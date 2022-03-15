import { Request, Response } from "express";
import { Database } from "./db";
import Tasks from "./model/tasks";
import { Router } from "./router";

const express = require('express');

export class API {

    private app: any;
    private hostname: string;
    private port: number;
    private router : Router;
    private db : Database;

    constructor(Database: Database) {
        this.app = express();
        this.hostname = "127.0.0.1";
        this.port = 3333;
        this.router = new Router();
        this.db = Database;        
    }

    public start(): void {

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));


        /* CORS Control */
        this.app.use((req: Request, res: Response, next: Function) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        // Get method is not allowed 
        this.app.get('/api/*', function (req: Request, res: Response) {
            res.send({ "status": "failed", "reason": "Method not allowed" });
        });


        /* Define every route with callbacks */
        const paths = this.router.PATHS;
        for (const key in paths) {
            
            const callback = paths[key];
            this.app.post(this.router.API + key + "/", (req: Request, res: Response) => {
                console.log("DB-API","Request: " + this.router.API + key + "/");
                const promise = callback(this.db,req,res);

                promise.then((data)  => res.send(data))
                .catch((err: any) => {
                    res.send({
                    "status": "failed",
                    "reason": err.message
                    });
                });
            });
        }

        /* Start API listener */
        this.app.listen(this.port, this.hostname);
        console.log("DB-API","The database API is running on http://" + this.hostname  + ":" + this.port + "/" + this.router.API);
    }

}
