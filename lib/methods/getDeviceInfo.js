let DEVICE_INFO = null;

/**
 * Get the device info and store it to a global if needed
 *
 * @param   {string}  screenshot
 *
 * @return  {Promise<{
 *      dpr: number,
 *      screenSize: {
 *          height: number,
 *          width: number,
 *      },
 *      screenshotHeight: number,
 *      screenshotWidth: number,
 *      isIphoneX: boolean,
 * }>}
 */
export async function getDeviceInfo(screenshot) {
    if (DEVICE_INFO) {
        return DEVICE_INFO;
    }

    const screenshotWidth = new Buffer(screenshot, 'base64').readUInt32BE(16);
    const screenSize = (await browser.windowHandleSize()).value;
    DEVICE_INFO = {
        dpr: screenshotWidth / screenSize.width,
        screenSize,
        screenshotHeight: new Buffer(screenshot, 'base64').readUInt32BE(20),
        screenshotWidth,
        isIphoneX: (screenSize.width === 812 || screenSize.height === 812) && browser.isIOS,
    };

    return DEVICE_INFO;
}
