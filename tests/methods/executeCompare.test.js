jest.mock('fs-extra')

import { resolve } from 'path'
import * as Save from '../../lib/methods/saveBase64Image'
import * as BlockOuts from '../../lib/methods/addBlockOuts'
import * as CompareImages from '../../lib/resemble/compareImages'
import { executeCompare } from '../../lib/methods/executeCompare'
import { readFileSync } from 'fs-extra'

describe('executeCompare', () => {
    let saveBase64ImageSpy, compareImagesSpy, addBlockOutsSpy
    const addBlockOutsString = 'addBlockOuts-string'
    const getBufferString = 'getBuffer-string'

    beforeEach(() => {
        addBlockOutsSpy = jest.spyOn(BlockOuts, 'addBlockOuts').mockResolvedValue(addBlockOutsString)
        compareImagesSpy = jest.spyOn(CompareImages, 'compareImages').mockResolvedValue({
            rawMisMatchPercentage: 1.23456,
            getBuffer: () => 'getBuffer-string',
        })
        saveBase64ImageSpy = jest.spyOn(Save, 'saveBase64Image').mockResolvedValue()
    })

    afterEach(() => {
        // restore the spies
        addBlockOutsSpy.mockRestore()
        compareImagesSpy.mockRestore()
        saveBase64ImageSpy.mockRestore()
    })

    it('should be able to execute a compare without ignore options', async () => {
        const options = {
            saveAboveTolerance: 5,
        }

        expect(await executeCompare(
            { actual: 'actual-folder', baseline: 'actual-folder', diff: 'diff-folder', },
            'file-name.png',
            options,
        )).toMatchSnapshot()

        expect(compareImagesSpy).toBeCalledWith(readFileSync(), readFileSync(), options)
        expect(saveBase64ImageSpy).not.toHaveBeenCalled()
    })

    it('should be able to execute a compare with all ignore options', async () => {
        const options = {
            ignoreAlpha: true,
            ignoreAntialiasing: true,
            ignoreColors: true,
            ignoreLess: true,
            ignoreNothing: true,
            saveAboveTolerance: 5,
            ignore: [],
        }
        const compareOptions = {
            ...options,
            ...{ ignore: [ 'alpha', 'antialiasing', 'colors', 'less', 'nothing' ] }
        }

        expect(await executeCompare(
            { actual: 'actual-folder', baseline: 'actual-folder', diff: 'diff-folder', },
            'file-name.png',
            options,
        )).toMatchSnapshot()

        expect(compareImagesSpy).toBeCalledWith(readFileSync(), readFileSync(), compareOptions)
        expect(saveBase64ImageSpy).not.toHaveBeenCalled()
    })

    it('should be able to return the rawMisMatchPercentage', async () => {
        const options = {
            rawMisMatchPercentage: true,
            saveAboveTolerance: 5,
        }

        expect(await executeCompare(
            { actual: 'actual-folder', baseline: 'actual-folder', diff: 'diff-folder', },
            'file-name.png',
            options,
        )).toMatchSnapshot()

        expect(compareImagesSpy).toBeCalledWith(readFileSync(), readFileSync(), options)
        expect(saveBase64ImageSpy).not.toHaveBeenCalled()
    })

    it('should be able to store a diff image if the mismatch is above the tolerance', async () => {
        const fileName = 'file-name.png'
        const folders = { actual: 'actual-folder', baseline: 'actual-folder', diff: 'diff-folder' }
        const options = {
            rawMisMatchPercentage: true,
            saveAboveTolerance: 1,
            output: {},
        }

        expect(await executeCompare(folders, fileName, options)).toMatchSnapshot()

        expect(compareImagesSpy).toBeCalledWith(readFileSync(), readFileSync(), options)
        expect(saveBase64ImageSpy).toBeCalledWith(resolve(folders.diff, fileName), addBlockOutsString)
        expect(addBlockOutsSpy).toBeCalledWith(Buffer.from(getBufferString).toString('base64'), [])
    })

    it('should be able to store a diff image if the mismatch is above the tolerance and blockouts are provided', async () => {
        const fileName = 'file-name.png'
        const folders = { actual: 'actual-folder', baseline: 'actual-folder', diff: 'diff-folder' }
        const ignoredBoxes = [ { x: 1, y: 2, width: 3, height: 4 } ]
        const options = {
            rawMisMatchPercentage: true,
            saveAboveTolerance: 1,
            output: {
                ignoredBoxes,
            },
        }

        expect(await executeCompare(folders, fileName, options)).toMatchSnapshot()

        expect(compareImagesSpy).toBeCalledWith(readFileSync(), readFileSync(), options)
        expect(saveBase64ImageSpy).toBeCalledWith(resolve(folders.diff, fileName), addBlockOutsString)
        expect(addBlockOutsSpy).toBeCalledWith(Buffer.from(getBufferString).toString('base64'), ignoredBoxes)
    })
})
