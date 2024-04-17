# EarthRanger Mobile
Android and iOS client to the EarthRanger platform

## Run the app
There are mulitple ways to run the app. You can open the respective IDE's, Android Studio or xCode and click the **Run** button with the app selected.  Instructions below run the app from a terminal. In all instances, be sure you have a connected physical device and/or emulator/simulator running.

### Android

You can use the `adb` tool to confirm you have a connected device:

```sh
# list connected android devices
$ adb devices

List of devices attached
740KPWT02R0050  device
````

Run the app with `yarn`

```sh
# run from the root of the project
$ yarn android 
````

This should build and install the app on a running device/emulator

### iOS

There are a couple of ways to run the iOS app.

**yarn**
Yarn is the easiest tool to build and install the app with the following command:

```sh
# run from the root of the project
$ yarn ios --device="YOUR_DEVICE_NAME"
```

This should build and install the app on a running device/simulator

**Fastlane**

The `build` lane has an option to install the app on your device, note it installs but does not automatically run the app.  If you want to test this feature out you need to install `ios-deploy`

```sh
# install ios-deploy
$ brew install ios-deploy

# Connect a device or open a simulator, ios-deploy will default to the first found device id

# build the app
$ [bundle exec] fastlane ios build install:true
```

## Contributors

Contributions are welcome! If you find a bug or have a feature request, please open an issue.

<a href="https://github.com/PADAS/earthranger-mobile/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=PADAS/earthranger-mobile" />
</a>


## Licensing

A copy of the license is available in the repository's [LICENSE](LICENSE) file.

