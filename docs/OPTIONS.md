# Options

## `baselineFolder`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the baseline images that are used to execute the comparison

Each comparison failure will create a diff image. This is an allowable value of misMatchPercentage that prevents saving image with differences

## `blockOutStatusBar`
- **Type:** `boolean`
- **Mandatory:** No
- **Default:** `false`

Block out the status bar of iOS / Android during the comparison

## `debug`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

The directory that will

## `ignoreAlpha`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and discard alpha

## `ignoreAntialiasing`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and discard anti aliasing

## `ignoreColors`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Even though the images are in colour, the comparison wil compare 2 black/white images

## `ignoreLess`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and compare with `red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240`

## `ignoreNothing`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and compare with `red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255`

## `ignoreTransparentPixel`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

Compare images and it will ignore all pixels that have some transparency in one of the images

## `rawMisMatchPercentage`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

If true the return percentage will be like `0.12345678`, default is `0.12`

## `largeImageThreshold`
- **Type:** `number`
- **Default:** `0`
- **Mandatory:** no

Comparing large images can lead to performance issues.
When providing a number for the amount of pixels here (higher then 0), the comparison algorithm skips pixels when the image width or height is larger than `largeImageThreshold` pixels.

## `saveAboveTolerance`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** no

## `screenshotPath`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the actual / difference screenshots

> **MORE OPTIONS WILL FOLLOW A.S.A.P., THINK ABOUT IMAGE COMPARE OPTIONS AND SO ON**
