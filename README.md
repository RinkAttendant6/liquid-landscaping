# Auth demo 1

This application demonstrates authorization based on group (role) information coming from the identity provider.

Groups are hardcoded into the application without any synchronization with any directory.

## Use cases

-   Group information is available from the identity provider
-   Small number of fixed groups

## Run

1. Configure your identity provider
1. Download your identity provider's certificate and add it into the `certs/` directory with the filename `idp_cert.pem`.
1. Ensure there is a self-signed cert in the certs directory:
    ```shell
    openssl req -x509 -newkey rsa:4096 -sha256 -keyout "certs/key.pem" -out "certs/cert.pem" -nodes -days 365 -subj "/C=CA/ST=Ontario/L=Ottawa/O=Liquid Landscaping/CN=localhost"
    ```
1. Set environment variables:
    - `SAML_ENTRY_POINT` (your IdP's login URL)
    - `SAML_CALLBACK_URL` (optional)
1. `npm start`
