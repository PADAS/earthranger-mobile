#!/bin/bash

# Define the path to the file
FILE_PATH="node_modules/react-native-mmkv/android/src/hasNamespace/AndroidManifest.xml"

# Use sed to replace the content of AndroidManifest.xml
sed -e 's|<manifest xmlns:android="http://schemas.android.com/apk/res/android">|<manifest package="com.reactnativemmkv" xmlns:android="http://schemas.android.com/apk/res/android">|g' "$FILE_PATH" > "${FILE_PATH}.tmp" && mv "${FILE_PATH}.tmp" "$FILE_PATH"

echo "AndroidManifest.xml has been updated."
