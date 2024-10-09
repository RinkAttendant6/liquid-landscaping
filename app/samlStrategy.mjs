import fs from "node:fs";
import process from "node:process";
import saml from "@node-saml/passport-saml";

export const samlStrategy = new saml.Strategy(
    {
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl:
            process.env.SAML_CALLBACK_URL ??
            (() => {
                const localPort = process.env.PORT || 3000;
                const host = process.env.CODESPACES
                    ? `${process.env.CODESPACE_NAME}-${localPort}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
                    : `localhost:${localPort}`;

                return `https://${host}/login/callback`;
            })(),

        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: process.env.ISSUER ?? "demo1-sp",

        // Service Provider private key
        decryptionPvk: fs.readFileSync(
            new URL("../certs/key.pem", import.meta.url),
            { encoding: "ascii" }
        ),

        // Service Provider Certificate
        privateKey: fs.readFileSync(
            new URL("../certs/key.pem", import.meta.url),
            { encoding: "ascii" }
        ),

        // Identity Provider's public key
        idpCert: fs.readFileSync(
            new URL("../certs/idp_cert.pem", import.meta.url),
            { encoding: "ascii" }
        ),

        disableRequestedAuthnContext: true,

        signatureAlgorithm: "sha256",
        digestAlgorithm: "sha256",
    },
    (profile, done) => {
        console.log(profile);
        return done(null, profile);
    }
);
