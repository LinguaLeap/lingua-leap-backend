import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import passport from "passport";
import session from "express-session";
import Database from "./configs/database";
import client from "./configs/redisClient";
import io from "./socketIO/socketIO";
import RedisStore from "connect-redis";
import boom from "@hapi/boom";
require("./helpers/googleAuth");

async function bootstrap() {
    const database = new Database();
    const app = express();
    const port = process.env.PORT || 3000;
    const bodyParser = require("body-parser");

    app.use(cors());

    app.use(express.json({ limit: "30mb" }));
    app.use(bodyParser.urlencoded({ extended: false }));

    const sess = session({
        //@ts-ignore
        store: new RedisStore({ client: client }),
        secret: process.env.PASSPORT_SECRET_KEY || "it is not good",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 14 * 24 * 3600000 },
    });

    app.use(sess);

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/", router);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err);

        if (err) {
            if (err.output) {
                return res
                    .status(err.output.statusCode || 500)
                    .json(err.output.payload);
            }

            return res.status(500).json(err);
        }
    });

    const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    io.attach(server);

    database.connect();
}

bootstrap();
