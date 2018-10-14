import { readFileSync } from 'fs-extra';
import { join, resolve } from 'path';
import { compareImages } from '../resemble/compareImages';
import saveBase64Image from './saveBase64Image';

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

    // Execute the compare and retrieve the data
    const data = await compareImages(
        readFileSync(resolve(folders.baseline, fileName)),
        readFileSync(resolve(folders.actual, fileName)),
        options
    );
    const misMatchPercentage = options.rawMisMatchPercentage
        ? data.rawMisMatchPercentage
        : Number(data.rawMisMatchPercentage.toFixed(2));

    // Save the diff when there is a diff or when debug mode is on
    if (misMatchPercentage > options.saveAboveTolerance || options.debug) {
        await saveBase64Image(resolve(folders.diff, fileName), Buffer.from(data.getBuffer()).toString('base64'));
    }

    // Return the comparison data
    return {
        fileName,
        folders,
        misMatchPercentage,
    };
}
