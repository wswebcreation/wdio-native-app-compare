import {
    determineIphoneXSeries,
    determineLargeIphoneXSeries,
    getScreenshotSize,
    multiplyIosObjectValuesAgainstDPR
} from '../helpers/utils'
import {IOS_RECTANGLES} from '../helpers/constants'

let DEVICE_INFO = null

/**
 * Get the device info and store it to a global if needed
 *
 * @param   {string}  screenshot
 *
 * @return  {Promise<{
 *      dpr: number,
 *      screenSize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number,
 *      isPortrait: boolean,
 *      isIphoneXSeries: boolean,
 *      isLargeIphoneXSeries: boolean,
 *      rectangles: {
 *          androidNavigationBar: {
 *              bottom: number,
 *              right: number,
 *              left: number,
 *              top: number,
 *          }
 *          iOSHomeBar: {
 *              bottom: number,
 *              right: number,
 *              left: number,
 *              top: number,
 *          }
 *          statusBar: {
 *              bottom: number,
 *              right: number,
 *              left: number,
 *              top: number,
 *          }
 *      }
 * }>}
 */
export async function getDeviceInfo(screenshot) {
    if (DEVICE_INFO) {
        return DEVICE_INFO
    }
    // A lot of data is already given back in the capabilities from the driver
    // Android gives back extra which we will use:
    // - pixelRatio
    // - statBarHeight
    // - viewportRect
    const {pixelRatio, statBarHeight, viewportRect} = driver.capabilities
    const {height: screenshotHeight, width: screenshotWidth} = getScreenshotSize(screenshot)
    const screenSize = (await driver.getWindowSize())
    const dpr = pixelRatio || (screenshotWidth / screenSize.width)
    const isIphoneXSeries = determineIphoneXSeries(screenSize)
    const isLargeIphoneXSeries = determineLargeIphoneXSeries(screenSize)
    const isPortrait = screenSize.height > screenSize.width
    const androidNavigationBar = viewportRect
        ? {bottom: screenshotHeight, left: 0, right: screenshotWidth, top: viewportRect.height + statBarHeight}
        : {bottom: 0, left: 0, right: 0, top: 0}
    const iosRectangles = {
        ...(isLargeIphoneXSeries ? IOS_RECTANGLES.X_LARGE : isIphoneXSeries ? IOS_RECTANGLES.X : IOS_RECTANGLES.DEFAULT)
    }

    DEVICE_INFO = {
        dpr,
        screenSize,
        screenshotHeight,
        screenshotWidth,
        isPortrait,
        isIphoneXSeries,
        isLargeIphoneXSeries,
        rectangles: {
            androidNavigationBar,
            // @TODO: if orientation is implemented also add it here
            iOSHomeBar: multiplyIosObjectValuesAgainstDPR(iosRectangles.HOME_BAR.PORTRAIT, dpr),
            statusBar: {
                bottom: statBarHeight || (iosRectangles.STATUS_BAR * dpr),
                left: 0,
                right: screenshotWidth,
                top: 0
            }
        }
    }

    return DEVICE_INFO
}
