import { STATUS_BAR_SELECTORS } from './constants';
import { getDeviceInfo } from './utils';

export default class Rectangles{
    /**
     * Determine the ignore rectangles
     *
     * @param {buffer}  bufferedScreenshot
     * @param {object}  options
     *
     * @return {Promise<Array>}
     */
    static async determineIgnoreRectangles(bufferedScreenshot, options) {
        const regtangles = [];
        const deviceInfo = await getDeviceInfo(bufferedScreenshot);

        if (options.blockOutStatusBar) {
            regtangles.push(await this.determineStatusBarRectangles(deviceInfo));
        }

        return regtangles;
    }

    /**
     * Determine the status bar height for iOS/Android
     *
     * @param {object} deviceInfo
     *
     * @return {Promise<{
     *      height: number,
     *      width: number,
     *      x: number,
     *      y: number
     * }>}
     */
    static async determineStatusBarRectangles(deviceInfo) {
        if (browser.wdioNac.hasOwnProperty('statusBarDimensions')) {
            return browser.wdioNac.statusBarDimensions;
        }

        const statusBarSize = await browser.getElementSize(STATUS_BAR_SELECTORS[browser.isIOS ? 'IOS' : 'ANDROID']);
        const statusBarDimensions = {
            // Status bar height of iOS is not actual height, need to be times dpr to get the correct height
            height: statusBarSize.height * (browser.isIOS ? deviceInfo.dpr : 1),
            width: statusBarSize.width * (browser.isIOS ? deviceInfo.dpr : 1),
            x: 0,
            y: 0
        };

        browser.wdioNac.statusBarDimensions = statusBarDimensions;

        return statusBarDimensions;
    }
}
