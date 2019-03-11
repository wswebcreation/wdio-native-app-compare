import { determineIphoneXSeries, determineLargeIphoneXSeries } from '../helpers/utils'

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
 *      isIphoneXSeries: boolean,
 *      isLargeIphoneXSeries: boolean,
 * }>}
 */
export async function getDeviceInfo(screenshot) {
    if (DEVICE_INFO) {
        return DEVICE_INFO
    }

    const screenshotWidth = Buffer.from(screenshot, 'base64').readUInt32BE(16)
    const screenSize = (await browser.getWindowSize())
    const isIphoneXSeries = determineIphoneXSeries(screenSize)
    const isLargeIphoneXSeries = determineLargeIphoneXSeries(screenSize)

    DEVICE_INFO = {
        dpr: screenshotWidth / screenSize.width,
        screenSize,
        screenshotHeight: Buffer.from(screenshot, 'base64').readUInt32BE(20),
        screenshotWidth,
        isIphoneXSeries,
        isLargeIphoneXSeries,
    }

    return DEVICE_INFO
}
