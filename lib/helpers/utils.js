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

/**
 * Determine the default compare options
 *
 * @param {object}  options
 * @param {string}  options.baselineFolder Path to the baseline folder
 * @param {string}  options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
 * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
 *
 * @return {{
 *      ignore: array
 *      ignoreAlpha: boolean,
 *      ignoreAntialiasing: boolean,
 *      ignoreColors: boolean,
 *      ignoreLess: boolean,
 *      ignoreNothing: boolean,
 *      ignoreTransparentPixel: boolean,
 *      rawMisMatchPercentage: boolean
 *      saveAboveTolerance: number
 *  }}
 */
export function defaultCompareOptions(options) {
    return {
        ignore: [],
        ignoreAlpha: options.ignoreAlpha || false,
        ignoreAntialiasing: options.ignoreAntialiasing || false,
        ignoreColors: options.ignoreColors || false,
        ignoreLess: options.ignoreLess || false,
        ignoreNothing: options.ignoreNothing || false,
        ignoreTransparentPixel: options.ignoreTransparentPixel || false,
        rawMisMatchPercentage: options.rawMisMatchPercentage || false,
        saveAboveTolerance: options.saveAboveTolerance || 0,
    }
}

/**
 * Determine the instance compare options
 *
 * @param {object}  options
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 *
 * @return {{}}
 */
export function instanceCompareOptions(options) {
    return {
        ...(options.ignoreAlpha ? { ignoreAlpha: options.ignoreAlpha } : {}),
        ...(options.ignoreAntialiasing ? { ignoreAntialiasing: options.ignoreAntialiasing } : {}),
        ...(options.ignoreColors ? { ignoreColors: options.ignoreColors } : {}),
        ...(options.ignoreLess ? { ignoreLess: options.ignoreLess } : {}),
        ...(options.ignoreNothing ? { ignoreNothing: options.ignoreNothing } : {}),
        ...(options.ignoreTransparentPixel ? { ignoreTransparentPixel: options.ignoreTransparentPixel } : {}),
    }
}
