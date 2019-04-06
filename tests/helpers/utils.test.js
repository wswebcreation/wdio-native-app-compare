import { determineFileData, formatFileName, getAndCreatePath } from '../../lib/helpers/utils'
import { pathExistsSync, removeSync } from 'fs-extra'
import { join } from 'path'

describe('Utils', () => {
    const folder = join(process.cwd(), '/.tmp/utils')

    describe('formatFileName', () => {
        it('should format a string when no capabilities are provided', () => {
            const capabilities = {}

            expect(formatFileName(capabilities, '{deviceName}-{orientation}-{platformName}-{platformVersion}', 'tag-string')).toMatchSnapshot()
        })

        it('should format a string when all capabilities are provided', () => {
            const capabilities = {
                deviceName: 'deviceName',
                orientation: 'orientation',
                platformName: 'platformName',
                platformVersion: 'platformVersion',
            }

            expect(formatFileName(capabilities, '{deviceName}-{orientation}-{platformName}-{platformVersion}', 'tag-string')).toMatchSnapshot()
        })
    })

    describe('getAndCreatePath', () => {

        afterEach(() => removeSync(folder))

        it('should create the folder and return the folder name for a device that needs to have it\'s own folder', () => {
            const capabilities = { deviceName: 'iphone_x' }
            const expectedFolderName = join(folder, capabilities.deviceName)

            expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
            expect(getAndCreatePath(capabilities, folder, true)).toEqual(expectedFolderName)
            expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
        })

        it('should create the folder and return the folder name when there is no device name and no seperate folder needs to be created', () => {
            const capabilities = {}
            const expectedFolderName = folder

            expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
            expect(getAndCreatePath(capabilities, folder, false)).toEqual(expectedFolderName)
            expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
        })
    })

    describe('determineFileData', () => {
        it('should be able to determine the faile data', () => {
            const capabilities = { deviceName: 'device' }
            const expectedFolderName = join(folder, `${ capabilities.deviceName }.png`)

            expect(determineFileData(capabilities, folder, '{deviceName}', 'tag')).toEqual({
                'fileName': 'device.png',
                'filePath': expectedFolderName,
            })
        })
    })
})
