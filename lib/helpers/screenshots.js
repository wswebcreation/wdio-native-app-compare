/**
 * Save a screenshot to a file
 *
 * @return {Promise<*>}
 */
export async function getBufferedScreenshot() {
    return new Buffer(await browser.saveScreenshot(), 'base64');
}

/**
 * Save a screenshot to a file
 *
 * @param {string} filePath
 *
 * @return {Promise<*>}
 */
export async function saveToFile(filePath) {
    return await browser.saveScreenshot(filePath);
}
