import { STATUS_BAR_SELECTORS } from './constants';
import { getDeviceInfo, multiplyIosObjectValuesAgainstDPR } from './utils';

let STATUS_BAR_DIMENSIONS = null;

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
        rectangles = rectangles.concat(determineBlockOuts(options.blockOuts));
    }

    if (options.elementBlockOuts.length > 0) {
        rectangles = rectangles.concat(await determineElementBlockOuts(options.elementBlockOuts, deviceInfo));
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

    if (STATUS_BAR_DIMENSIONS) {
        return STATUS_BAR_DIMENSIONS;
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
    STATUS_BAR_DIMENSIONS = multiplyIosObjectValuesAgainstDPR({
        height: statusBarSize.height,
        width: statusBarSize.width,
        x: 0,
        y: 0
    }, dpr);

    return STATUS_BAR_DIMENSIONS;
}

/**
 * Determine the block outs data
 *
 * @param {array}   blockOuts
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
function determineBlockOuts(blockOuts) {
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

    return dimensions;
}

/**
 * Determine the element block out data
 *
 * @param {array}   components
 * @param {object}  deviceInfo the device info object
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
async function determineElementBlockOuts(components, deviceInfo) {
    const dimensions = [];

    for (let component of components) {
        const selector = await component.element.selector;
        const index = await component.element.index;
        const size = await browser.getElementSize(selector);
        const coordinates = await browser.getLocation(selector);
        let margin = component.margin || 0;
        // At the end all data will be multiplied against the iOS dpr, so here first divide it for iOSs
        margin = browser.isIOS ? margin/deviceInfo.dpr : margin;

        dimensions.push({
            height: (Array.isArray(size) ? size[index].height : size.height) + (2 * margin),
            width: (Array.isArray(size) ? size[index].width : size.width) + (2 * margin),
            x: (Array.isArray(coordinates) ? coordinates[index].x : coordinates.x) - margin,
            y: (Array.isArray(coordinates) ? coordinates[index].y : coordinates.y) - margin,
        });
    }

    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, deviceInfo.dpr));
}
