import { join } from 'path';
import { access, copySync, readFileSync, writeFileSync } from 'fs-extra';

const PNGImage = require('png-image');

import { compareImages } from '../resemble/compareImages';
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
 * Save a (cropped) screen
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
        cropImage: rect
    }).runWithPromise();
}
