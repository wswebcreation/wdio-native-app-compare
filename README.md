# wdio-native-app-compare

> Visual regression testing for Native iOS and Android apps with WebdriverIO

> **THIS MODULE IS STILL BEING DEVELOPED AND RELEASED AS AN ALPHA, PLEASE FILE AN ISSUE IF YOU FOUND ONE**

# What can it do
This plugin for WebdriverIO will add 4 methods that can be used to save and or check element/screen-shots of a native iOS or Android app, see [Methods](./README.md#methods) for all the methods and details.
When the compare methods are used a baseline image (each device + OS, and even OS version, needs to have it's own baseline image) will be compared to an actual screenshot. The output will be a mismatch percentage. This mismatch percentage can be used in expectations.

## Comparison
The images are compared with the lovely module [ResembleJS](https://github.com/Huddle/Resemble.js).
If you want to compare images online, and thus by hand, you can check the [online tool](https://huddleeng.github.io/Resemble.js/)

Saved images of elements / screens and diffs can be found [here](./docs/OUTPUT.md).

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
export.config = {
    // ...
      plugins: {
        'wdio-native-app-compare': {
          baselineFolder: '.dist/image-compare/baseline',
          screenshotPath: '.dist/image-compare/screenshots',
          //..
        },
      },
    // ...
};
```

## Options

### `baselineFolder`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the baseline images that are used to execute the comparison

### `screenshotPath`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will

### `debug`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

The directory that will

### `ignoreAlpha`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and discard alpha

### `ignoreAntialiasing`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and discard anti aliasing

### `ignoreColors`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Even though the images are in colour, the comparison wil compare 2 black/white images

### `ignoreLess`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and compare with `red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240`

### `ignoreNothing`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and compare with `red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255`

### `ignoreTransparentPixel`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and it will ignore all pixels that have some transparency in one of the images

### `rawMisMatchPercentage`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

If true the return percentage will be like `0.12345678`, default is `0.12`

### `saveAboveTolerance`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Each comparison failure will create a diff image. This is an allowable value of misMatchPercentage that prevents saving image with differences

> **MORE OPTIONS WILL FOLLOW A.S.A.P., THINK ABOUT IMAGE COMPARE OPTIONS AND SO ON**

## Methods
This tool will add 4 methods to the WebdriverIO `browser`-object that can be used during tests.

### Save methods
#### saveElement
With this method you can create a screenshot of an element in the view. You'll need to provide the following options

##### `elementSelector`
- **Type:** `String`
- **Mandatory:** Yes

The `elementSelector` is the selector you normally use to select elements. This can be for example:
- Accessibility ID, see [here](http://webdriver.io/guide/usage/selectors.html#Accessibility-ID)
- Class Name, see [here](http://webdriver.io/guide/usage/selectors.html#Class-Name)
- XPath, see [here](http://webdriver.io/guide/usage/selectors.html#xPath)


##### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
browser.saveElement('~your-accessibility-id', 'name-of-your-file');
```

> **The major release will also hold options to resize dimensions, meaning that you provide options to make an element screenshot bigger by adding extra paddings to the initial element**

#### saveScreen
With this method you can create a screenshot of the view. You'll need to provide the following options

##### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
browser.saveScreen('name-of-your-file');
```

### Compare methods
#### compareElement
With this method you can compare a screenshot of an element in the view with a baseline image. **It will return a mismatch percentage between the actual element screenshot and the baseline.**
You'll need to provide the following options

##### `elementSelector`
- **Type:** `String`
- **Mandatory:** Yes

The `elementSelector` is the selector you normally use to select elements. This can be for example:
- Accessibility ID, see [here](http://webdriver.io/guide/usage/selectors.html#Accessibility-ID)
- Class Name, see [here](http://webdriver.io/guide/usage/selectors.html#Class-Name)
- XPath, see [here](http://webdriver.io/guide/usage/selectors.html#xPath)

##### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
expect(browser.compareElement('~your-accessibility-id', 'name-of-your-file')).toEqual(0);
```

##### `options`
- **Type:** `Object`
- **Mandatory:** no

You can provide an object with the following options, see [options](./README.md#options) for details

```js
expect(browser.compareElement(
    '~your-accessibility-id',
    'name-of-your-file',
    {
        ignoreAlpha: true,
        ignoreAntialiasing: true,
        ignoreColors: true,
        ignoreLess: true,
        ignoreNothing: true,
        ignoreTransparentPixel: true,
    },
)).toEqual(0);
```

> **The major release will also hold options to resize dimensions, meaning that you provide options to make an element screenshot bigger by adding extra paddings to the initial element**

#### compareScreen
With this method you can compare a screenshot of the view with a baseline image. **It will return a mismatch percentage between the actual screenshot and the baseline.**
You'll need to provide the following options

##### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
expect(browser.compareScreen('name-of-your-file')).toEqual(0);
```

##### `options`
- **Type:** `Object`
- **Mandatory:** no

You can provide an object with the following options, see [options](./README.md#options) for details

```js
expect(browser.compareElement(
    '~your-accessibility-id',
    'name-of-your-file',
    {
        ignoreAlpha: true,
        ignoreAntialiasing: true,
        ignoreColors: true,
        ignoreLess: true,
        ignoreNothing: true,
        ignoreTransparentPixel: true,
    },
)).toEqual(0);
```

## FAQ
> TO BE FILLED

## TODO:
The following still needs to be done
- Add more options for:
    - [ ] `autoSaveBaseline` If no baseline image is found the image is automatically copied to the baselinefolder
    - [x] `debug` Add some extra logging and always save the image difference
    - [ ] `formatImageName` Custom variables for Image Name (default:?)
    - [ ] `blockOutStatusBar`  If the statusbar on mobile / tablet needs to blocked out by default
    - [x] `ignoreAlpha` compare images and discard alpha
    - [x] `ignoreAntialiasing` compare images and discard anti aliasing
    - [x] `ignoreColors` Even though the images are in colour, the comparison wil compare 2 black/white images
    - [x] `ignoreLess` compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
    - [x] `ignoreNothing` compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
    - [x] `ignoreTransparentPixel` Will ignore all pixels that have some transparency in one of the images
    - [x] `rawMisMatchPercentage` default false. If true the return percentage will be like 0.12345678, default is 0.12
    - [ ] `androidOffsets` Object that will hold custom values for the statusBar
    - [ ] `iosOffsets` Object that will hold the custom values for the statusBar
    - [x] `saveAboveTolerance` Allowable value of misMatchPercentage that prevents saving image with differences
    - [ ] resize dimensions
    - [ ] implement logging to webdriver.io
    - [ ] ...
- [ ] Update docs
- [ ] Add tests

## Credits
- Credits go out to Tele2 Netherlands. They gave me the awesome assignment to automate a React Native app and also gave me the space to investigate the tools I needed to use to automate a React Native app.
- Also the WebdriverIO team and the WebdriverIO community. The tool is really awesome and easy to use and the support is really awesome!

## Licence
MIT
