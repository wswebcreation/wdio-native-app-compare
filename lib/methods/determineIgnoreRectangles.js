import { IPHONE_X_BOTTOM_BAR, NAVIGATION_BAR_SELECTORS, STATUS_BAR_SELECTORS } from '../helpers/constants';
import { multiplyIosObjectValuesAgainstDPR } from '../helpers/utils';
import { red, yellow } from 'chalk';
import { getDeviceInfo } from './getDeviceInfo';

let NAVIGATION_BAR_DIMENSIONS = null;
let STATUS_BAR_DIMENSIONS = null;

/**
 * Determine the ignore rectangles
 *
 * @param {string}  base64Image
 * @param {object}  options
 *
 * @return {Promise<Array>}
 */
export async function determineIgnoreRectangles(base64Image, options) {
    let rectangles = [];
    let allowInvisibleElements;
    const deviceInfo = await getDeviceInfo(base64Image);

    // With Android and UiAutomator2 the status bar is not in the view by default
    // It can be seen when {settings: {allowInvisibleElements: true}} is set
    // See http://appium.io/docs/en/advanced-concepts/settings/
    if (browser.isAndroid && (options.blockOutStatusBar || options.blockOutNavigationBar || options.elementBlockOuts.length > 0)) {
        allowInvisibleElements = (await browser.settings()).value.allowInvisibleElements;
        await browser.settings({ allowInvisibleElements: true });
    }

    if (options.blockOutStatusBar) {
        rectangles.push(await determineStatusBarRectangles(deviceInfo.dpr, deviceInfo.screenshotWidth));
    }

    if (browser.isAndroid && options.blockOutNavigationBar) {
        rectangles.push(await determineNavigationBarRectangles(deviceInfo.dpr, deviceInfo.screenshotWidth));
    }

    if (options.blockOuts.length > 0) {
        rectangles = rectangles.concat(determineBlockOuts(options.blockOuts));
    }

    if (options.elementBlockOuts.length > 0) {
        rectangles = rectangles.concat(await determineElementBlockOuts(options.elementBlockOuts, deviceInfo));
    }

    if (deviceInfo.isIphoneX && options.blockOutIphoneXBottomBar) {
        rectangles = rectangles.concat(IPHONE_X_BOTTOM_BAR);
    }

    if (browser.isAndroid && (options.blockOutStatusBar || options.blockOutNavigationBar || options.elementBlockOuts.length > 0)) {
        await browser.settings({ allowInvisibleElements });
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
async function determineStatusBarRectangles(dpr, width) {
    if (STATUS_BAR_DIMENSIONS) {
        return STATUS_BAR_DIMENSIONS;
    }

    let rectangles;

    try {
        const element = await (browser.element(STATUS_BAR_SELECTORS[browser.isIOS ? 'IOS' : 'ANDROID']));
        rectangles = await getElementRectangles(element);
    } catch (e) {
        console.log(yellow('\nWARNING:'));
        console.log(yellow('The statusbar could not be determined and has been set to the defaults!\n'));
        rectangles = { height: 26, width, x: 0, y: 0 };
    }

    STATUS_BAR_DIMENSIONS = multiplyIosObjectValuesAgainstDPR({
        height: rectangles.height,
        width: rectangles.width,
        x: 0,
        y: 0
    }, dpr);

    return STATUS_BAR_DIMENSIONS;
}

/**
 * Determine the navigation bar height for iOS/Android
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
async function determineNavigationBarRectangles(dpr, width) {
    if (NAVIGATION_BAR_DIMENSIONS) {
        return NAVIGATION_BAR_DIMENSIONS;
    }

    let rectangles;

    try {
        const element = await (browser.element(NAVIGATION_BAR_SELECTORS.ANDROID));
        rectangles = await getElementRectangles(element);
    } catch (e) {
        console.log(yellow('\nWARNING:'));
        console.log(yellow('The navigation bar could not be determined and has been set to the defaults!\n'));
        rectangles = { height: 0, width: 0, x: 0, y: 0 };
    }

    NAVIGATION_BAR_DIMENSIONS = multiplyIosObjectValuesAgainstDPR({
        height: rectangles.height,
        width: width,
        x: rectangles.x,
        y: rectangles.y
    }, dpr);

    return NAVIGATION_BAR_DIMENSIONS;
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
                console.log(red(`
###################################################
 Blockout:
 ${JSON.stringify(blockOut)}

 is not allowed. Key: ${key} is not allowed, 
 only 'x', 'y', 'width', 'height' are allowed
###################################################
`));
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
        // By providing elementNumber a specific element from the element array will be used
        const hasNumber = component.hasOwnProperty('elementNumber');

        try {
            const elements = hasNumber ? [(await(browser.elements(selector))).value[component.elementNumber]] : (await(browser.elements(selector))).value;
            const margin = component.margin || 0;
            for (let element of elements) {
                const rectangles = await getElementRectangles(element);
                dimensions.push(determineDimensions(rectangles, margin));
            }
        } catch (e) {
            console.log(yellow('\nWARNING:'));
            console.log(yellow(`Something went wrong with finding / determining the rectangles of the element with selector: '${selector}'.`));
            console.log(yellow('This error has been catched and shown below, but the test did not broke based on this error'));
            console.log(yellow('\n', e, '\n'));

        }
    }

    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, deviceInfo.dpr));
}

/**
 * Determine the dimensions
 *
 * @param {object} rectangles   An object with height, width,x and y
 * @param {number} margin       The margin that needs to be used
 *
 * @return {{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }}
 */
function determineDimensions(rectangles, margin) {
    return {
        height: rectangles.height + (2 * margin),
        width: rectangles.width + (2 * margin),
        x: rectangles.x - margin,
        y: rectangles.y - margin,
    }
}

/**
 * Get the rectangles of an element
 *
 * @param {object}  element
 * @return {Promise<{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }>}
 */
async function getElementRectangles(element) {
    return (await (browser.elementIdRect(element.value.ELEMENT))).value;
}
