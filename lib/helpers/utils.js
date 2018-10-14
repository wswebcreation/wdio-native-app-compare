import { ensureDirSync } from 'fs-extra';
import { resolve } from 'path';
import { NO_DEVICE_NAME } from './constants';

/**
 * Create the filename
 *
 * @param {string} formatString
 * @param {string} tag
 *
 * @return {string}
 */
export function formatFileName(formatString, tag) {
    const capabilities = browser.desiredCapabilities;
    const defaults = {
        deviceName: capabilities.deviceName || NO_DEVICE_NAME,
        orientation: capabilities.orientation || 'no-orientation-in-caps',
        platformName: capabilities.platformName || 'no-platform-name-in-caps',
        platformVersion: capabilities.platformVersion || 'no-platform-version-in-caps',
        tag,
    };

    Object.keys(defaults).forEach((value) => {
        formatString = formatString.replace(`{${value}}`, defaults[value]);
    });

    return formatString.replace(/ /g, '_').toLowerCase() + '.png';
}

/**
 * Determine the folder
 *
 * @param {string}  folder
 * @param {boolean} savePerDevice
 *
 * @return {string}
 */
export function determineFolder(folder, savePerDevice) {
    const deviceFolder = browser.desiredCapabilities.deviceName
        ? browser.desiredCapabilities.deviceName.replace(/ /g, '_').toLowerCase()
        : NO_DEVICE_NAME;
    const folderName = resolve(process.cwd(), folder, savePerDevice ? deviceFolder : '');

    ensureDirSync(folderName);

    return folderName;
}

/**
 * Determine the filename and file path
 *
 * @param {string}  folder
 * @param {string}  formatString
 * @param {string}  tag
 *
 * @return {
 *  {
 *      fileName: string,
 *      filePath: string,
 *  }
 * }
 */
export function determineFileData(folder, formatString, tag){
    const fileName = formatFileName(formatString, tag);

    return {
        fileName,
        filePath: resolve(folder, fileName),
    };
}

/**
 * Return the values of an iOS object multiplied against the devicePixelRatio
 *
 * @param   {object} values
 * @param   {number} dpr
 *
 * @return  {object}
 */
export function multiplyIosObjectValuesAgainstDPR(values, dpr) {
    if (browser.isIOS) {
        Object.keys(values).map(value => {
            values[value] *= dpr;
        });
    }

    return values;
}
