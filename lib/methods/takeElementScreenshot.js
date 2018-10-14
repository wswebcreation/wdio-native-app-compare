import { yellow } from 'chalk';
import { takeResizedElementScreenshot } from './takeResizedElementScreenshot';


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
    const id = await element.value.ELEMENT;

    try {
        return (await browser.elementIdScreenshot(id)).value;
    } catch (e) {
        console.log(yellow(`
#####################################################################################
 AN ELEMENT SCREENSHOT COULD NOT BE TAKEN WITH THE NEW 'elementScreenshot()' METHOD, 
 A FALLBACK HAS BEEN EXECUTED AND THE ELEMENT WILL BE SAVED.
 USE 'automationName: "UiAutomator2"' FOR ANDROID TO FULLY USE THE POWER OF APPIUM
#####################################################################################
`));
        return takeResizedElementScreenshot(element, filePath);
    }
}
