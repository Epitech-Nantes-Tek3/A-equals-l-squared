#!/bin/sh

# ---- Generation -----
cd ./application/app_code

dart pub global activate dartdoc

dart doc

# ----- Hosting -----

dart pub global activate dhttpd

export PATH="$PATH":"$HOME/.pub-cache/bin"

dhttpd --path doc/api