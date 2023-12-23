import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import passport from "passport";
import session from "express-session";
import Database from "./configs/database";

require("./helpers/googleAuth");

async function bootstrap() {
    const database = new Database();
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());

    app.use(express.json({ limit: "30mb" }));
    app.use(express.urlencoded({ limit: "30mb", extended: true }));

    app.use(
        session({
            secret: process.env.PASSPORT_SECRET_KEY || "it is not good",
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/", router);

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    database.connect();
}

bootstrap();
