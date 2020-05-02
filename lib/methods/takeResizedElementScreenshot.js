import {DEFAULT_RESIZE_DIMENSIONS} from '../helpers/constants'
import {takeBase64Screenshot} from '../methods/takeBase64Screenshot'
import {getDeviceInfo} from './getDeviceInfo'
import {makeCroppedBase64Image} from './makeCroppedBase64Image'
import {getElementRectangles} from './rectangles'
import {multiplyIosObjectValuesAgainstDPR} from '../helpers/utils'

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
    const {dpr} = await getDeviceInfo(base64Screenshot)

    // Create the cropped screenshot and return it
    return await makeCroppedBase64Image(
        base64Screenshot,
        multiplyIosObjectValuesAgainstDPR({
            height: elementRectangles.height,
            width: elementRectangles.width,
            x: elementRectangles.x,
            y: elementRectangles.y,
        }, dpr),
        resizeDimensions,
    )
}
