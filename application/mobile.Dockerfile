FROM cirrusci/flutter

COPY app_code /app
WORKDIR /app

RUN rm -f .packages

RUN flutter pub get
RUN flutter clean
RUN flutter build apk

ENTRYPOINT cp /app/build/app/outputs/apk/release/app-release.apk /apk/client.apk
