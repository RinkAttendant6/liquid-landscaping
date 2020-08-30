openssl req -x509 -newkey rsa:4096 -sha256 -keyout "certs/key.pem" -out "certs/cert.pem" -nodes -days 365 -subj "/C=CA/ST=Ontario/L=Ottawa/O=Liquid Landscaping/CN=localhost"
echo $ENV_DIR/IDP_CERT > certs/idp_cert.pem
