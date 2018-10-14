import { resolve } from 'path';
import { writeFileSync } from 'fs-extra';
import { yellow } from 'chalk';
import { takeBase64Screenshot } from '../helpers/takeBase64Screenshot';
import { formatFileName, getDeviceInfo } from '../helpers/utils';
import { makeCroppedBase64Image } from '../methods/makeCroppedBase64Image';
import saveBase64Image from '../methods/saveBase64Image';

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
 * @return {Promise<{
 *
 * }>}
 */
export default async function saveElement(element, tag, options = {}) {
    const fileName = formatFileName(this.formatString, tag);
    const filePath = resolve(this.folders.actual, fileName);

    if (options.resizeDimensions) {
        return saveResizedElement(element, filePath, options.resizeDimensions);
    }

    await saveElementScreenshot(element, filePath);

    return {
        fileName,
        folders: {
            actual: this.folders.actual
        }
    }
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

    console.log('saveElementScreenshot')

    try {
        screenshot = (await browser.elementIdScreenshot(id)).value;
    } catch (e) {
        console.log(yellow(`
#####################################################################################
 AN ELEMENT SCREENSHOT COULD NOT BE TAKEN WITH THE NEW 'elementScreenshot()' METHOD, 
 A FALLBACK HAS BEEN EXECUTED AND THE ELEMENT WILL BE SAVED.
 USE 'automationName: "UiAutomator2"' FOR ANDROID TO FULLY USE THE POWER OF APPIUM
#####################################################################################
`));
        return saveResizedElement(element, filePath);
    }

    await saveBase64Image(filePath, screenshot);
}

/**
 * Save a resized element screenshot
 * @TODO: implement the resizing
 *
 * @param {object}  element
 * @param {string}  filePath
 * @param {object}  resizeDimensions
 *
 * @return {Promise<void>}
 *
 * @private
 */
async function saveResizedElement(element, filePath, resizeDimensions = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}) {
    const selector = await element.selector;
    const elementLocation = await browser.getLocation(selector);
    const elementSize = await browser.getElementSize(selector);
    // Take the screenshot
    const base64Screenshot = await takeBase64Screenshot();
    // Get the device info like screensize, screenshotHeight, screenshotHeight
    const deviceInfo = await getDeviceInfo(base64Screenshot);

    // Save the cropped screenshot
    const croppedBase64Image = await makeCroppedBase64Image(
        base64Screenshot,
        {
            height: (elementSize.height * deviceInfo.dpr),
            width: (elementSize.width * deviceInfo.dpr),
            x: (elementLocation.x * deviceInfo.dpr),
            y: (elementLocation.y * deviceInfo.dpr),
        },
        deviceInfo,
        resizeDimensions,
    );

    await saveBase64Image(croppedBase64Image, filePath);
}
