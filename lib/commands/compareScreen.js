import { instanceCompareOptions } from '../helpers/options'
import { checkBaselineImageExists } from '../methods/checkBaselineImageExists'
import { determineIgnoreRectangles } from '../methods/rectangles'
import { executeCompare } from '../methods/executeCompare'

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
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16,
 *   minBrightness=16,maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0,
 *   minBrightness=0,maxBrightness=255
 * @param {object}  options.output
 * @param {number}  options.largeImageThreshold Enable skipping pixels during the comparison to mitigate performance issues based on
 *   amount of pixels (width / height), default 0
 * @param {object}  options.errorColor
 * @param {number}  options.red
 * @param {number}  options.green
 * @param {number}  options.blue
 *
 * @example
 *  // Default
 *  driver.compareScreen('tag-name-of-image');
 *  // With compare options
 *  driver.compareScreen(
 *      'tag-name-of-image',
 *      {
 *          ignoreAlpha: true,
 *          ignoreAntialiasing: true,
 *          ignoreColors: false,
 *          // ...
 *      }
 *  );
 *
 * @return {Promise<{
 *      fileName: {string},
 *      folders: {object},
 *      misMatchPercentage: number
 * }>}
 */
export default async function compareScreen(tag, options = {}) {
    // Determine the screen compare options
    const screenCompareOptions = {
        ...(this.compareOptions),
        ...(instanceCompareOptions(options)),
    }

    // Save the screen and return the data
    const screenshotData = await driver.saveScreen(tag, true)

    // Check if the baseline image exists
    await checkBaselineImageExists(
        this.folders,
        screenshotData.fileName,
        this.autoSaveBaseline,
    )

    // Determine the ignore rectangles
    const ignoredBoxes = await determineIgnoreRectangles(screenshotData.base64Screenshot, screenCompareOptions)
    if (ignoredBoxes.length > 0) {
        screenCompareOptions.output.ignoredBoxes = ignoredBoxes
    }

    // Execute the compare and return the compare data
    return await executeCompare(
        this.folders,
        screenshotData.fileName,
        screenCompareOptions,
    )
}
