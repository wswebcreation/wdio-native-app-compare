import saveElement from '../../lib/commands/saveElement'
import * as Utils from '../../lib/helpers/utils'
import * as ElementScreenshot from '../../lib/methods/takeElementScreenshot'
import * as Save from '../../lib/methods/saveBase64Image'
import * as ResizedElementScreenshot from '../../lib/methods/takeResizedElementScreenshot'
import { IMAGE_STRING } from '../mocks/mocks'

describe('saveElement', () => {
    let determineFileDataSpy, takeElementScreenshotSpy, takeResizedElementScreenshotSpy, saveBase64ImageSpy

    beforeEach(() => {
        takeElementScreenshotSpy = jest.spyOn(ElementScreenshot, 'takeElementScreenshot').mockReturnValue(IMAGE_STRING)
        takeResizedElementScreenshotSpy = jest.spyOn(ResizedElementScreenshot, 'takeResizedElementScreenshot').mockReturnValue(IMAGE_STRING)
        saveBase64ImageSpy = jest.spyOn(Save, 'saveBase64Image').mockResolvedValue()
    })

    afterEach(() => {
        // restore the spies
        determineFileDataSpy.mockRestore()
        takeElementScreenshotSpy.mockRestore()
        takeResizedElementScreenshotSpy.mockRestore()
        saveBase64ImageSpy.mockRestore()
    })

    it('should be able to take an element screenshot and return the save element data', async function () {
        determineFileDataSpy = jest.spyOn(Utils, 'determineFileData').mockReturnValue({
            fileName: 'elementScreenshot.png',
            filePath: 'filePath'
        })

        const data = await saveElement.call({
            capabilities: {},
            folders: { actual: 'usr/actual-folder/' },
            formatString: 'string'
        }, {}, 'tag')

        expect(determineFileDataSpy).toHaveBeenCalled()
        expect(saveBase64ImageSpy).toHaveBeenCalled()
        expect(takeElementScreenshotSpy).toHaveBeenCalled()
        expect(takeResizedElementScreenshotSpy).not.toHaveBeenCalled()
        expect(data).toMatchSnapshot()
    })

    it('should be able to take a resized element screenshot and return the save element data', async function () {
        determineFileDataSpy = jest.spyOn(Utils, 'determineFileData').mockReturnValue({
            fileName: 'resizedElementScreenshot.png',
            filePath: 'filePath'
        })

        const data = await saveElement.call({
            capabilities: {},
            folders: { actual: 'usr/actual-folder/' },
            formatString: 'string'
        }, {}, 'tag', { resizeDimensions: {} })

        expect(determineFileDataSpy).toHaveBeenCalled()
        expect(takeResizedElementScreenshotSpy).toHaveBeenCalled()
        expect(takeElementScreenshotSpy).not.toHaveBeenCalled()
        expect(saveBase64ImageSpy).toHaveBeenCalled()
        expect(data).toMatchSnapshot()
    })
})
