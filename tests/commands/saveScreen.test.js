import saveScreen from '../../lib/commands/saveScreen'
import * as Utils from '../../lib/helpers/utils'
import * as Screenshot from '../../lib/methods/takeBase64Screenshot'
import * as Save from '../../lib/methods/saveBase64Image'
import { IMAGE_STRING } from '../mocks/mocks'

describe('saveScreen', () => {
    it('should be able to return the save screen data', async function () {
        const determineFileDataSpy = jest.spyOn(Utils, 'determineFileData').mockReturnValue({ fileName: 'fileName.png', filePath: 'filePath' })
        const takeBase64ScreenshotSpy = jest.spyOn(Screenshot, 'takeBase64Screenshot').mockReturnValue(IMAGE_STRING)
        const saveBase64ImageSpy = jest.spyOn(Save, 'saveBase64Image').mockResolvedValue()

        const data = await saveScreen.call({ capabilities: {}, folders: { actual: 'usr/actual-folder/' }, formatString: 'string' }, 'tag')

        expect(determineFileDataSpy).toHaveBeenCalled()
        expect(takeBase64ScreenshotSpy).toHaveBeenCalled()
        expect(saveBase64ImageSpy).toHaveBeenCalled()
        expect(data).toMatchSnapshot()

        // restore the spies
        determineFileDataSpy.mockRestore()
        takeBase64ScreenshotSpy.mockRestore()
        saveBase64ImageSpy.mockRestore()
    })
})
