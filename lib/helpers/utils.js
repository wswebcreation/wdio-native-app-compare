import { STATUS_BAR_HEIGHTS } from './constants';

/**
 * Create the filename
 *
 * @param {string} formatString
 * @param {string} tag
 *
 * @return {string}
 */
export function formatFileName(formatString, tag) {
    return `${formatString.replace('{tag}', tag)}.png`;
}

/**
 * Get the device info
 *
 * @param   {buffer}  bufferedScreenshot
 *
 * @return  {Promise<{
 *      dpr: number,
 *      isIphoneX: boolean,
 *      screensize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number
 * }>}
 */
export async function getDeviceInfo(bufferedScreenshot) {
    const screenshotWidth = bufferedScreenshot.readUInt32BE(16);
    const screensize = (await browser.windowHandleSize()).value;
    const isIphoneX = browser.isIOS && (screensize.width === 812 || screensize.height === 812);

    return {
        dpr: screenshotWidth / screensize.width,
        isIphoneX,
        screensize,
        screenshotHeight: bufferedScreenshot.readUInt32BE(20),
        screenshotWidth,
    }
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

/**
 * Determine the ignore rectangles
 *
 * @param {buffer}  bufferedScreenshot
 * @param {object}  options
 *
 * @return {Promise<Array>}
 */
export async function determineIgnoreRectangles(bufferedScreenshot, options) {
    const regtangles = [];
    //@TODO: save this to the browser object for later?
    const deviceInfo = await getDeviceInfo(bufferedScreenshot);

    if (options.blockOutStatusBar) {
        const statusBarHeight = determineStatusBarHeight(deviceInfo);
        regtangles.push({
            height: statusBarHeight * deviceInfo.dpr,
            width: deviceInfo.screenshotWidth,
            x: 0,
            y: 0
        });
    }

    return regtangles;
}

/**
 * Determine the status bar height for iOS/Android
 *
 * @param {object}  deviceInfo
 *
 * @return {number}
 */
export function determineStatusBarHeight(deviceInfo) {
    if (browser.isIOS) {
        return STATUS_BAR_HEIGHTS.IOS[deviceInfo.isIphoneX ? 'X' : 'DEFAULT'];
    }

    return STATUS_BAR_HEIGHTS.ANDROID;
}
