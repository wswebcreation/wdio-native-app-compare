/**
 * Take a screenshot
 *
 * @return {Promise<string>}
 */
export async function takeBase64Screenshot() {
    return await Buffer.from(await browser.saveScreenshot()).toString('base64');
}
