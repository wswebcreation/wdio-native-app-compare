import { resolve } from 'path';
import { writeFileSync } from 'fs-extra';
import Screenshotter from '../helpers/screenshots';
import { formatFileName, getDeviceInfo } from '../helpers/utils';
import { saveCroppedScreenshot } from '../helpers/image';

/**
 * Save an element
 *
 * @TODO:
 * - [ ] Add more options and update docs
 * - [ ] Add more examples
 *
 * @param {string}  elementSelector
 * @param {string}  tag
 * @param {object}  options
 *
 * @example
 *  // Default
 *  browser.saveElement('~selector', 'tag-name-of-image');
 *
 * @return {Promise<void>}
 */
export default async function saveElement(elementSelector, tag, options = {}) {
    const fileName = resolve(this.folders.actualFolder, formatFileName(this.formatString, tag));

    if (options.resizeDimensions) {
        return _saveResizedElement(elementSelector, fileName);
    }

    await _saveElement(elementSelector, fileName);
}

/**
 * Save the element based on the elementIdScreenshot of webdriver.io
 *
 * @param {string}  elementSelector
 * @param {string}  fileName
 *
 * @return {Promise<void>}
 *
 * @private
 */
async function _saveElement(elementSelector, fileName){
    const id = (await browser.element(elementSelector)).value.ELEMENT;
    const screenshot = new Buffer((await browser.elementIdScreenshot(id)).value, 'base64');

    await writeFileSync(fileName, screenshot);
}

/**
 * Save a resized element screenshot
 * @TODO: implement the resizing
 *
 * @param {string}  elementSelector
 * @param {string}  fileName
 *
 * @return {Promise<void>}
 *
 * @private
 */
async function _saveResizedElement(elementSelector, fileName) {
    const elementLocation = await browser.getLocation(elementSelector);
    const elementSize = await browser.getElementSize(elementSelector);
    // Take the screenshot
    const bufferedScreenshot = await Screenshotter.getBufferedScreenshot();
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
