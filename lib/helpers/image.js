import {resolve} from 'path';
import { access, copySync, createWriteStream, readFileSync, writeFileSync } from 'fs-extra';

const PNGImage = require('png-image');

import { multiplyIosObjectValuesAgainstDPR } from './utils';

/**
 * Check if the given image already exists
 *
 * @param {object}  folders
 * @param {string}  fileName
 * @param {boolean} autoSaveBaseline
 *
 * @return {Promise<any>}
 */
export async function checkImageExists(folders, fileName, autoSaveBaseline) {
    return new Promise((resolvePromise, rejectPromise) => {
        access(resolve(folders.baseline, fileName), (error) => {
            if (error) {
                if (autoSaveBaseline) {
                    try {
                        copySync(
                            resolve(folders.actual, fileName),
                            resolve(folders.baseline, fileName),
                        );
                        console.log(`\nINFO: Autosaved the image to ${resolve(folders.baseline, fileName)}\n`);
                    } catch (err) {
                        rejectPromise(`Image could not be copied. The following error was thrown: ${err}`);
                    }
                } else {
                    rejectPromise('Image not found, saving current image as new baseline.');
                }
            }
            resolvePromise();
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
    const rect = multiplyIosObjectValuesAgainstDPR(rectangles, deviceInfo.dpr);
    return new PNGImage({
        imagePath: bufferedScreenshot,
        imageOutputPath: fileNamePath,
        cropImage: rect
    }).runWithPromise();
}

/**
 * Save the image
 *
 * @param {string}  filePath
 * @param {buffer}  image
 */
export function saveImage(filePath, image) {
    writeFileSync(filePath, image);
}
