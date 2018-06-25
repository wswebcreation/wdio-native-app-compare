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
 * @param   {string}  elementSelector
 * @param   {buffer}  bufferedScreenshot
 *
 * @return  {Promise<{
 *      dpr: number,screensize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number
 * }>}
 */
export async function getDeviceInfo(elementSelector, bufferedScreenshot) {
    const screenshotWidth = bufferedScreenshot.readUInt32BE(16);
    const screensize = (await browser.windowHandleSize()).value;

    return {
        dpr: screenshotWidth / screensize.width,
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
