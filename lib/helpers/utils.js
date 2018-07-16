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

    browser.wdioNac.deviceInfo =  deviceInfo;

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
