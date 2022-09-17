import express from "express";
import fs from "node:fs";

const router = express.Router();

export default (passport, samlStrategy) => {
    const strategy = "saml";

    router.get(
        "/login",
        passport.authenticate(strategy, {
            successRedirect: "/profile",
            failureRedirect: "/login/fail",
        })
    );

    router.post(
        "/login/callback",
        passport.authenticate(strategy, { failureRedirect: "/login/fail" }),
        (req, res) => {
            console.dir(req);
            res.redirect("/profile");
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
            new URL("../../certs/cert.pem", import.meta.url),
            "utf8"
        );
        res.type("application/xml");
        res.status(200).send(
            samlStrategy.generateServiceProviderMetadata(cert, cert)
        );
    });

    return router;
};
