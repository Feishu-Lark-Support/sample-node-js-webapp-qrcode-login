docker build . -f DockerFile -t sample-node-js-webapp-qrcode-login
docker run -p 9000:9000 -it sample-node-js-webapp-qrcode-login