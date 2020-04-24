export const ACTUAL = 'actual'
export const DEFAULT_IMAGE_FORMAT_NAME = '{tag}-{deviceName}'
export const DEFAULT_BASELINE_FOLDER = './baseline'
export const DEFAULT_RESIZE_DIMENSIONS = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}
export const DEFAULT_SCREENSHOTS_FOLDER = './.tmp/screenshots'
export const DIFF = 'diff'
export const ANDROID_NAVIGATION_BAR_SELECTOR = '//*[@resource-id="android:id/navigationBarBackground"]'
export const NO_DEVICE_NAME = 'no-device-name-in-caps'
export const ANDROID_STATUS_BAR_SELECTOR = '//*[@resource-id="android:id/statusBarBackground"]'

//=====================
// iPhone X-series data
//=====================
// Height of screen in portrait mode, this is also what you get back
// when you:
//  - ask for the screen dimensions in WebdriverIO `getWindowSize`
//  - with `screen.height` in Safari devtools
//  - with http://whatismyscreenresolution.net/
// 6/7/8:                    667
// 6/7/8/Plus:               736
// X/S/11pro:                812
// Xr/Xs Max/11/11pro max:   896
export const IPHONE_X_SIZE = 812
export const IPHONE_X_MAX_SIZE = 896
export const IPHONE_X_DEFAULT_HOME_BAR = {
    bottom: 15,
    right: 402,
    left: 362,
    top: 2397
}
export const IPHONE_X_LARGE_HOME_BAR = {
    bottom: 15,
    right: 444,
    left: 399,
    top: 2649
}
export const IOS_RECTANGLES = {
    DEFAULT: {
        STATUS_BAR: 20,
        HOME_BAR: {
            PORTRAIT: {
                height: 0,
                width: 0,
                x: 0,
                y: 0,
            },
        },
    },
    X: {
        STATUS_BAR: 44,
        HOME_BAR: {
            PORTRAIT: {
                height: 5,
                width: 135,
                x: 120,
                y: 799,
            },
        },
    },
    X_LARGE: {
        STATUS_BAR: 44,
        HOME_BAR: {
            PORTRAIT: {
                height: 5,
                width: 148,
                x: 133,
                y: 883,
            },
        },
    },
}
