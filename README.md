# EarthRanger Mobile
Android and iOS client to the [EarthRanger platform](https://www.earthranger.com/)

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

  [Java 11](https://jdk.java.net/archive/) is the minimum required version to build the app.

- Install [Android Studio](https://developer.android.com/studio), SDK and accept the licenses

- Install [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) and configure the command line tools

```sh
$ xcode-select --install
```

### Fork the repo

If you haven't already, fork [this repo](https://github.com/PADAS/earthranger-mobile/fork). Some instruction below on working with your fork, for reference check out [GitHubs Working with forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks),

### Clone the repo

```sh
# ssh clone url
# Clones your fork of the repository into the current directory in terminal
$ git clone git@github.com:YOUR-USERNAME/earthranger-mobile.git

# github cli
$ gh repo clone YOUR-USERNAME/earthranger-mobile
```

### Configure remote upstream for your fork
To sync changes you make in a fork with this repository, you must configure a remote that points to the upstream repository in Git.

- Open a terminal or command prompt
- List the current configured remote repository for your fork

```sh
$ git remote -v
origin  https://github.com/YOUR_USERNAME/earthranger-mobile.git (fetch)
origin  https://github.com/YOUR_USERNAME/earthranger-mobile.git (push)
```

- Specify a new remote upstream repository

```sh
$ git remote add upstream https://github.com/PADAS/earthranger-mobile.git  
```

- Verify the new upstream repository

```sh
$ git remote -v

origin  https://github.com/YOUR_USERNAME/earthranger-mobile.git (fetch)
origin  https://github.com/YOUR_USERNAME/earthranger-mobile.git (push)
upstream https://github.com/PADAS/earthranger-mobile.git (fetch)
upstream https://github.com/PADAS/earthranger-mobile.git (push)
```

- Keep your fork up to date with [upstream](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

### Install yarn and dependencies

**Mapbox**

This app uses Mapbox React Native which requires developers configure credentials to download and develop against their SDK.  You'll need two tokens:

- Secret access token with (Downloads:Read) scope to download iOS and Android SDK from mapbox. The secret token starts with `sk.ey`.
- Public token to use as accessToken when running the app. The public token starts with `pk.ey`

Refernece [Mapbox account sign up](https://docs.mapbox.com/android/maps/guides/install/#step-1-log-insign-up-for-a-mapbox-account) on mapbox.com for instructions with configureing credentials. 

Once you have Mapbox credentials setup you can install app dependencies with the following: 

```sh
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

EarthRanger is an open-source project built by the [EarthRanger team](https://www.earthranger.com/) at the [Allen Institute for AI](https://allenai.org/) (AI2). AI2 is a non-profit institute with the mission to contribute to humanity through high-impact AI research and engineering.  Contributions are welcome! If you find a bug or have a feature request, please open an issue.

<a href="https://github.com/PADAS/earthranger-mobile/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=PADAS/earthranger-mobile" />
</a>


## Licensing

A copy of the license is available in the repository's [LICENSE](LICENSE) file.

