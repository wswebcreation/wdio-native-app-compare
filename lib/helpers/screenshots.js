export default class Screenshotter {
    /**
     * Save a screenshot to a file
     *
     * @param {string} filePath
     *
     * @return {Promise<*>}
     */
    static async getBufferedScreenshot() {
        return new Buffer(await browser.saveScreenshot(), 'base64');
    }

    /**
     * Save a screenshot to a file
     *
     * @param {string} filePath
     *
     * @return {Promise<*>}
     */
    static async saveToFile(filePath) {
        return await browser.saveScreenshot(filePath);
    }

    /**
     * Take an element screenshot
     *
     * @param {string} selector
     *
     * @return {Promise<*>}
     *
     * @see  https://w3c.github.io/webdriver/#take-element-screenshot
     */
    static async element(selector) {
        const element = await browser.element(selector);

        return browser.requestHandler.create({
            path: `/session/:sessionId/element/${element.value.ELEMENT}/screenshot`,
            method: 'GET'
        });

    }
}
