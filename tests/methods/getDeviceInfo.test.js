import { IMAGE_STRING } from '../mocks/mocks'
import { getDeviceInfo } from '../../lib/methods/getDeviceInfo'
import * as Utils from '../../lib/helpers/utils'

describe('getDeviceInfo', () => {
    it('should be able to get the device info', async () => {
        const screenData = {
            width: 10,
            height: 20,
        }
        global.browser = {
            getWindowSize: jest.fn().mockResolvedValue(screenData),
        }
        let getScreenshotSizeSpy = jest.spyOn(Utils, 'getScreenshotSize').mockReturnValue({
            width: 1000,
            height: 2000,
        })
        let determineIphoneXSeriesSpy = jest.spyOn(Utils, 'determineIphoneXSeries').mockReturnValue(false)
        let determineLargeIphoneXSeriesSpy = jest.spyOn(Utils, 'determineLargeIphoneXSeries').mockReturnValue(false)

        expect(await getDeviceInfo(IMAGE_STRING)).toMatchSnapshot()
        expect(getScreenshotSizeSpy).toBeCalledWith(IMAGE_STRING)
        expect(global.browser.getWindowSize).toHaveBeenCalled()
        expect(determineIphoneXSeriesSpy).toBeCalledWith(screenData)
        expect(determineLargeIphoneXSeriesSpy).toBeCalledWith(screenData)

        getScreenshotSizeSpy.mockRestore()
        determineIphoneXSeriesSpy.mockRestore()
        determineLargeIphoneXSeriesSpy.mockRestore()
        global.browser = {
            getWindowSize: jest.fn().mockRestore(),
        }

        // The second run to check that the data is stored
        global.browser = {
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
        expect(global.browser.getWindowSize).not.toHaveBeenCalled()
        expect(determineIphoneXSeriesSpy).not.toHaveBeenCalled()
        expect(determineLargeIphoneXSeriesSpy).not.toHaveBeenCalled()
    })
})
