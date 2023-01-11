FROM cirrusci/flutter

COPY app_code /app
WORKDIR /app

USER root

RUN rm -f .packages

RUN flutter pub get
RUN flutter build apk

RUN mkdir /apk/
ENTRYPOINT cp build/app/outputs/apk/release/app-release.apk /apk/client.apk
