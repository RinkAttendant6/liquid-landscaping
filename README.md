# Auth demo 1

This application demonstrates authorization based on group (role) information coming from the identity provider.

Groups are hardcoded into the application without any synchronization with any directory.

## Use cases

-   Group information is available from the identity provider
-   Small number of fixed groups

## Run

1. Ensure there is a self-signed cert in the certs directory:
    ```shell
    openssl req -x509 -newkey rsa:4096 -sha256 -keyout "certs/key.pem" -out "certs/cert.pem" -nodes -days 365 -subj "/C=CA/ST=Ontario/L=Ottawa/O=Liquid Landscaping/CN=localhost"
    ```
1. Set environment variables:
    - `SAML_CALLBACK_URL`
    - `SAML_ENTRY_POINT`
1. `npm start`
