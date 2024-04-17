fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

Build debug configuration

### ios dev_certs_fetch

```sh
[bundle exec] fastlane ios dev_certs_fetch
```

Fetches the provisioning profiles so you can build locally and deploy to your device

### ios dist_certs_fetch

```sh
[bundle exec] fastlane ios dist_certs_fetch
```

Fetches the provisioning profiles so you can build locally and deploy to the store

### ios test

```sh
[bundle exec] fastlane ios test
```

Test build number, future lane to run tests

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
