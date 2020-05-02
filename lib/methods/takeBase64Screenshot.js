/**
 * Take a base64 screenshot
 *
 * @return {Promise<string>}
 */
export async function takeBase64Screenshot() {
    return await driver.takeScreenshot()
}
