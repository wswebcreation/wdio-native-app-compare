import { executeCompare, instanceCompareOptions } from '../helpers/compare';
import { checkImageExists } from '../helpers/image';
import { determineIgnoreRectangles } from '../helpers/rectangles';
import { formatFileName } from '../helpers/utils';

/**
 * Compare a screen against a baseline
 *
 * @param {string}  tag
 * @param {object}  options
 * @param {object}  options
 * @param {boolean} options.blockOuts One or multiple block outs on a screen / element can be provided in an Array with objects
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 *
 * @example
 *  // Default
 *  browser.compareScreen('tag-name-of-image');
 *  // With compare options
 *  browser.compareScreen(
 *      'tag-name-of-image',
 *      {
 *          ignoreAlpha: true,
 *          ignoreAntialiasing: true,
 *          ignoreColors: false,
 *          // ...
 *      }
 *  );
 *
 * @return {Promise<number>}
 */
export default async function compareScreen(tag, options = {}) {
    const screenCompareOptions = {
        ...(this.compareOptions),
        ...(instanceCompareOptions(options)),
    };
    const fileName = formatFileName(this.formatString, tag);
    const bufferedScreenshot = await browser.saveScreen(tag);

    await checkImageExists(
        this.folders,
        this.savePerDevice,
        fileName,
        this.autoSaveBaseline,
    );

    screenCompareOptions.ignoreRectangles = await determineIgnoreRectangles(bufferedScreenshot, screenCompareOptions);

    return await executeCompare(
        this.folders,
        this.savePerDevice,
        fileName,
        screenCompareOptions,
    );
}
