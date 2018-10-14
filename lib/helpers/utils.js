import { ensureDirSync } from 'fs-extra';
import { resolve } from 'path';
import { NO_DEVICE_NAME } from './constants';

let DEVICE_INFO = null;

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
 * Get the device info and store it to a global if needed
 *
 * @param   {string}  screenshot
 *
 * @return  {Promise<{
 *      dpr: number,
 *      screensize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number,
 *      isIphoneX: boolean,
 * }>}
 */
export async function getDeviceInfo(screenshot) {
    if (DEVICE_INFO) {
        return DEVICE_INFO;
    }

    const screenshotWidth = new Buffer(screenshot, 'base64').readUInt32BE(16);
    const screensize = (await browser.windowHandleSize()).value;
    DEVICE_INFO = {
        dpr: screenshotWidth / screensize.width,
        screensize,
        screenshotHeight: new Buffer(screenshot, 'base64').readUInt32BE(20),
        screenshotWidth,
        isIphoneX: (screensize.width === 812 || screensize.height === 812) && browser.isIOS,
    };

    return DEVICE_INFO;
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
