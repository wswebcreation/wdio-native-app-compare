import {DEFAULT_BASELINE_FOLDER, DEFAULT_SCREENSHOTS_FOLDER} from './constants'
import {nativeAppCompareLog} from './logger'

/**
 * Validate and if needed default the init options
 *
 * @param {object} options
 * @return {{
 *      baselineFolder: string,
 *      screenshotPath: string
 * }}
 */
function initOptions(options) {
    const init = {}
    const newOptions = options.nativeAppCompare || options

    if (!('baselineFolder' in newOptions)) {
        const baselineFolderMessage = `'baselineFolder'-property is missing in the wdio-config file! 'baselineFolder' set to '${DEFAULT_BASELINE_FOLDER}'`

        nativeAppCompareLog.warn(baselineFolderMessage)

        init.baselineFolder = DEFAULT_BASELINE_FOLDER
    }

    if (!('screenshotPath' in newOptions)) {
        const screenshotsFolderMessage = `'screenshotPath'-property is missing in the wdio-config file! 'screenshotPath' set to '${DEFAULT_SCREENSHOTS_FOLDER}'`

        nativeAppCompareLog.warn(screenshotsFolderMessage)

        init.screenshotPath = DEFAULT_SCREENSHOTS_FOLDER
    }

    return {
        ...init,
        ...newOptions,
    }
}

/**
 * Determine the default compare options
 *
 * @param {object}  options
 * @param {boolean} options.blockOutStatusBar If the statusbar on mobile / tablet needs to blocked out by default
 * @param {boolean} options.blockOutNavigationBar If the navigation bar on mobile / tablet needs to blocked out by default. This will only
 *   work on Android
 * @param {boolean} options.blockOutIphoneXBottomBar Block out the iPhoneX bottom bar
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16,
 *   maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0,
 *   maxBrightness=255
 * @param {number}  options.largeImageThreshold Enable skipping pixels during the comparison to mitigate performance issues based on a
 *   amount of pixels (width / height), default 0
 * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
 * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
 *
 * @return {{
 *      blockOutStatusBar: boolean,
 *      blockOutNavigationBar: boolean,
 *      blockOutIphoneXBottomBar: boolean,
 *      debug: boolean,
 *      elementBlockOuts: array,
 *      ignore: array,
 *      ignoreAlpha: boolean,
 *      ignoreAntialiasing: boolean,
 *      ignoreColors: boolean,
 *      ignoreLess: boolean,
 *      ignoreNothing: boolean,
 *      rawMisMatchPercentage: boolean,
 *      saveAboveTolerance: number,
 *      output: {
 *        largeImageThreshold: number,
 *        errorColor: {
 *          red: number,
 *          green: number,
 *          blue: number,
 *        }
 *      }
 *  }}
 */
function defaultCompareOptions(options) {
    return {
        blockOuts: [],
        blockOutStatusBar: options.blockOutStatusBar || false,
        blockOutNavigationBar: options.blockOutNavigationBar || false,
        blockOutIphoneXBottomBar: options.blockOutIphoneXBottomBar || false,
        elementBlockOuts: [],
        debug: options.debug || false,
        ignore: [],
        ignoreAlpha: options.ignoreAlpha || false,
        ignoreAntialiasing: options.ignoreAntialiasing || false,
        ignoreColors: options.ignoreColors || false,
        ignoreLess: options.ignoreLess || false,
        ignoreNothing: options.ignoreNothing || false,
        rawMisMatchPercentage: options.rawMisMatchPercentage || false,
        saveAboveTolerance: options.saveAboveTolerance || 0,
        output: {
            largeImageThreshold: options.largeImageThreshold || 0,
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
        }
    }
}

/**
 * Determine the instance compare options
 *
 * @param {object}  options
 * @param {array}   options.blockOuts One or multiple block outs on a screen / element can be provided in an Array with objects
 * @param {boolean} options.blockOutStatusBar If the statusbar on mobile / tablet needs to blocked out by default
 * @param {boolean} options.blockOutNavigationBar If the navigation bar on mobile / tablet needs to blocked out by default. This will only
 *   work for Android
 * @param {boolean} options.blockOutIphoneXBottomBar Block out the iPhoneX bottom bar
 * @param {array}   options.elementBlockOuts One or multiple elements that need to be blocked out
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16,
 *   maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0,
 *   maxBrightness=255
 * @param {object}  options.resizeDimensions The compare options used as `{top:0, right:0, bottom:0, left:0}`
 *
 * @return {{}}
 */
function instanceCompareOptions(options) {
    return {
        ...(options.blockOuts ? {blockOuts: options.blockOuts} : {}),
        ...(options.blockOutStatusBar ? {blockOutStatusBar: options.blockOutStatusBar} : {}),
        ...(options.blockOutIphoneXBottomBar ? {blockOutIphoneXBottomBar: options.blockOutIphoneXBottomBar} : {}),
        ...(options.blockOutNavigationBar ? {blockOutNavigationBar: options.blockOutNavigationBar} : {}),
        ...(options.elementBlockOuts ? {elementBlockOuts: options.elementBlockOuts} : {}),
        ...(options.ignoreAlpha ? {ignoreAlpha: options.ignoreAlpha} : {}),
        ...(options.ignoreAntialiasing ? {ignoreAntialiasing: options.ignoreAntialiasing} : {}),
        ...(options.ignoreColors ? {ignoreColors: options.ignoreColors} : {}),
        ...(options.ignoreLess ? {ignoreLess: options.ignoreLess} : {}),
        ...(options.ignoreNothing ? {ignoreNothing: options.ignoreNothing} : {}),
        ...(options.resizeDimensions ? {resizeDimensions: options.resizeDimensions} : null),
    }
}

export {
    defaultCompareOptions,
    initOptions,
    instanceCompareOptions,
}
