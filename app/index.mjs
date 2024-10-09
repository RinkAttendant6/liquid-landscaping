import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import nunjucks from "nunjucks";
import passport from "passport";
import { samlStrategy } from "./samlStrategy.mjs";
import routes from "./routes/index.mjs";
import routes2 from "./routes/authentication.mjs";
import session from "express-session";

const app = express();

nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(samlStrategy);

app.set("view engine", "njk");

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://code.jquery.com/",
                    "https://stackpath.bootstrapcdn.com/",
                ],
                styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com/"],
                baseUri: ["'self'"],
                blockAllMixedContent: [],
                frameAncestors: ["'self'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        hsts: false, // for demo purposes
    })
);
app.use(morgan("combined"));
app.use(cookieParser("keyboard cat"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        cookie: {
            httpOnly: true,
            sameSite: "lax",
        },
        resave: true,
        saveUninitialized: false,
        secret: "keyboard cat",
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(import.meta.dirname + "/../public"));
app.use("/", routes);
app.use("/", routes2(passport, samlStrategy));

export default app;
