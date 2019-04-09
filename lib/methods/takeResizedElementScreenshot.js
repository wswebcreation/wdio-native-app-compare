import { DEFAULT_RESIZE_DIMENSIONS } from '../helpers/constants'
import { takeBase64Screenshot } from '../methods/takeBase64Screenshot'
import { getDeviceInfo } from './getDeviceInfo'
import { makeCroppedBase64Image } from './makeCroppedBase64Image'
import { getElementRectangles } from './rectangles'

/**
 * Save a resized element screenshot
 *
 * @param {object}  element
 * @param {string}  filePath
 * @param {object}  resizeDimensions
 *
 * @return {Promise<string>}
 *
 * @private
 */
export async function takeResizedElementScreenshot(element, filePath, resizeDimensions = DEFAULT_RESIZE_DIMENSIONS) {
    // Determine location and size of element
    const elementRectangles = await getElementRectangles(element)

    // Take a screenshot
    const base64Screenshot = await takeBase64Screenshot()

    // Get the device info like screenSize, screenshotHeight, screenshotHeight
    const deviceInfo = await getDeviceInfo(base64Screenshot)

    // Create the cropped screenshot and return it
    return await makeCroppedBase64Image(
        base64Screenshot,
        {
            height: (elementRectangles.height * deviceInfo.dpr),
            width: (elementRectangles.width * deviceInfo.dpr),
            x: (elementRectangles.x * deviceInfo.dpr),
            y: (elementRectangles.y * deviceInfo.dpr),
        },
        resizeDimensions,
    )
}
