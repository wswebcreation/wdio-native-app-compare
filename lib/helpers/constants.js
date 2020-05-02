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
export const NO_DEVICE_NAME = 'no-device-name-in-caps'

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
                bottom: 6,
                right: 135,
                left: 120,
                top: 799,
            },
        },
    },
    X_LARGE: {
        STATUS_BAR: 44,
        HOME_BAR: {
            PORTRAIT: {
                bottom: 6,
                right: 148,
                left: 133,
                top: 883,
            },
        },
    },
}
