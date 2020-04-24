import {ANDROID_STATUS_BAR_SELECTOR, ANDROID_NAVIGATION_BAR_SELECTOR} from '../helpers/constants'
import {multiplyIosObjectValuesAgainstDPR} from '../helpers/utils'
import {getDeviceInfo} from './getDeviceInfo'
import {nativeAppCompareLog} from '../helpers/logger'

let NAVIGATION_BAR_DIMENSIONS = null
let STATUS_BAR_DIMENSIONS = null

/**
 * Determine the ignore rectangles
 *
 * @param {string}  base64Image
 * @param {object}  options
 *
 * @return {Promise<Array>}
 */
export async function determineIgnoreRectangles(base64Image, options) {
    let rectangles = []
    let allowInvisibleElements
    const deviceInfo = await getDeviceInfo(base64Image)

    // With Android and UiAutomator2 the status bar is not in the view by default
    // It can be seen when {settings: {allowInvisibleElements: true}} is set
    // See http://appium.io/docs/en/advanced-concepts/settings/
    if (browser.isAndroid && (options.blockOutStatusBar || options.blockOutNavigationBar || options.elementBlockOuts.length > 0)) {
        allowInvisibleElements = (await browser.getSettings()).allowInvisibleElements
        await browser.updateSettings({allowInvisibleElements: true})
    }

    if (options.blockOutStatusBar) {
        // Holds the iOS determine
        rectangles.push(
            await determineStatusBarRectangles({
                dpr: deviceInfo.dpr,
                iosStatusBar: deviceInfo.iosRectangles.STATUS_BAR,
                screenshotWidth: deviceInfo.screenshotWidth
            })
        )
    }

    if (browser.isAndroid && options.blockOutNavigationBar) {
        rectangles.push(await determineAndroidNavigationBarRectangles({screenshotWidth: deviceInfo.screenshotWidth}))
    }

    if (options.blockOuts.length > 0) {
        rectangles = rectangles.concat(determineValidBlockOuts(options.blockOuts))
    }

    if (options.elementBlockOuts.length > 0) {
        rectangles = rectangles.concat(await determineElementBlockOuts({
            components: options.elementBlockOuts,
            dpr: deviceInfo.dpr,
        }))
    }

    if (deviceInfo.isIphoneXSeries && options.blockOutIphoneXBottomBar) {
        rectangles = rectangles.concat(multiplyIosObjectValuesAgainstDPR(
            deviceInfo.iosRectangles.HOME_BAR.PORTRAIT,
            deviceInfo.dpr,
        ))
    }

    if (browser.isAndroid && (options.blockOutStatusBar || options.blockOutNavigationBar || options.elementBlockOuts.length > 0)) {
        await browser.updateSettings({allowInvisibleElements})
    }

    return rectangles
}

/**
 * Determine the status bar height for iOS/Android
 *
 * @param {object} deviceInfo The device info
 * @param {number} deviceInfo.dpr
 * @param {number} deviceInfo.screenshotWidth
 * @param {number} deviceInfo.iosStatusBar
 *
 * @return {Promise<{
 *      bottom: number,
 *      right: number,
 *      left: number,
 *      top: number
 * }>}
 */
export async function determineStatusBarRectangles({dpr, iosStatusBar, screenshotWidth}) {
    if (STATUS_BAR_DIMENSIONS) {
        return STATUS_BAR_DIMENSIONS
    }

    let rectangles
    const iosRectangles = {
        height: iosStatusBar,
        width: screenshotWidth,
        left: 0,
        top: 0,
    }

    try {
        rectangles = browser.isIOS
            ? iosRectangles
            : await getElementRectangles(await ($(ANDROID_STATUS_BAR_SELECTOR)))
    } catch (e) /* istanbul ignore next */ {
        nativeAppCompareLog.warn('The Android statusbar could not be determined and has been set to the defaults!\n')

        rectangles = {
            height: 26,
            width: screenshotWidth,
            left: 0,
            top: 0,
        }
    }

    STATUS_BAR_DIMENSIONS = multiplyIosObjectValuesAgainstDPR({
        bottom: rectangles.height,
        right: rectangles.width,
        left: 0,
        top: 0
    }, dpr)

    return STATUS_BAR_DIMENSIONS
}

