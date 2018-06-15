import { join } from 'path';
import { access, copySync, readFileSync, writeFileSync } from 'fs-extra';
const PNGImage = require('png-image');

import {compareImages} from '../resemble/compareImages';
import { multiplyObjectValuesAgainstDPR } from './utils';

/**
 * Check if the given image already exists
 * @param {object}  folders
 * @param {string}  fileName
 * @return {Promise<any>}
 */
export async function checkImageExists(folders, fileName) {
    return new Promise((resolve, reject) => {
        access(join(process.cwd(), folders.baselineFolder, fileName), (error) => {
            if (error) {
                try {
                    copySync(join(folders.actualFolder, fileName), join(process.cwd(), folders.baselineFolder, fileName));
                    console.log(`\nINFO: Autosaved the image to ${join(process.cwd(), folders.baselineFolder, fileName)}\n`);
                } catch (err) {
                    reject(`Image could not be copied. The following error was thrown: ${err}`);
                }
                reject('Image not found, saving current image as new baseline.');
            }
            resolve();
        });
    });
}

/**
 * Compare 2 images with each other
 *
 * @param {object}  folders
 * @param {string}  fileName
 * @param {object}  compareOptions
 *
 * @return {Promise<number>}
 */
export async function compare(folders, fileName, compareOptions) {
    const options = {
        ignore: [],
    };
    const data = await compareImages(
        readFileSync(join(process.cwd(), folders.baselineFolder, fileName)),
        readFileSync(join(process.cwd(), folders.actualFolder, fileName)),
        options
    );
    const misMatchPercentage = Number(data.rawMisMatchPercentage.toFixed(2));

    if (misMatchPercentage > 0) {
        writeFileSync(join(process.cwd(), folders.diffFolder, fileName), data.getBuffer());
    }

    return misMatchPercentage;
}

/**
 * Save a cropped screen
 *
 * @param {buffer}  bufferedScreenshot
 * @param {string}  fileNamePath
 * @param {object}  rectangles
 * @param {object}  deviceInfo
 *
 * @return {Promise}
 */
export async function saveCroppedScreenshot(bufferedScreenshot, fileNamePath, rectangles, deviceInfo) {
    const rect = multiplyObjectValuesAgainstDPR(rectangles, deviceInfo.dpr);
    return new PNGImage({
        imagePath: bufferedScreenshot,
        imageOutputPath: fileNamePath,
        cropImage: rectangles
    }).runWithPromise();
}
