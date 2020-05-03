import {multiplyIosObjectValuesAgainstDPR} from '../helpers/utils'
import {getDeviceInfo} from './getDeviceInfo'
import {nativeAppCompareLog} from '../helpers/logger'

/**
 * Determine the ignore rectangles
 *
 * @param {string}  base64Image
 * @param {object}  options
 *
 * @return {Promise<Array>}
 */
export async function determineIgnoreRectangles(base64Image, options) {
    let rectangles = []
    let allowInvisibleElements
    const deviceInfo = await getDeviceInfo(base64Image)

    // With Android and UiAutomator2 some elements are not in the view by default
    // It can be seen when {settings: {allowInvisibleElements: true}} is set
    // See http://appium.io/docs/en/advanced-concepts/settings/
    if (driver.isAndroid && options.elementBlockOuts.length > 0) {
        allowInvisibleElements = (await driver.getSettings()).allowInvisibleElements
        await driver.updateSettings({allowInvisibleElements: true})
    }

    if (options.blockOutStatusBar) {
        rectangles.push(deviceInfo.rectangles.statusBar)
    }

    if (driver.isAndroid && options.blockOutNavigationBar) {
        rectangles.push(deviceInfo.rectangles.androidNavigationBar)
    }

    if (options.blockOuts.length > 0) {
        rectangles = rectangles.concat(determineValidBlockOuts(options.blockOuts))
    }

    if (options.elementBlockOuts.length > 0) {
        rectangles = rectangles.concat(await determineElementBlockOuts({
            components: options.elementBlockOuts,
            dpr: deviceInfo.dpr,
        }))
    }

    if (deviceInfo.isIphoneXSeries && options.blockOutIphoneXBottomBar) {
        rectangles = rectangles.concat(deviceInfo.rectangles.iOSHomeBar)
    }

    if (driver.isAndroid && options.elementBlockOuts.length > 0) {
        await driver.updateSettings({allowInvisibleElements})
    }

    return rectangles
}

/**
 * Determine if the block outs are valid
 *
 * @param {array}   blockOuts
 *
 * @return {[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]}
 */
export function determineValidBlockOuts(blockOuts) {
    const dimensions = []
    const validKeys = ['x', 'y', 'width', 'height']

    blockOuts.forEach(blockOut => {
        let validBlockOutObject = true
        Object.keys(blockOut).forEach(key => {
            if (!validKeys.includes(key)) {
                nativeAppCompareLog.error(`
###################################################
 Blockout:
 ${JSON.stringify(blockOut)}

 is not allowed. Key: ${key} is not allowed,
 only 'x', 'y', 'width', 'height' are allowed
###################################################
`)
                validBlockOutObject = false
            }
        })

        if (validBlockOutObject) {
            dimensions.push({
                bottom: blockOut.height,
                right: blockOut.width,
                left: blockOut.x,
                top: blockOut.y,
            })
        }
    })

    return dimensions
}

/**
 * Determine the element block out data
 *
 * @param {object} elementBlockOutsData
 * @param {array} elementBlockOutsData.components
 * @param {number} elementBlockOutsData.dpr
 *
 * @return {Promise<[{
 *      height: number,
 *      width: number,
 *      x: number,
 *      y: number
 * }]>}
 */
export async function determineElementBlockOuts({components, dpr}) {
    const dimensions = []

    for (let component of components) {
        const selector = await component.element.selector
        // By providing elementNumber a specific element from the element array will be used
        const hasNumber = Object.prototype.hasOwnProperty.call(component, 'elementNumber')

        try {
            const elements = hasNumber ? [(await ($$(selector)))[component.elementNumber]] : (await ($$(selector)))
            const margin = component.margin || 0

            for (let element of elements) {
                const rectangles = await getElementRectangles(element)
                dimensions.push(determineDimensions(rectangles, margin))
            }
        } catch (e) /* istanbul ignore next */ {
            nativeAppCompareLog.warn(`Something went wrong with finding / determining the rectangles of the element with selector: '${selector}'.`)
            nativeAppCompareLog.warn('This error has been catched and shown below, but the test did not brake based on this error')
            nativeAppCompareLog.warn('\n', e, '\n')

        }
    }


    return dimensions.map(dimension => multiplyIosObjectValuesAgainstDPR(dimension, dpr))
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
export function determineDimensions(rectangles, margin) {
    return {
        bottom: rectangles.height + (2 * margin),
        right: rectangles.width + (2 * margin),
        left: rectangles.x - margin,
        top: rectangles.y - margin,
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
export async function getElementRectangles(element) {
    return (await (driver.getElementRect(element.elementId)))
}
