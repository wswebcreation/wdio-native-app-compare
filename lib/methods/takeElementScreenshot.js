import { takeResizedElementScreenshot } from './takeResizedElementScreenshot'
import { nativeAppCompareLog } from '../helpers/logger'

/**
 * Take the element screenshot based on the elementIdScreenshot of webdriver.io
 *
 * @param {object}  element
 * @param {string}  filePath
 *
 * @return {Promise<void>}
 *
 * @private
 */
export async function takeElementScreenshot(element, filePath) {
    const id = await element.elementId

    try {
        return (await driver.takeElementScreenshot(id))
    } catch (e) {
        nativeAppCompareLog.warn(`
#####################################################################################
 AN ELEMENT SCREENSHOT COULD NOT BE TAKEN WITH THE NEW 'elementScreenshot()' METHOD,
 A FALLBACK HAS BEEN EXECUTED AND THE ELEMENT WILL BE SAVED.
 USE 'automationName: "UiAutomator2"' FOR ANDROID TO FULLY USE THE POWER OF APPIUM
#####################################################################################
`)
        return takeResizedElementScreenshot(element, filePath)
    }
}
