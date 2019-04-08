import { takeResizedElementScreenshot } from '../../lib/methods/takeResizedElementScreenshot'
import * as Screenshot from '../../lib/methods/takeBase64Screenshot'
import * as DeviceInfo from '../../lib/methods/getDeviceInfo'
import * as CroppedBase64Image from '../../lib/methods/makeCroppedBase64Image'

describe('takeResizedElementScreenshot', () => {
    let takeBase64ScreenshotSpy, getDeviceInfoSpy, makeCroppedBase64ImageSpy
    const takeBase64ScreenshotResult = 'takeBase64ScreenshotSpy-string'
    const imageString = 'take-resized-element-screenshot-string'

    beforeEach(() => {
        global.browser = {
            getElementRect: jest.fn().mockResolvedValue({
                x: 1,
                y: 2,
                width: 10,
                height: 20,
            }),
        }

        takeBase64ScreenshotSpy = jest.spyOn(Screenshot, 'takeBase64Screenshot').mockResolvedValue(takeBase64ScreenshotResult)
        getDeviceInfoSpy = jest.spyOn(DeviceInfo, 'getDeviceInfo').mockResolvedValue({ dpr: 2 })
        makeCroppedBase64ImageSpy = jest.spyOn(CroppedBase64Image, 'makeCroppedBase64Image').mockResolvedValue(imageString)
    })

    afterEach(() => {
        global.browser = {
            getElementRect: jest.fn().mockRestore(),
        }
        takeBase64ScreenshotSpy.mockRestore()
        getDeviceInfoSpy.mockRestore()
        makeCroppedBase64ImageSpy.mockRestore()
    })

    it('should be able to take an element screenshot without resize dimensions', async () => {
        expect(await takeResizedElementScreenshot({ elementId: 1 }, 'file-path')).toEqual(imageString)

        expect(global.browser.getElementRect).toBeCalledWith(1)
        expect(getDeviceInfoSpy).toBeCalledWith(takeBase64ScreenshotResult)
        expect(takeBase64ScreenshotSpy).toHaveBeenCalled()
        expect(makeCroppedBase64ImageSpy).toBeCalledWith(
            takeBase64ScreenshotResult,
            { height: 40, width: 20, x: 2, y: 4 },
            { bottom: 0, left: 0, right: 0, top: 0 },
        )
    })

    it('should be able to take an element screenshot with resize dimensions', async () => {
        expect(await takeResizedElementScreenshot(
            { elementId: 1 },
            'file-path',
            { bottom: 10, left: 20, right: 30, top: 40 },
        )).toEqual(imageString)

        expect(global.browser.getElementRect).toBeCalledWith(1)
        expect(getDeviceInfoSpy).toBeCalledWith(takeBase64ScreenshotResult)
        expect(takeBase64ScreenshotSpy).toHaveBeenCalled()
        expect(makeCroppedBase64ImageSpy).toBeCalledWith(
            takeBase64ScreenshotResult,
            { height: 40, width: 20, x: 2, y: 4 },
            { bottom: 10, left: 20, right: 30, top: 40 },
        )
    })
})
