import {IMAGE_STRING} from '../mocks/mocks'
import * as Utils from '../../lib/helpers/utils'

describe('getDeviceInfo', () => {
    let determineIphoneXSeriesSpy, determineLargeIphoneXSeriesSpy, getDeviceInfo, getScreenshotSizeSpy
    const screenData = {
        width: 10,
        height: 20,
    }

    beforeEach(() => {
        jest.isolateModules(() => {
            getDeviceInfo = require('../../lib/methods/getDeviceInfo').getDeviceInfo
        })
        delete global.driver
        global.driver = {
            capabilities:{},
            getWindowSize: jest.fn().mockResolvedValue(screenData),
        }
        getScreenshotSizeSpy = jest.spyOn(Utils, 'getScreenshotSize').mockReturnValue({
            width: 1000,
            height: 2000,
        })
    })

    afterEach(() => {
        global.driver = {
            getWindowSize: jest.fn().mockRestore(),
        }
        determineIphoneXSeriesSpy.mockRestore()
        determineLargeIphoneXSeriesSpy.mockRestore()
        getScreenshotSizeSpy.mockRestore()
    })

    it('should be able to get the default device info for the initial run', async () => {
        determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(false)
        determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(false)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
        expect(getScreenshotSizeSpy).toBeCalledWith(IMAGE_STRING)
        expect(global.driver.getWindowSize).toHaveBeenCalled()
        expect(determineIphoneXSeriesSpy).toBeCalledWith(screenData)
        expect(determineLargeIphoneXSeriesSpy).toBeCalledWith(screenData)
    })

    it('should be able to get the default device info for the second run', async () => {
        determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(false)
        determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(false)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
        expect(getScreenshotSizeSpy).toBeCalledWith(IMAGE_STRING)
        expect(global.driver.getWindowSize).toHaveBeenCalled()
        expect(determineIphoneXSeriesSpy).toBeCalledWith(screenData)
        expect(determineLargeIphoneXSeriesSpy).toBeCalledWith(screenData)

        getScreenshotSizeSpy.mockRestore()
        determineIphoneXSeriesSpy.mockRestore()
        determineLargeIphoneXSeriesSpy.mockRestore()
        global.driver = {
            getWindowSize: jest.fn().mockRestore(),
        }

        // The second run to check that the data is stored in the `DEVICE_INFO` and all methods are not called again
        global.driver = {
            getWindowSize: jest.fn().mockResolvedValue(screenData),
        }
        getScreenshotSizeSpy = jest.spyOn(Utils, 'getScreenshotSize').mockReturnValue({
            width: 1000,
            height: 2000,
        })
        determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(false)
        determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(false)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
        expect(getScreenshotSizeSpy).not.toHaveBeenCalled()
        expect(global.driver.getWindowSize).not.toHaveBeenCalled()
        expect(determineIphoneXSeriesSpy).not.toHaveBeenCalled()
        expect(determineLargeIphoneXSeriesSpy).not.toHaveBeenCalled()
    })

    it('should be able to get the device info for an iPhone X', async () => {
        determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(true)
        determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(false)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
    })

    it('should be able to get the device info for an iPhone X Large', async () => {
        determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(false)
        determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(true)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
    })

    it('should be able to get the device info for a landscape phone', async () => {
        global.driver = {
            capabilities: {},
            getWindowSize: jest.fn().mockResolvedValue({
                width: 1000,
                height: 500,
            }),
        }

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
    })

    it('should be able to get the device info an Android phone', async () => {
        global.driver = {
            capabilities: {
                pixelRatio: 2.75,
                statBarHeight: 66,
                viewportRect: { left: 0, top: 66, width: 1000, height: 1802 }
            },
            getWindowSize: jest.fn().mockResolvedValue({
                width: 1000,
                height: 2000,
            }),
        }

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
    })
})
