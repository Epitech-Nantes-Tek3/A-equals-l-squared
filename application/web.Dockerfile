# Install Operating system and dependencies
FROM cirrusci/flutter

# Run flutter doctor
RUN flutter doctor

# Enable flutter web
RUN flutter config --enable-web

# Copy files to container and build
RUN mkdir /app/
COPY ./app_code /app/
WORKDIR /app/
RUN flutter build web

RUN mkdir -p /apk/
# Record the exposed port
EXPOSE 5000

# make server startup script executable and start the web server
RUN ["chmod", "+x", "/app/server/server.sh"]

ENTRYPOINT [ "/app/server/server.sh"]
