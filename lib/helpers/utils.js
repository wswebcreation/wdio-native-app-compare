import { ensureDirSync } from 'fs-extra'
import { resolve } from 'path'
import {
    IPHONE_LARGE_SIZE,
    IPHONE_SMALL_SIZE,
    NO_DEVICE_NAME,
    IPHONE_MEDIUM_SIZE,
    IPHONE_EXTRA_LARGE_SIZE,
    NO_PLATFORM_NAME,
    NO_ORIENTATION,
    NO_PLATFORM_VERSION,
    NO_APPEARANCE,
} from './constants'

/**
 * Create the filename
 *
 * @param {object} capabilities
 * @param {string} formatString
 * @param {string} tag
 *
 * @return {string}
 */
function formatFileName(capabilities, formatString, tag) {
    const defaults = {
        deviceName:
            capabilities.deviceName ||
            capabilities['appium:deviceName'] ||
            NO_DEVICE_NAME,
        orientation:
            capabilities.orientation ||
            capabilities['appium:orientation'] ||
            NO_ORIENTATION,
        platformName:
            capabilities.platformName ||
            capabilities['appium:platformName'] ||
            NO_PLATFORM_NAME,
        platformVersion:
            capabilities.platformVersion ||
            capabilities['appium:platformVersion'] ||
            NO_PLATFORM_VERSION,
        appearance:
            capabilities.appearance ||
            capabilities['nacs:appearance'] ||
            NO_APPEARANCE,
        tag,
    }

    Object.keys(defaults).forEach((value) => {
        formatString = formatString.replace(`{${value}}`, defaults[value])
    })

    return formatString.replace(/ /g, '_').toLowerCase() + '.png'
}

/**
 * Get and create a folder
 *
 * @param {object}  capabilities
 * @param {string}  capabilities.deviceName
 * @param {string}  folder
 * @param {boolean} savePerDevice
 *
 * @return {string}
 */
function getAndCreatePath(capabilities, folder, savePerDevice) {
    const deviceName =
        capabilities.deviceName ||
        capabilities['appium:deviceName'] ||
        NO_DEVICE_NAME
    const deviceFolder = deviceName.replace(/ /g, '_').toLowerCase()
    const folderName = resolve(
        process.cwd(),
        folder,
        savePerDevice ? deviceFolder : ''
    )

    ensureDirSync(folderName)

    return folderName
}

/**
 * Determine the filename and file path
 *
 * @param {object}  capabilities
 * @param {string}  folder
 * @param {string}  formatString
 * @param {string}  tag
 *
 * @return {
 *  {
 *      fileName: string,
 *      filePath: string,
 *  }
 * }
 */
function determineFileData(capabilities, folder, formatString, tag) {
    const fileName = formatFileName(capabilities, formatString, tag)

    return {
        fileName,
        filePath: resolve(folder, fileName),
    }
}

/**
 * Return the values of an iOS object multiplied against the devicePixelRatio
 *
 * @param   {object} values
 * @param   {number} dpr
 *
 * @return  {object}
 */
function multiplyIosObjectValuesAgainstDPR(values, dpr) {
    if (driver.isIOS) {
        Object.keys(values).map((value) => {
            values[value] *= dpr
        })
    }

    return values
}

/**
 * Determine if this is a small iPhone phone
 *
 * @param {object} screenSize
 * @param {number} screenSize.height
 * @param {number} screenSize.width
 *
 * @return {boolean}
 */
function determineSmallIphone(screenSize) {
    return (
        (screenSize.width === IPHONE_SMALL_SIZE ||
            screenSize.height === IPHONE_SMALL_SIZE) &&
        driver.isIOS
    )
}

/**
 * Determine if this is a large iPhone phone
 *
 * @param {object} screenSize
 * @param {number} screenSize.height
 * @param {number} screenSize.width
 *
 * @return {boolean}
 */
function determineLargeIphone(screenSize) {
    return (
        (screenSize.width === IPHONE_LARGE_SIZE ||
            screenSize.height === IPHONE_LARGE_SIZE) &&
        driver.isIOS
    )
}

/**
 * Determine if this is a medium iphone phone
 *
 * @param {object} screenSize
 * @param {number} screenSize.height
 * @param {number} screenSize.width
 *
 * @return {boolean}
 */
function determineMediumIphone(screenSize) {
    return (
        (screenSize.width === IPHONE_MEDIUM_SIZE ||
            screenSize.height === IPHONE_MEDIUM_SIZE) &&
        driver.isIOS
    )
}

/**
 * Determine if this is a extra large iphone phone
 *
 * @param {object} screenSize
 * @param {number} screenSize.height
 * @param {number} screenSize.width
 *
 * @return {boolean}
 */
function determineExtraLargeIphone(screenSize) {
    return (
        (screenSize.width === IPHONE_EXTRA_LARGE_SIZE ||
            screenSize.height === IPHONE_EXTRA_LARGE_SIZE) &&
        driver.isIOS
    )
}

/**
 * Get the size of a screenshot in pixels
 *
 * @param {string} screenshot
 *
 * @return {
 *  {
 *      width: number,
 *      height: number,
 *  }
 * }
 */
function getScreenshotSize(screenshot) {
    return {
        height: Buffer.from(screenshot, 'base64').readUInt32BE(20),
        width: Buffer.from(screenshot, 'base64').readUInt32BE(16),
    }
}

export {
    formatFileName,
    getAndCreatePath,
    determineFileData,
    multiplyIosObjectValuesAgainstDPR,
    determineSmallIphone,
    determineLargeIphone,
    determineExtraLargeIphone,
    determineMediumIphone,
    getScreenshotSize,
}
