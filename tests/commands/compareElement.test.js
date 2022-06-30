import compareElement from '../../lib/commands/compareElement'
import * as Options from '../../lib/helpers/options'
import * as BaseLine from '../../lib/methods/checkBaselineImageExists'
import * as DetermineValidBlockOuts from '../../lib/methods/rectangles'
import * as Compare from '../../lib/methods/executeCompare'

describe('compareElement', () => {
    let checkBaselineImageExistsSpy,
        determineValidBlockOutsSpy,
        executeCompareSpy,
        instanceCompareOptionsSpy
    const saveElementData = {
        base64Screenshot: '1234djdnfjkn',
        fileName: 'save-element-filename.png',
        folders: {
            actual: 'usr/save-element-filename-folder',
        },
    }

    beforeEach(() => {
        global.driver = {
            saveElement: jest.fn().mockResolvedValue(saveElementData),
        }
        checkBaselineImageExistsSpy = jest
            .spyOn(BaseLine, 'checkBaselineImageExists')
            .mockResolvedValue()
    })

    afterEach(() => {
        // restore the spies
        checkBaselineImageExistsSpy.mockRestore()
        determineValidBlockOutsSpy.mockRestore()
        executeCompareSpy.mockRestore()
        instanceCompareOptionsSpy.mockRestore()
        global.driver = {
            saveElement: jest.fn().mockRestore(),
        }
    })

    it('should be able to return compare element data', async function () {
        const options = { a: 1, b: true, c: 'string' }

        instanceCompareOptionsSpy = jest
            .spyOn(Options, 'instanceCompareOptions')
            .mockReturnValue({})
        executeCompareSpy = jest
            .spyOn(Compare, 'executeCompare')
            .mockResolvedValue({
                fileName: saveElementData.fileName,
                folders: saveElementData.folders,
                misMatchPercentage: 0,
            })
        determineValidBlockOutsSpy = jest.spyOn(
            DetermineValidBlockOuts,
            'determineValidBlockOuts'
        )

        const data = await compareElement.call(
            {
                compareOptions: options,
                folders: { actual: saveElementData.folders.actual },
                autoSaveBaseline: false,
            },
            {},
            'tag'
        )

        expect(instanceCompareOptionsSpy).toHaveBeenCalled()
        expect(global.driver.saveElement).toBeCalledWith({}, 'tag', {})
        expect(checkBaselineImageExistsSpy).toHaveBeenCalled()
        expect(determineValidBlockOutsSpy).not.toHaveBeenCalled()
        expect(executeCompareSpy).toBeCalledWith(
            saveElementData.folders,
            saveElementData.fileName,
            options
        )
        expect(data).toMatchSnapshot()
    })

    it('should be able to return compare screen data with instance options are provided', async function () {
        const blockOutsValue = [
            {
                height: 1,
                width: 2,
                x: 3,
                y: 4,
            },
        ]
        const options = {
            a: 1,
            b: true,
            c: 'string',
            blockOuts: blockOutsValue,
        }
        const instanceOptions = {
            a: 2,
            b: false,
            c: 'bar',
            blockOuts: blockOutsValue,
            output: {},
        }

        instanceCompareOptionsSpy = jest
            .spyOn(Options, 'instanceCompareOptions')
            .mockReturnValue(instanceOptions)
        executeCompareSpy = jest
            .spyOn(Compare, 'executeCompare')
            .mockResolvedValue({
                fileName: saveElementData.fileName,
                folders: saveElementData.folders,
                misMatchPercentage: 0,
            })
        determineValidBlockOutsSpy = jest
            .spyOn(DetermineValidBlockOuts, 'determineValidBlockOuts')
            .mockReturnValue(blockOutsValue)

        const data = await compareElement.call(
            {
                compareOptions: options,
                folders: { actual: saveElementData.folders.actual },
                autoSaveBaseline: false,
            },
            {},
            'tag',
            {}
        )

        expect(instanceCompareOptionsSpy).toHaveBeenCalled()
        expect(global.driver.saveElement).toBeCalledWith({}, 'tag', {})
        expect(checkBaselineImageExistsSpy).toHaveBeenCalled()
        expect(determineValidBlockOutsSpy).toBeCalledWith(blockOutsValue)
        expect(executeCompareSpy).toBeCalledWith(
            saveElementData.folders,
            saveElementData.fileName,
            {
                ...instanceOptions,
                ...{ output: { ignoredBoxes: blockOutsValue } },
            }
        )
        expect(data).toMatchSnapshot()
    })
})