/**
 * Determine the navigation bar height for Android
 *
 * @param {object} navigationBarOptions
 * @param {number} navigationBarOptions.screenshotWidth
 *
 * @return {Promise<{
 *      bottom: number,
 *      right: number,
 *      left: number,
 *      right: number
 * }>}
 */
export async function determineAndroidNavigationBarRectangles({screenshotWidth}) {
    if (NAVIGATION_BAR_DIMENSIONS) {
        return NAVIGATION_BAR_DIMENSIONS
    }

    let rectangles = {
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    }

    try {
        rectangles = await getElementRectangles(await $(ANDROID_NAVIGATION_BAR_SELECTOR))
    } catch (e) /* istanbul ignore next */ {
        nativeAppCompareLog.warn('The navigation bar could not be determined and has been set to the defaults!\n')
    }

    NAVIGATION_BAR_DIMENSIONS = {
        bottom: rectangles.height,
        right: screenshotWidth,
        left: rectangles.x,
        top: rectangles.y
    }

    return NAVIGATION_BAR_DIMENSIONS
}

/**
 * Determine if the block outs are valid
 *
 * @param {array}   blockOuts
 *
 * @return {[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]}
 */
export function determineValidBlockOuts(blockOuts) {
    const dimensions = []
    const validKeys = ['x', 'y', 'width', 'height']

    blockOuts.forEach(blockOut => {
        let validBlockOutObject = true
        Object.keys(blockOut).forEach(key => {
            if (!validKeys.includes(key)) {
                nativeAppCompareLog.error(`
###################################################
 Blockout:
 ${JSON.stringify(blockOut)}

 is not allowed. Key: ${key} is not allowed,
 only 'x', 'y', 'width', 'height' are allowed
###################################################
`)
                validBlockOutObject = false
            }
        })

        if (validBlockOutObject) {
            dimensions.push({
                bottom: blockOut.height,
                right: blockOut.width,
                left: blockOut.x,
                top: blockOut.y,
            })
        }
    })

    return dimensions
}

/**
 * Determine the element block out data
 *
 * @param {object} elementBlockOutsData
 * @param {array} elementBlockOutsData.components
 * @param {number} elementBlockOutsData.dpr
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
export async function determineElementBlockOuts({components, dpr}) {
    const dimensions = []

    for (let component of components) {
        const selector = await component.element.selector
        // By providing elementNumber a specific element from the element array will be used
        const hasNumber = Object.prototype.hasOwnProperty.call(component, 'elementNumber')

        try {
            const elements = hasNumber ? [(await ($$(selector)))[component.elementNumber]] : (await ($$(selector)))
            const margin = component.margin || 0

            for (let element of elements) {
                const rectangles = await getElementRectangles(element)
                dimensions.push(determineDimensions(rectangles, margin))
            }
        } catch (e) /* istanbul ignore next */ {
            nativeAppCompareLog.warn(`Something went wrong with finding / determining the rectangles of the element with selector: '${selector}'.`)
            nativeAppCompareLog.warn('This error has been catched and shown below, but the test did not brake based on this error')
            nativeAppCompareLog.warn('\n', e, '\n')

        }
    }


    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, dpr))
}

/**
 * Determine the dimensions
 *
 * @param {object} rectangles   An object with height, width,x and y
 * @param {number} margin       The margin that needs to be used
 *
 * @return {{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }}
 */
export function determineDimensions(rectangles, margin) {
    return {
        bottom: rectangles.height + (2 * margin),
        right: rectangles.width + (2 * margin),
        left: rectangles.x - margin,
        top: rectangles.y - margin,
    }
}

/**
 * Get the rectangles of an element
 *
 * @param {object}  element
 * @return {Promise<{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }>}
 */
export async function getElementRectangles(element) {
    return (await (browser.getElementRect(element.elementId)))
}
