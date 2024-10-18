# EarthRanger Mobile

This is the Mobile app for the [EarthRanger](https://www.earthranger.com/) platform.

## Team info

- [Jira EM Board](https://allenai.atlassian.net/jira/software/projects/EM/boards/150)
- [Confluence Docs](https://allenai.atlassian.net/wiki/spaces/EM/pages/29285744643/)

## Developers Setup
The EarthRanger mobile app is a cross-plaform React Native app where development is using React Native CLI.  Follow the instructions below to set up your developer environment on a Mac OS:

### Prerequisites

- Install [Homebrew](https://brew.sh/)

```sh
# run the following inside your macOS terminal
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
````

- Install Node and Watchmen

```sh
$ brew install node
$ brew install watchman
````

- Install Java JDK

  [Java 11](https://jdk.java.net/archive/) is required to build the app.

- Install [Android Studio](https://developer.android.com/studio), SDK and accept the licenses

- Install [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) and configure the command line tools

```sh
$ xcode-select --install
```

### Clone the repo

```bash
# ssh clone url
$ git clone git@github.com:PADAS/er-mobile.git

# github cli
$ gh repo clone PADAS/er-mobile
```

### Install yarn and dependencies

```
$ npm install --global yarn
$ yarn
```

### Android

**[Manage SDK packages within the IDE](https://developer.android.com/studio/intro/update#sdk-manager)**. Use this tool to confirm or install the following:

  - Android SDK platform 31, as we currently target Android 31
  - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image
  - Android SDK Build tools `30.0.2`
  - Android SDK Command line tools (latest)

**[Create and manage AVDs](https://developer.android.com/studio/run/managing-avds)**.  AVDs are a configuration defining characteristics of an Android phone or tablet to simulate with an [Android Emulator](https://developer.android.com/studio/run/emulator).  An AVD should have been created on install of Android Studio, use the AVD Manager to create more phones/tablets to test against.

**Configure ANDROID_HOME environment variable**

- Add the following to your respective bash/zsh profile:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=...:$ANDROID_HOME/emulator$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH
````

**Configure the local properties for Android**:

```sh
# create locat.properties file in android project folder
$ cd android && touch local.properties

# return to root proejct folder
$ cd ..
```

Open the `local.properties` file and write the following line setting your own `USER_PATH`:

```
sdk.dir=/Users/[USER_PATH]/Library/Android/sdk
```

### iOS
iOS has dependencies on [Ruby](https://www.ruby-lang.org/).  You can use the version of `ruby` included with MacOS or a [managed Ruby environment](https://www.ruby-lang.org/en/documentation/installation/#managers) to work with the Ruby dependent tooling:

- Install CocoaPods

```sh
# using default Ruby, shouldn't need sudo if using package manager, e.g. rbenv
$ sudo gem install cocoapods
````

Install the pods for iOS:

```
$ cd ios
$ pod install
$ cd ..
```

## Build the app

There are multiple ways to build the app, here we detail the steps our future CI/CD systems will use to build the app:

### Android

Android uses the [Gradle Build Tool](https://gradle.org/), the Android project includes a Gradle Wrapper script that invokes a declared version of Gradle that allows developers to have consistent builds tools w/o manageing the local build chain

- From the root of the project, `cd` into **android** folder and execute the following:

```sh
# build android debug variant
$ ./gradlew clean assembleDebug --info
````

### iOS

We are using [Fastlane](https://docs.fastlane.tools/) for many iOS build automation tasks. We referenced the iOS dependency on **Ruby** for Cocoapods ealier, fastlane is another tool with depends on `ruby`, below you can follow either managed Ruby or Homebrew instructions below, if you can't decide use Homebrew as it will configure correct Ruby to run fastlane

**Managed Ruby**
If you have a [managed Ruby environment](https://www.ruby-lang.org/en/documentation/installation/#managers) installed you can use `bundler` to execute tasks.

```sh
# verify which Ruby version you have, fastlane supports v2.5+
$ ruby --version
# install bundler
$ gem install bundler
# build the app
$ bundle exec  fastlane ios build install:false
```

**Homebrew**
If you do not have a managed Ruby env, you used system Ruby to install Cocoapods, you can install fastlane via homebrew and it will install an adequate version of Ruby for fastlane.

```sh
# install via homebrew
brew install fastlane
# build the app
$ fastlane ios build install:false
```

## Add iOS device to team
In order to build and run the app on an iOS device you need to register the device with our team provisioning profile.

Using Xcode with your device connected:
1. Select **Windows > Device and Simulators** and select the **Devices** tab
2. Select your device under the **Connected** list
3. Your device ID is the labeled as **Identifier**, copy that value and share in Slack `#er-mobile-dev` channel

## Setup certificates and provisioning files
We are using Git for code signing which uses one code signing identity shared across our team.  We are currently maintaining 3 certificates for developing and distributing the app.  Follow the instructions below to get started setting up.

### Developer Certificate
Run the following in order to code sign the app and run locally it on a device.

* Create a *.match* file at the root of the repo. This file is not tracked by git

```sh
# credentials file, I will send file contents through Slack
$ touch .match
```

* Slack `#er-mobile-dev` channel for credentials to populate the file
* Run the `fetch-dev-certs` script

```sh
# source credentials and fetch certs/profiles from git
$ ./fetch-dev-certs.sh

# should result something similar embedded in your output

...

[20:10:05]: 🔓  Successfully decrypted certificates repo
[20:10:05]: Installing certificate...

+-------------------+------------------------------------------------+
|                       Installed Certificate                        |
+-------------------+------------------------------------------------+
| User ID           | 3UQ6CV34U9                                     |
| Common Name       | Apple Development: AI2 Mobile Dev (9KY9CX6C43) |
| Organisation Unit | G7H4CBL7Z8                                     |
| Organisation      | Allen Institute for Artificial Intelligence    |
| Country           | US                                             |
| Start Datetime    | 2022-04-21 00:52:02 UTC                        |
| End Datetime      | 2023-04-21 00:52:01 UTC                        |
+-------------------+------------------------------------------------+

...

[20:10:05]: All required keys, certificates and provisioning profiles are installed 🙌
[20:10:05]: Setting Provisioning Profile type to 'development'

+------+----------------------------+-------------+
|                fastlane summary                 |
+------+----------------------------+-------------+
| Step | Action                     | Time (in s) |
+------+----------------------------+-------------+
| 1    | Verifying fastlane version | 0           |
| 2    | match                      | 1           |
+------+----------------------------+-------------+

[20:10:05]: fastlane.tools finished successfully 🎉

```

### Confirm certificates
You can conifirm the certificates are installed correctly and Xcode can use them with the following:

 - Open Xcode preferences
 - Select the Allen Institute team Apple ID
 - Click on **Manage Certificates**

 You should see the approriate certificate created by **AI2 Mobile Dev** under Development certificates

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
$ yarn android --appId=com.earthranger.debug
````

This should build and install the app on a running device/emulator

### iOS

There are a couple of ways to run the iOS app.

**yarn**
Yarn is the easiest tool to build and install the app with the following command:

```sh
# run from the root of the project
$ yarn ios
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

## Testing
Testing is a Work in Progress, we have testing skaffolding setup which you can read about [here](https://allenai.atlassian.net/wiki/spaces/EM/pages/29326770216/Unit+testing)

```
$ yarn test
```

## Reference

- [React Native setting up dev environment](https://reactnative.dev/docs/0.65/environment-setup)
- [Fastlane](https://docs.fastlane.tools/)

