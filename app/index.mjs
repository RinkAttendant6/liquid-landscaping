import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import fs from "node:fs";
import helmet from "helmet";
import nunjucks from "nunjucks";
import passport from "passport";
import process from "node:process";
import saml from "passport-saml";
import { dirname } from "node:path";
import routes from "./routes/index.mjs";
import routes2 from "./routes/authentication.mjs";
import session from "express-session";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const samlStrategy = new saml.Strategy(
    {
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl: process.env.SAML_CALLBACK_URL,

        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: process.env.ISSUER || "demo1-sp",
        //identifierFormat: null,

        // Service Provider private key
        decryptionPvk: fs.readFileSync(
            new URL("../certs/key.pem", import.meta.url),
            { encoding: "utf-8" }
        ),

        // Service Provider Certificate
        privateKey: fs.readFileSync(
            new URL("../certs/key.pem", import.meta.url),
            { encoding: "utf-8" }
        ),

        // Identity Provider's public key
        cert:
            process.env.IDP_CERT ||
            fs.readFileSync(new URL("../certs/idp_cert.pem", import.meta.url), {
                encoding: "utf-8",
            }),

        validateInResponseTo: false,
        disableRequestedAuthnContext: true,

        signatureAlgorithm: "sha256",
        digestAlgorithm: "sha256",
    },
    (profile, done) => {
        console.log(profile);
        return done(null, profile);
    }
);

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
        expectCt: false,
        hsts: false, // for demo purposes
    })
);
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

app.use(express.static(__dirname + "/../public"));
app.use("/", routes);
app.use("/", routes2(passport, samlStrategy));

export default app;
