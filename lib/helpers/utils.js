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
 * Determine the file path
 *
 * @param {string}  folder
 * @param {boolean} savePerDevice
 * @param {string}  fileName
 *
 * @return {string}
 */
export function determineFilePath (folder, savePerDevice, fileName){
    const deviceFolder = browser.desiredCapabilities.deviceName
        ? browser.desiredCapabilities.deviceName.replace(/ /g, '_').toLowerCase()
        : NO_DEVICE_NAME ;
    const folderName = resolve(process.cwd(), folder, savePerDevice ? deviceFolder : '');

    ensureDirSync(folderName);

    return resolve(folderName, fileName);
}

/**
 * Get the device info and store it to a global if needed
 *
 * @param   {buffer}  bufferedScreenshot
 *
 * @return  {Promise<{
 *      dpr: number,
 *      screensize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number
 * }>}
 */
export async function getDeviceInfo(bufferedScreenshot) {
    if (browser.wdioNac.hasOwnProperty('deviceInfo')) {
        return browser.wdioNac.deviceInfo;
    }

    const screenshotWidth = bufferedScreenshot.readUInt32BE(16);
    const screensize = (await browser.windowHandleSize()).value;
    const deviceInfo = {
        dpr: screenshotWidth / screensize.width,
        screensize,
        screenshotHeight: bufferedScreenshot.readUInt32BE(20),
        screenshotWidth,
    };

    browser.wdioNac.deviceInfo = deviceInfo;

    return deviceInfo;
}

/**
 * Return the values of an object multiplied against the devicePixelRatio
 *
 * @param   {object} values
 * @param   {number} dpr
 *
 * @return  {object}
 */
export function multiplyObjectValuesAgainstDPR(values, dpr) {
    Object.keys(values).map(value => {
        values[value] *= dpr;
    });

    return values;
}
