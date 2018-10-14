import { DEFAULT_RESIZE_DIMENSIONS } from '../helpers/constants';
import { takeBase64Screenshot } from '../helpers/takeBase64Screenshot';
import { getDeviceInfo } from './getDeviceInfo';
import { makeCroppedBase64Image } from './makeCroppedBase64Image';

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
    const selector = await element.selector;

    // Determine location and size of element
    const elementLocation = await browser.getLocation(selector);
    const elementSize = await browser.getElementSize(selector);

    // Take a screenshot
    const base64Screenshot = await takeBase64Screenshot();

    // Get the device info like screenSize, screenshotHeight, screenshotHeight
    const deviceInfo = await getDeviceInfo(base64Screenshot);

    // Create the cropped screenshot and return it
    return await makeCroppedBase64Image(
        base64Screenshot,
        {
            height: (elementSize.height * deviceInfo.dpr),
            width: (elementSize.width * deviceInfo.dpr),
            x: (elementLocation.x * deviceInfo.dpr),
            y: (elementLocation.y * deviceInfo.dpr),
        },
        resizeDimensions,
    );
}
