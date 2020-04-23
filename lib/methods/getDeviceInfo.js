import {determineIphoneXSeries, determineLargeIphoneXSeries, getScreenshotSize} from '../helpers/utils'
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
 *      iosRectangles: {
 *          STATUS_BAR: number,
 *          HOME_BAR: {
 *              PORTRAIT: {
 *                  height: number,
 *                  width: number,
 *                  x: number,
 *                  y: number,
 *              }
 *          }
 *      }
 * }>}
 */
export async function getDeviceInfo(screenshot) {
    if (DEVICE_INFO) {
        return DEVICE_INFO
    }
    const {height: screenshotHeight, width: screenshotWidth} = getScreenshotSize(screenshot)
    const screenSize = (await browser.getWindowSize())
    const isIphoneXSeries = determineIphoneXSeries(screenSize)
    const isLargeIphoneXSeries = determineLargeIphoneXSeries(screenSize)
    const isPortrait = screenSize.height > screenSize.width
    const iosRectangles = {
        ...(isLargeIphoneXSeries ? IOS_RECTANGLES.X_LARGE : isIphoneXSeries ? IOS_RECTANGLES.X : IOS_RECTANGLES.DEFAULT)
    }

    DEVICE_INFO = {
        dpr: screenshotWidth / screenSize.width,
        screenSize,
        screenshotHeight,
        screenshotWidth,
        isPortrait,
        isIphoneXSeries,
        isLargeIphoneXSeries,
        iosRectangles,
    }

    return DEVICE_INFO
}
