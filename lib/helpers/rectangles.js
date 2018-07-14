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
        //@TODO: save this to the browser object for later?
        const deviceInfo = await getDeviceInfo(bufferedScreenshot);

        if (options.blockOutStatusBar) {
            regtangles.push(await this.determineStatusBarRectangles(deviceInfo));
        }

        return regtangles;
    }

    /**
     * Determine the status bar height for iOS/Android
     *
     * @param {object}  deviceInfo
     *
     * @return {number}
     */
    static async determineStatusBarRectangles(deviceInfo) {
        //@TODO: save this to the browser object for later?
        const statusBarHeight = await browser.getElementSize(STATUS_BAR_SELECTORS[browser.isIOS ? 'IOS' : 'ANDROID'], 'height');

        return {
            // Status bar height of iOS is not actual height, need to be times dpr to get the correct height
            height: statusBarHeight * (browser.isIOS ? deviceInfo.dpr : 1),
            width: deviceInfo.screenshotWidth,
            x: 0,
            y: 0
        }
    }
}
