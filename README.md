# wdio-native-app-compare

[![npm version](https://badge.fury.io/js/wdio-native-app-compare-service.svg)](https://badge.fury.io/js/wdio-native-app-compare-service)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/wswebcreation/wdio-native-app-compare/blob/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/wswebcreation/wdio-native-app-compare/badge.svg?branch=master)](https://coveralls.io/github/wswebcreation/wdio-native-app-compare?branch=master)

Visual regression testing for Native iOS and Android apps with WebdriverIO

> This service works with WebdriverIO V5 and V6. To check support for WebdriverIO V4 go to the [`0.7.0`](https://github.com/wswebcreation/wdio-native-app-compare/tree/0.7.0) branch and following the instructions

# What can it do
This service for WebdriverIO will add 4 methods that can be used to save and or check element/screen-shots of a native iOS or Android app, see [Methods](./README.md#methods) for all the methods and details.

When the compare methods are used a baseline image (each device + OS, and even OS version, needs to have it's own baseline image) will be compared to an actual screenshot.
The output will be an object of data, check the `save..`-methods output [here](https://github.com/wswebcreation/wdio-native-app-compare/blob/master/docs/METHODS.md#save-methods) and the `compare..`-methods [here](https://github.com/wswebcreation/wdio-native-app-compare/blob/master/docs/METHODS.md#compare-methods)

## Comparison
The images are compared with the lovely module [ResembleJS](https://github.com/rsmbl/Resemble.js).
If you want to compare images online, and thus by hand, you can check the [online tool](http://rsmbl.github.io/Resemble.js/)

Examples of saved images of elements / screens and diffs can be found [here](./docs/IMAGE-OUTPUT.md).

# Installation
You can install wdio-native-app-compare via NPM as usual:

```sh
$ npm install wdio-native-app-compare-service --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration
`wdio-native-app-compare-service` is a service so it can be used as a normal service. You can set it up in your `wdio.conf.js` file with the following

```js
// wdio.conf.js
exports.config = {
    // ...
    // ========================
    // Native app compare setup
    // ========================
    services: [ [
        'native-app-compare',
        // The options
        {
            // Mandatory
            baselineFolder: 'test/image-baseline',
            screenshotPath: '.tmp/image-compare',
            // Optional
            // See Options for more options
            //..
        },
    ] ],
};
```

## OPTIONS
See [OPTIONS.md](./docs/OPTIONS.md)

## METHODS INCLUDING OUTPUTS
See [METHODS.md](./docs/METHODS.md)

## CHANGELOG
See [Releases](https://github.com/wswebcreation/wdio-native-app-compare/releases)

## TODO
- [ ] Add more UT's for the `index.js`-file
- [ ] Add more tests for the excluded lib files in the `package.json`

## FAQ
### I get a console log when I try to save/compare an element screenshot on Android
When you are trying to save an element screenshot on Android the following log can be shown in your console

```bash
#####################################################################################
 AN ELEMENT SCREENSHOT COULD NOT BE TAKEN WITH THE NEW 'elementScreenshot()' METHOD,
 A FALLBACK HAS BEEN EXECUTED AND THE ELEMENT WILL BE SAVED.
 USE 'automationName: "UiAutomator2"' FOR ANDROID TO FULLY USE THE POWER OF APPIUM
#####################################################################################
```
Please make sure you are using the `UiAutomator2`-driver when automating with Appium, see the Appium docs [here](http://appium.io/docs/en/drivers/android-uiautomator2/)

## element screenshot on an iPhone 11 are borken
There seems to be an issue with Appium and the iPhone 11 not giving back a correct element screenshot.
I need to investigate this better, but a workaround would be to provide an empty `resizeDimensions`-object like this

    driver.compareElement($('element'),'name', {resizeDimensions:{}});

This will trigger taking an element screenshot by cutting it out a large screenshot.

## Credits
- Credits go out to Tele2 Netherlands. They gave me the awesome assignment to automate a React Native app and also gave me the space to investigate the tools I needed to use to automate a React Native app.
- Also the WebdriverIO team and the WebdriverIO community. The tool is really awesome and easy to use and the support is really awesome!

## Licence
MIT
