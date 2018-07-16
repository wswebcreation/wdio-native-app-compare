# Options

## Plugin options

### `autoSaveBaseline`
- **Type:** `boolean`
- **Mandatory:** No
- **Default:** `false`

If no baseline image is found the image is automatically copied to the baselinefolder

### `baselineFolder`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the baseline images that are used to execute the comparison

Each comparison failure will create a diff image. This is an allowable value of misMatchPercentage that prevents saving image with differences

### `blockOutStatusBar`
- **Type:** `boolean`
- **Mandatory:** No
- **Default:** `false`

Block out the status bar of iOS / Android during the comparison

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

### `imageNameFormat`
- **Type:** `string`
- **Default:** `{tag}-{deviceName}`
- **Mandatory:** no

The naming of the images can be customized by passing the parameter `imageNameFormat` with a format string like:

```
{tag}-{deviceName}
```

The following variables can be passed to format the string and will automatically been read from the [instance capabilities](http://webdriver.io/guide/testrunner/browserobject.html#Get-desired-capabilities).
If they can't be determined the defaults will be use.

* `deviceName`: The name of the device from the capabilities (default: 'no-device-name-in-caps')
* `orientation`: The orientation from capabilities (default: 'no-orientation-in-caps')
* `platformName`: The platformName from the capabilities (default: 'no-platformName-in-caps')
* `platformVersion`: The platformVersion from capabilities (default: 'no-platformVersion-in-caps')

### `largeImageThreshold`
- **Type:** `number`
- **Default:** `0`
- **Mandatory:** no

Comparing large images can lead to performance issues.
When providing a number for the amount of pixels here (higher then 0), the comparison algorithm skips pixels when the image width or height is larger than `largeImageThreshold` pixels.

### `rawMisMatchPercentage`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

If true the return percentage will be like `0.12345678`, default is `0.12`

### `saveAboveTolerance`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Allowable value of misMatchPercentage that prevents saving image with differences

### `savePerDevice`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Save the images per device in a separate folder

### `screenshotPath`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the actual / difference screenshots

> **MORE OPTIONS WILL FOLLOW A.S.A.P., THINK ABOUT IMAGE COMPARE OPTIONS AND SO ON**


## Method options

### Compare options

####  `blockOuts`
- **Type:** `object`
- **Mandatory:** no

One or multiple block outs on a screen / element can be provided in an Array with objects like this

```js
browser.compareScreen(
    'tag-name-of-image',
    {
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
            }
        ]
    }
);
```

The numbers need to be the pixels from the actual image. Just create a screenshot and determine `height`, `width`, `x`, `y` and pass it into here.

> **THIS OPTION WILL NOT AUTOMATICALLY DETERMINE THE COORDINATES BASED ON A SREEN, THEY WILL BE THE SAME FOR ALL DEVICES.MEANING THAT BLOCKSOUTS CAN BE ON DIFFERENT PLACES ON DIFFERENT PHONES/SCREENS**
