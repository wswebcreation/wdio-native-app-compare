import { instanceCompareOptions } from '../helpers/options'
import { checkBaselineImageExists } from '../methods/checkBaselineImageExists'
import { executeCompare } from '../methods/executeCompare'
import { determineValidBlockOuts } from '../methods/rectangles'

/**
 * Compare an element against a baseline
 *
 * @param {object}  element
 * @param {string}  tag
 * @param {object}  options
 * @param {boolean} options.blockOuts One or multiple block outs on a screen / element can be provided in an Array with objects
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 *
 * @return {Promise<{
 *      fileName: {string},
 *      folders: {object},
 *      misMatchPercentage: number,
 *      baselineCreated: boolean
 * }>}
 */
export default async function compareElement(element, tag, options = {}) {
    // Determine the element compare options
    const elementCompareOptions = {
        ...this.compareOptions,
        ...instanceCompareOptions(options),
    }

    // Save the element and return the data
    const elementScreenshotData = await driver.saveElement(
        element,
        tag,
        options
    )

    // Check if the baseline image exists
    const baselineImageExists = await checkBaselineImageExists(
        this.folders,
        elementScreenshotData.fileName,
        this.autoSaveBaseline
    )

    // Determine the ignore rectangles
    if (elementCompareOptions.blockOuts) {
        elementCompareOptions.output.ignoredBoxes = determineValidBlockOuts(
            elementCompareOptions.blockOuts
        )
    }

    // Execute the compare
    const compareResult = await executeCompare(
        this.folders,
        elementScreenshotData.fileName,
        elementCompareOptions
    )

    // Return compare results and if a baseline image was created
    return Object.assign(compareResult, {
        baselineImageCreated: !baselineImageExists,
    })
}
