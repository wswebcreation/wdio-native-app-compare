# wdio-native-app-compare

[![npm version](https://badge.fury.io/js/wdio-native-app-compare.svg)](https://badge.fury.io/js/wdio-native-app-compare)
[![npm](https://img.shields.io/npm/dw/localeval.svg)](https://www.npmjs.com/package/wdio-native-app-compare)
[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/wdio-native-app-compare)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/wswebcreation/wdio-native-app-compare/blob/master/LICENSE)

> Visual regression testing for Native iOS and Android apps with WebdriverIO

> **THIS MODULE IS STILL BEING DEVELOPED, PLEASE FILE AN ISSUE IF YOU FOUND ONE, OR CREATE A PR**

# What can it do
This plugin for WebdriverIO will add 4 methods that can be used to save and or check element/screen-shots of a native iOS or Android app, see [Methods](./README.md#methods) for all the methods and details.
When the compare methods are used a baseline image (each device + OS, and even OS version, needs to have it's own baseline image) will be compared to an actual screenshot. The output will be a mismatch percentage. This mismatch percentage can be used in expectations.

## Comparison
The images are compared with the lovely module [ResembleJS](https://github.com/Huddle/Resemble.js).
If you want to compare images online, and thus by hand, you can check the [online tool](https://huddleeng.github.io/Resemble.js/)

Examples of saved images of elements / screens and diffs can be found [here](./docs/IMAGE-OUTPUT.md).

# Installation
You can install wdio-native-app-compare via NPM as usual:

```sh
$ npm install wdio-native-app-compare --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration
`wdio-native-app-compare` is a plugin so it can be used as a normal plugin. You can set it up in your `wdio.conf.js` file with the following

```js
// wdio.conf.js
exports.config = {
    // ...
      plugins: {
        'wdio-native-app-compare': {
          baselineFolder: '.dist/image-compare/baseline',
          screenshotPath: '.dist/image-compare/screenshots',
          // See Options for more options
          //..
        },
      },
    // ...
};
```

> **The major release will also hold options to resize dimensions, meaning that you provide options to make an element screenshot bigger by adding extra paddings to the initial element**

## OPTIONS
See [OPTIONS.md](./docs/OPTIONS.md)

## METHODS INCLUDING OUTPUTS
See [METHODS.md](./docs/METHODS.md)

## CHANGELOG
See [Releases](https://github.com/wswebcreation/wdio-native-app-compare/releases)


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

## TODO:
The following still needs to be done
- Add more options for:
    - [x] `autoSaveBaseline` If no baseline image is found the image is automatically copied to the baselinefolder
    - [x] `debug` Add some extra logging and always save the image difference
    - [x] `formatImageName` Custom variables for Image Name
    - [x] `blockOutStatusBar`  If the statusbar on mobile / tablet needs to blocked out by default
    - [x] `blockOuts` block out with x, y, width and height values
    - [x] `elementBlockOuts` block out 1 or more elements
    - [x] `ignoreAlpha` compare images and discard alpha
    - [x] `ignoreAntialiasing` compare images and discard anti aliasing
    - [x] `ignoreColors` Even though the images are in colour, the comparison wil compare 2 black/white images
    - [x] `ignoreLess` compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
    - [x] `ignoreNothing` compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
    - [x] `ignoreTransparentPixel` Will ignore all pixels that have some transparency in one of the images
    - [x] `rawMisMatchPercentage` default false. If true the return percentage will be like 0.12345678, default is 0.12
    - [x] ~~`androidOffsets` Object that will hold custom values for the statusBar~~ => Not needed, determined dynamically
    - [x] ~~`iosOffsets` Object that will hold the custom values for the statusBar~~ => Not needed, determined dynamically
    - [x] `saveAboveTolerance` Allowable value of misMatchPercentage that prevents saving image with differences
    - [x] resize dimensions
    - [ ] implement logging to webdriver.io
    - [ ] ...
- [ ] Check how to determine DPR for Android
- [x] Make all work for Android
    - [x] `saveElement` => ~~**now only works with a custom method, not with `elementIdScreenshot`**~~ => implemented UiAutomator2 support and fallback
    - [x] `compareElement` => ~~**now only works with a custom method, not with `elementIdScreenshot`**~~ => implemented UiAutomator2 support and fallback
    - [x] `saveScreen`
    - [x] `compareScreen`
- [x] Make all work for iOS
    - [x] `saveElement`
    - [x] `compareElement`
    - [x] `saveScreen`
    - [x] `compareScreen`
- [ ] Update docs
- [ ] Add tests

## Credits
- Credits go out to Tele2 Netherlands. They gave me the awesome assignment to automate a React Native app and also gave me the space to investigate the tools I needed to use to automate a React Native app.
- Also the WebdriverIO team and the WebdriverIO community. The tool is really awesome and easy to use and the support is really awesome!

## Licence
MIT
