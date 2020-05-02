import { takeElementScreenshot } from '../../lib/methods/takeElementScreenshot'
import * as ResizedElementScreenshot from '../../lib/methods/takeResizedElementScreenshot'

describe('takeElementScreenshot', () => {
    const imageString = 'take-element-screenshot-string'

    it('should be able to take an element screenshot with the takeElementScreenshot API', async () => {
        global.driver = {
            takeElementScreenshot: jest.fn().mockResolvedValue(imageString),
        }

        expect(await takeElementScreenshot({ elementId: 1 }, 'file-path')).toEqual(imageString)

        global.driver = {
            takeElementScreenshot: jest.fn().mockRestore(),
        }
    })

    it('should be able to take an element screenshot when the takeElementScreenshot API is not available', async () => {
        global.driver = {}
        const takeResizedElementScreenshotSpy = jest.spyOn(ResizedElementScreenshot, 'takeResizedElementScreenshot').mockReturnValue(imageString)

        expect(await takeElementScreenshot({ elementId: 1 }, 'file-path')).toEqual(imageString)

        expect(takeResizedElementScreenshotSpy).toBeCalledWith({ elementId: 1 }, 'file-path')
    })
})
