# Options

## Plugin options

### `autoSaveBaseline`

-   **Type:** `boolean`
-   **Mandatory:** No
-   **Default:** `false`

If no baseline image is found the image is automatically copied to the baselinefolder

### `baselineFolder`

-   **Type:** `String`
-   **Mandatory:** Yes

The directory that will hold all the baseline images that are used to execute the comparison

Each comparison failure will create a diff image. This is an allowable value of misMatchPercentage that prevents saving image with differences

### `blockOutStatusBar`

-   **Type:** `boolean`
-   **Mandatory:** No
-   **Default:** `false`
-   **Remark:** _Can also be used for `compareScreen()`. It will override the plugin setting_

Block out the status bar of iOS / Android during the comparison

### `blockOutIphoneHomeBar`

-   **Type:** `boolean`
-   **Mandatory:** No
-   **Default:** `false`
-   **Remark:** _Can also be used for `compareScreen()`. It will override the plugin setting. This will only work for iOS_

Block out the bottom bar on a iPhone X during the comparison

### `blockOutNavigationBar`

-   **Type:** `boolean`
-   **Mandatory:** No
-   **Default:** `false`
-   **Remark:** _Can also be used for `compareScreen()`. It will override the plugin setting. This will only work for Android_

Block out the navigation bar Android during the comparison

### `debug`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no

Add some extra logging and always save the image difference

### `ignoreAlpha`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Compare images and discard alpha

### `ignoreAntialiasing`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Compare images and discard anti aliasing

### `ignoreColors`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Even though the images are in colour, the comparison wil compare 2 black/white images

### `ignoreLess`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Compare images and compare with `red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240`

### `ignoreNothing`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Compare images and compare with `red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255`

### `ignoreTransparentPixel`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Compare images and it will ignore all pixels that have some transparency in one of the images

### `imageNameFormat`

-   **Type:** `string`
-   **Default:** `{tag}-{deviceName}`
-   **Mandatory:** no

The naming of the images can be customized by passing the parameter `imageNameFormat` with a format string like:

```
{tag}-{deviceName}
```

The following variables can be passed to format the string and will automatically been read from the instance capabilities.
If they can't be determined the defaults will be used. This module will support the old JSON Wire Protocol as the new W3C Protocol, see below.

**W3C Protocol**

-   `appium:deviceName`: The name of the device from the capabilities (default: 'no-device-name-in-caps')
-   `appium:orientation`: The orientation from capabilities (default: 'no-orientation-in-caps')
-   `appium:platformName`: The platformName from the capabilities (default: 'no-platformName-in-caps')
-   `appium:platformVersion`: The platformVersion from capabilities (default: 'no-platformVersion-in-caps')
-   `nacs:appearance`: The appearance from capabilities (default: 'no-appearance-in-caps')

**Old JSON Wire Protocol**

-   `deviceName`: The name of the device from the capabilities (default: 'no-device-name-in-caps')
-   `orientation`: The orientation from capabilities (default: 'no-orientation-in-caps')
-   `platformName`: The platformName from the capabilities (default: 'no-platformName-in-caps')
-   `platformVersion`: The platformVersion from capabilities (default: 'no-platformVersion-in-caps')
-   `appearance`: The appearance from capabilities (default: 'no-appearance-in-caps')

### `largeImageThreshold`

-   **Type:** `number`
-   **Default:** `0`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Comparing large images can lead to performance issues.
When providing a number for the amount of pixels here (higher then 0), the comparison algorithm skips pixels when the image width or height is larger than `largeImageThreshold` pixels.

### `rawMisMatchPercentage`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

If true the return percentage will be like `0.12345678`, default is `0.12`

### `saveAboveTolerance`

-   **Type:** `number`
-   **Default:** `false`
-   **Mandatory:** no
-   **Remark:** _Can also be used for `compareElement` and `compareScreen()`. It will override the plugin setting_

Allowable value of misMatchPercentage that prevents saving image with differences

### `savePerDevice`

-   **Type:** `boolean`
-   **Default:** `false`
-   **Mandatory:** no

Save the images per device in a separate folder

### `screenshotPath`

-   **Type:** `String`
-   **Mandatory:** Yes

The directory that will hold all the actual / difference screenshots

## Method options

### Save options

#### `resizeDimensions`

-   **Type:** `object`
-   **Mandatory:** no
-   **For:** Can be used with and `saveElement()`

An object that can hold a `top`, `right`, `bottom` and or `left` amount of pixels that need to make the element cutout bigger.

> **NOTE:**
> If only 1, like `right`, is provided the rest is defaulted to `0`

```js
// With all resize dimensions
await driver.saveElement(await $('~selector'), 'tag-name-of-image', {
    resizeDimensions: {
        top: 10,
        right: 20,
        bottom: 30,
        left: 40,
    },
})
// With only 1 resize dimension
await driver.saveElement(await $('~selector'), 'tag-name-of-image', {
    resizeDimensions: {
        left: 10,
    },
})
```

### Compare options

#### `blockOuts`

-   **Type:** `object`
-   **Mandatory:** no
-   **For:** Can be used with and `compareScreen()` and `compareElement()`

One or multiple block outs on a screen / element. It can be provided in an Array with objects like this

```js
await driver.compareScreen('tag-name-of-image', {
    blockOuts: [
        // block out area 1
        {
            height: 100,
            width: 100,
            x: 50,
            y: 15,
        },
        // block out area 2
        {
            height: 25,
            width: 75,
            x: 200,
            y: 150,
        },
    ],
})
```

The numbers need to be the pixels from the actual image. Just create a screenshot and determine `height`, `width`, `x`, `y` and pass it into here.

> **THIS OPTION WILL NOT AUTOMATICALLY DETERMINE THE COORDINATES BASED ON A SREEN, THEY WILL BE THE SAME FOR ALL DEVICES.MEANING THAT BLOCKSOUTS CAN BE ON DIFFERENT PLACES ON DIFFERENT PHONES/SCREENS**

#### `elementBlockOuts`

-   **Type:** `array`
-   **Mandatory:** no
-   **For:** Only for `compareScreen()`

One or multiple elements that need to be blocked out on a screen that can be provided in an Array with objects like this.
You can also add an additional margin, this will be in pixels based on the actual screenshot.
If it is expected that the element his selector will return multiple elements an `elementNumber` can be provided to tell which element should be blocked out

> **NOTE:**
> If an element (selector) returns multiple matched elements all matching elements will automatically be blocked out, this can be prevented by providing the `elementNumber`

```js
await driver.compareScreen('tag-name-of-image', {
    elementBlockOuts: [
        // block out element 1 with margin
        {
            element: await $('~the-accessibility-selector-2'),
            margin: 50,
        },
        // block out the second element of element 3
        {
            element: await $$('~the-accessibility-selector-4'),
            elementNumber: 1,
        },
    ],
})
```

#### `resizeDimensions`

-   **Type:** `object`
-   **Mandatory:** no
-   **For:** Can be used with and `compareElement()`

An object that can hold a `top`, `right`, `bottom` and or `left` amount of pixels that need to make the element cutout bigger.

> **NOTE:**
> If only 1, like `right`, is provided the rest is defaulted to `0`

```js
// With all resize dimensions
await driver.compareElement(await $('~selector'), 'tag-name-of-image', {
    resizeDimensions: {
        top: 10,
        right: 20,
        bottom: 30,
        left: 40,
    },
})
// With only 1 resize dimension
await driver.compareElement(await $('~selector'), 'tag-name-of-image', {
    resizeDimensions: {
        left: 10,
    },
})
```
