import { resolve } from 'path';
import { writeFileSync } from 'fs-extra';
import { saveImage } from '../../build/helpers/image';
import { getBufferedScreenshot } from '../helpers/screenshots';
import { determineFilePath, formatFileName, getDeviceInfo } from '../helpers/utils';
import { saveCroppedScreenshot } from '../helpers/image';

/**
 * Save an element
 *
 * @TODO:
 * - [ ] Add more options and update docs
 * - [ ] Add more examples
 *
 * @param {object}  element The element
 * @param {string}  tag
 * @param {object}  options
 *
 * @example
 *  // Default
 *  browser.saveElement('~selector', 'tag-name-of-image');
 *
 * @return {Promise<void>}
 */
export default async function saveElement(element, tag, options = {}) {
    const filePath = determineFilePath(
        this.folders.actualFolder,
        this.savePerDevice,
        formatFileName(this.formatString, tag)
    );

    if (options.resizeDimensions) {
        return saveResizedElement(element, filePath);
    }

    await saveElementScreenshot(element, filePath);
}

/**
 * Save the element based on the elementIdScreenshot of webdriver.io
 *
 * @param {object}  element
 * @param {string}  filePath
 *
 * @return {Promise<void>}
 *
 * @private
 */
async function saveElementScreenshot(element, filePath) {
    const id = await element.value.ELEMENT;
    let screenshot;

    try {
        screenshot = new Buffer((await browser.elementIdScreenshot(id)).value, 'base64');
    } catch (e) {
        console.log(`
#####################################################################################
 AN ELEMENT SCREENSHOT COULD NOT BE TAKEN WITH THE NEW 'elementScreenshop()' METHOD, 
 A FALLBACK HAS BEEN EXECUTED AND THE ELEMENT WILL BE SAVED.
 USE 'automationName: "UiAutomator2"' TO FULLY USE THE POWER OF APPIUM
#####################################################################################
`);
        return saveResizedElement(element, filePath);
    }

    await saveImage(filePath, screenshot);
}

/**
 * Save a resized element screenshot
 * @TODO: implement the resizing
 *
 * @param {object}  element
 * @param {string}  fileName
 *
 * @return {Promise<void>}
 *
 * @private
 */
async function saveResizedElement(element, fileName) {
    const selector = await element.selector;
    const elementLocation = await browser.getLocation(selector);
    const elementSize = await browser.getElementSize(selector);
    // Take the screenshot
    const bufferedScreenshot = await getBufferedScreenshot();
    // Get the device info like screensize, screenshotHeight, screenshotHeight
    const deviceInfo = await getDeviceInfo(bufferedScreenshot);

    // Save the cropped screenshot
    await saveCroppedScreenshot(
        bufferedScreenshot,
        fileName,
        {
            height: elementSize.height,
            width: elementSize.width,
            x: elementLocation.x,
            y: elementLocation.y,
        },
        deviceInfo,
    );
}
