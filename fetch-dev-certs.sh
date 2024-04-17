#!/usr/bin/env bash

source .match

if hash bundle 2>/dev/null; then
    bundle exec fastlane ios dev_certs_fetch
else
    fastlane ios dev_certs_fetch
fi