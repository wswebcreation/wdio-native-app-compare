import { access, copySync, createWriteStream, readFileSync, writeFileSync } from 'fs-extra';

const PNGImage = require('png-image');

import { determineFilePath, multiplyIosObjectValuesAgainstDPR } from './utils';

/**
 * Check if the given image already exists
 *
 * @param {object}  folders
 * @param {boolean} savePerDevice
 * @param {string}  fileName
 * @param {boolean} autoSaveBaseline
 *
 * @return {Promise<any>}
 */
export async function checkImageExists(folders, savePerDevice, fileName, autoSaveBaseline) {
    return new Promise((resolve, reject) => {
        access(determineFilePath(folders.baselineFolder, savePerDevice, fileName), (error) => {
            if (error) {
                if (autoSaveBaseline) {
                    try {
                        copySync(
                            determineFilePath(folders.actualFolder, savePerDevice, fileName),
                            determineFilePath(folders.baselineFolder, savePerDevice, fileName),
                        );
                        console.log(`\nINFO: Autosaved the image to ${determineFilePath(folders.baselineFolder, savePerDevice, fileName)}\n`);
                    } catch (err) {
                        reject(`Image could not be copied. The following error was thrown: ${err}`);
                    }
                } else {
                    reject('Image not found, saving current image as new baseline.');
                }
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
