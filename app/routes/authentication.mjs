import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

export default (passport, samlStrategy) => {
    router.get(
        "/login",
        passport.authenticate("saml", { failureRedirect: "/login/fail" }),
        (req, res) => {
            res.redirect("/");
        }
    );

    router.post(
        "/login/callback",
        passport.authenticate("saml", { failureRedirect: "/login/fail" }),
        (req, res) => {
            res.redirect("/");
        }
    );

    router.get("/login/fail", (req, res) => {
        res.status(401).send("Login failed");
    });

    router.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    router.get("/saml_metadata", (req, res) => {
        const cert = fs.readFileSync(
            __dirname + "/../../certs/cert.pem",
            "utf8"
        );
        res.type("application/xml");
        res.status(200).send(
            samlStrategy.generateServiceProviderMetadata(cert, cert)
        );
    });

    return router;
};
