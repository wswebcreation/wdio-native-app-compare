import compareScreen from '../../lib/commands/compareScreen'
import * as Options from '../../lib/helpers/options'
import * as BaseLine from '../../lib/methods/checkBaselineImageExists'
import * as Regtangles from '../../lib/methods/rectangles'
import * as Compare from '../../lib/methods/executeCompare'

describe('compareScreen', () => {
    let checkBaselineImageExistsSpy, executeCompareSpy, instanceCompareOptionsSpy, determineIgnoreRectanglesSpy
    const saveScreenData = {
        base64Screenshot: '1234djdnfjkn',
        fileName: 'save-screen-filename.png',
        folders: {
            actual: 'usr/save-screen-filename-folder',
        }
    }

    beforeEach(() => {
        global.driver = {
            saveScreen: jest.fn().mockResolvedValue(saveScreenData),
        }
        checkBaselineImageExistsSpy = jest.spyOn(BaseLine, 'checkBaselineImageExists').mockResolvedValue()
    })

    afterEach(() => {
        // restore the spies
        instanceCompareOptionsSpy.mockRestore()
        checkBaselineImageExistsSpy.mockRestore()
        determineIgnoreRectanglesSpy.mockRestore()
        executeCompareSpy.mockRestore()
        global.driver = {
            saveScreen: jest.fn().mockRestore(),
        }
    })

    it('should be able to return compare screen data', async function () {
        const options = { a: 1, b: true, c: 'string' }

        instanceCompareOptionsSpy = jest.spyOn(Options, 'instanceCompareOptions').mockReturnValue({})
        determineIgnoreRectanglesSpy = jest.spyOn(Regtangles, 'determineIgnoreRectangles').mockResolvedValue([])
        executeCompareSpy = jest.spyOn(Compare, 'executeCompare').mockResolvedValue({
            fileName: saveScreenData.fileName,
            folders: saveScreenData.folders,
            misMatchPercentage: 0,
        })

        const data = await compareScreen.call({
            compareOptions: options,
            folders: { actual: saveScreenData.folders.actual },
            autoSaveBaseline: false
        }, 'tag')

        expect(instanceCompareOptionsSpy).toHaveBeenCalled()
        expect(global.driver.saveScreen).toBeCalledWith('tag', true)
        expect(checkBaselineImageExistsSpy).toHaveBeenCalled()
        expect(determineIgnoreRectanglesSpy).toBeCalledWith(saveScreenData.base64Screenshot, options)
        expect(executeCompareSpy).toBeCalledWith(saveScreenData.folders, saveScreenData.fileName, options)
        expect(data).toMatchSnapshot()
    })

    it('should be able to return compare screen data with instance options are provided', async function () {
        const options = { a: 1, b: true, c: 'string' }
        const instanceOptions = { a: 2, b: false, c: 'bar' }

        instanceCompareOptionsSpy = jest.spyOn(Options, 'instanceCompareOptions').mockReturnValue(instanceOptions)
        determineIgnoreRectanglesSpy = jest.spyOn(Regtangles, 'determineIgnoreRectangles').mockResolvedValue([])
        executeCompareSpy = jest.spyOn(Compare, 'executeCompare').mockResolvedValue({
            fileName: saveScreenData.fileName,
            folders: saveScreenData.folders,
            misMatchPercentage: 0,
        })

        const data = await compareScreen.call({
            compareOptions: options,
            folders: { actual: saveScreenData.folders.actual },
            autoSaveBaseline: false
        }, 'tag', instanceOptions)

        expect(instanceCompareOptionsSpy).toHaveBeenCalled()
        expect(global.driver.saveScreen).toBeCalledWith('tag', true)
        expect(checkBaselineImageExistsSpy).toHaveBeenCalled()
        expect(determineIgnoreRectanglesSpy).toBeCalledWith(saveScreenData.base64Screenshot, instanceOptions)
        expect(executeCompareSpy).toBeCalledWith(saveScreenData.folders, saveScreenData.fileName, instanceOptions)
        expect(data).toMatchSnapshot()
    })

    it('should be able to retrun compare screen data when rectangles are added', async function () {
        const options = { a: 1, b: true, c: 'string', output: {} }
        const rectangles = [ { x: 1, y: 2, width: 3, height: 4 } ]

        instanceCompareOptionsSpy = jest.spyOn(Options, 'instanceCompareOptions').mockReturnValue({})
        determineIgnoreRectanglesSpy = jest.spyOn(Regtangles, 'determineIgnoreRectangles').mockResolvedValue(rectangles)
        executeCompareSpy = jest.spyOn(Compare, 'executeCompare').mockResolvedValue({
            fileName: saveScreenData.fileName,
            folders: saveScreenData.folders,
            misMatchPercentage: 0,
        })

        const data = await compareScreen.call({
            compareOptions: options,
            folders: { actual: saveScreenData.folders.actual },
            autoSaveBaseline: false
        }, 'tag')

        expect(instanceCompareOptionsSpy).toHaveBeenCalled()
        expect(global.driver.saveScreen).toBeCalledWith('tag', true)
        expect(checkBaselineImageExistsSpy).toHaveBeenCalled()
        expect(determineIgnoreRectanglesSpy).toBeCalledWith(saveScreenData.base64Screenshot, options)
        expect(executeCompareSpy).toBeCalledWith(saveScreenData.folders, saveScreenData.fileName, options)
        expect(data).toMatchSnapshot()
    })
})
