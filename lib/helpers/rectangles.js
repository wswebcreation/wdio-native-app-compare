import { STATUS_BAR_SELECTORS } from './constants';
import { getDeviceInfo, multiplyIosObjectValuesAgainstDPR } from './utils';

/**
 * Determine the ignore rectangles
 *
 * @param {buffer}  bufferedScreenshot
 * @param {object}  options
 *
 * @return {Promise<Array>}
 */
export async function determineIgnoreRectangles(bufferedScreenshot, options) {
    let rectangles = [];
    const deviceInfo = await getDeviceInfo(bufferedScreenshot);

    if (options.blockOutStatusBar) {
        rectangles.push(await determineStatusBarRectangles(deviceInfo.dpr));
    }

    if (options.blockOuts.length > 0) {
        rectangles = rectangles.concat(determineBlockOuts(options.blockOuts, deviceInfo.dpr));
    }

    if (options.elementBlockOuts.length > 0) {
        rectangles = rectangles.concat(await determineElementBlockOuts(options.elementBlockOuts, deviceInfo.dpr));
    }

    return rectangles;
}

/**
 * Determine the status bar height for iOS/Android
 *
 * @param {number} dpr The device pixel ratio
 *
 * @return {Promise<{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }>}
 */
async function determineStatusBarRectangles(dpr) {
    let allowInvisibleElements;

    if (browser.wdioNac.hasOwnProperty('statusBarDimensions')) {
        return browser.wdioNac.statusBarDimensions;
    }

    // With Android and UiAutomator2 the status bar is not in the view by default
    // It can be seen when {settings: {allowInvisibleElements: true}} is set
    // See http://appium.io/docs/en/advanced-concepts/settings/
    if (browser.isAndroid) {
        allowInvisibleElements = (await browser.settings()).value.allowInvisibleElements;
        await browser.settings({ allowInvisibleElements: true });
    }

    const statusBarSize = await browser.getElementSize(STATUS_BAR_SELECTORS[browser.isIOS ? 'IOS' : 'ANDROID']);
    if (browser.isAndroid) {
        await browser.settings({ allowInvisibleElements });
    }
    const statusBarDimensions = multiplyIosObjectValuesAgainstDPR({
        height: statusBarSize.height,
        width: statusBarSize.width,
        x: 0,
        y: 0
    }, dpr);

    browser.wdioNac.statusBarDimensions = statusBarDimensions;

    return statusBarDimensions;
}

/**
 * Determine the block outs data
 *
 * @param {array}   blockOuts
 * @param {number}  dpr The device pixel ratio
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
function determineBlockOuts(blockOuts, dpr) {
    const dimensions = [];
    const validKeys = ['x', 'y', 'width', 'height'];

    blockOuts.forEach(blockOut => {
        let validBlockOutObject = true;
        Object.keys(blockOut).forEach(key => {
            if (!validKeys.includes(key)) {
                console.log(`
###################################################
 Blockout:
 ${JSON.stringify(blockOut)}

 is not allowed. Key: ${key} is not allowed, 
 only 'x', 'y', 'width', 'height' are allowed
###################################################
`);
                validBlockOutObject = false;
            }
        });

        if (validBlockOutObject) {
            dimensions.push(blockOut);
        }
    });

    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, dpr));
}

/**
 * Determine the element block out data
 *
 * @param {array}   elements
 * @param {number}  dpr The device pixel ratio
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
async function determineElementBlockOuts(elements, dpr) {
    const dimensions = [];

    for (let element of elements) {
        const selector = await element.selector;
        const index = await element.index;
        const size = await browser.getElementSize(selector);
        const coordinates = await browser.getLocation(selector);

        dimensions.push({
            height: Array.isArray(size) ? size[index].height : size.height,
            width: Array.isArray(size) ? size[index].width : size.width,
            x: Array.isArray(coordinates) ? coordinates[index].x : coordinates.x,
            y: Array.isArray(coordinates) ? coordinates[index].y : coordinates.y,
        });
    }

    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, dpr));
}
