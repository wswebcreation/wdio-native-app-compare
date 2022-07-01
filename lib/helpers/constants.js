export const ACTUAL = 'actual'
export const DEFAULT_IMAGE_FORMAT_NAME = '{tag}-{deviceName}'
export const DEFAULT_BASELINE_FOLDER = './baseline'
export const DEFAULT_RESIZE_DIMENSIONS = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}
export const DEFAULT_SCREENSHOTS_FOLDER = './.tmp/screenshots'
export const DIFF = 'diff'
export const NO_DEVICE_NAME = 'no-device-name-in-caps'
export const NO_ORIENTATION = 'no-orientation-in-caps'
export const NO_PLATFORM_NAME = 'no-platform-name-in-caps'
export const NO_PLATFORM_VERSION = 'no-platform-version-in-caps'
export const NO_APPEARANCE = 'no-appearance-in-caps'

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
// X|XS|11Pro|12Mini|13Mini  812
// 12|12Pro|13|13Pro:        844
// XSMax|XR|11|11ProMax:     896
// 12ProMax|13ProMax         926
export const IPHONE_SMALL_SIZE = 812
export const IPHONE_MEDIUM_SIZE = 844
export const IPHONE_LARGE_SIZE = 896
export const IPHONE_EXTRA_LARGE_SIZE = 926
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
    SMALL: {
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
    LARGE: {
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
    MEDIUM: {
        STATUS_BAR: 44,
        HOME_BAR: {
            PORTRAIT: {
                bottom: 7,
                right: 140,
                left: 125,
                top: 830,
            },
        },
    },
    EXTRA_LARGE: {
        STATUS_BAR: 44,
        HOME_BAR: {
            PORTRAIT: {
                bottom: 7,
                right: 155,
                left: 136,
                top: 912,
            },
        },
    },
}
