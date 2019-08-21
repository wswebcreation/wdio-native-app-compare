import { readFileSync } from 'fs-extra'
import { resolve } from 'path'
import { compareImages } from '../resemble/compareImages'
import { saveBase64Image } from './saveBase64Image'
import { addBlockOuts } from './addBlockOuts'

/**
 * Compare 2 images with each other
 *
 * @param {object}  folders
 * @param {string}  fileName
 * @param {object}  options
 *
 * @return {Promise<{
 *      fileName: {string},
 *      folders: {object},
 *      misMatchPercentage: number
 * }>}
 */
export async function executeCompare(folders, fileName, options) {
    if (options.ignoreAlpha) {
        options.ignore.push('alpha')
    }
    if (options.ignoreAntialiasing) {
        options.ignore.push('antialiasing')
    }
    if (options.ignoreColors) {
        options.ignore.push('colors')
    }
    if (options.ignoreLess) {
        options.ignore.push('less')
    }
    if (options.ignoreNothing) {
        options.ignore.push('nothing')
    }

    // Create the ignored boxes variable
    const ignoredBoxes = options.output && options.output.ignoredBoxes ? [ ...options.output.ignoredBoxes ] : []
    // Now adjust the ignored boxes array for the ResembleJS API (which is a total mess :( )
    if (ignoredBoxes.length > 0) {
        options.output.ignoredBoxes = options.output.ignoredBoxes.map(ignoredBox => {
            return {
                bottom: ignoredBox.top + ignoredBox.bottom,
                right: ignoredBox.left + ignoredBox.right,
                left: ignoredBox.left,
                top: ignoredBox.top,
            }
        })
    }

    // Execute the compare and retrieve the data
    const data = await compareImages(
        readFileSync(resolve(folders.actual, fileName)),
        readFileSync(resolve(folders.baseline, fileName)),
        options
    )
    const misMatchPercentage = options.rawMisMatchPercentage
        ? data.rawMisMatchPercentage
        : Number(data.rawMisMatchPercentage.toFixed(2))

    // Save the diff when there is a diff or when debug mode is on
    if (misMatchPercentage > options.saveAboveTolerance || options.debug) {
        // Save the diff with the blockouts
        await saveBase64Image(
            resolve(folders.diff, fileName),
            await addBlockOuts(Buffer.from(data.getBuffer()).toString('base64'), ignoredBoxes)
        )
    }

    // Return the comparison data
    return {
        fileName,
        folders,
        misMatchPercentage,
    }
}
