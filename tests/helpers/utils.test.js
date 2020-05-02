import { pathExistsSync, removeSync } from 'fs-extra'
import { join } from 'path'
import {
    determineFileData,
    determineIphoneXSeries,
    determineLargeIphoneXSeries,
    formatFileName,
    getAndCreatePath,
    getScreenshotSize,
    multiplyIosObjectValuesAgainstDPR,
} from '../../lib/helpers/utils'
import { IPHONE_X_MAX_SIZE, IPHONE_X_SIZE } from '../../lib/helpers/constants'
import { IMAGE_STRING } from '../mocks/mocks'

describe('utils', () => {
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

            expect(pathExistsSync(expectedFolderName)).toEqual(false)
            expect(getAndCreatePath(capabilities, folder, true)).toEqual(expectedFolderName)
            expect(pathExistsSync(expectedFolderName)).toEqual(true)
        })

        it('should create the folder and return the folder name when there is no device name and no seperate folder needs to be created', () => {
            const capabilities = {}
            const expectedFolderName = folder

            expect(pathExistsSync(expectedFolderName)).toEqual(false)
            expect(getAndCreatePath(capabilities, folder, false)).toEqual(expectedFolderName)
            expect(pathExistsSync(expectedFolderName)).toEqual(true)
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

    describe('multiplyIosObjectValuesAgainstDPR', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should be able to return data back for Android', () => {
            global.driver.isIOS = false

            expect(multiplyIosObjectValuesAgainstDPR({ v: 0, x: 1, y: 2, z: 3 }, 3)).toMatchSnapshot()
        })

        it('should be able to return data back for iOS', () => {
            global.driver.isIOS = true

            expect(multiplyIosObjectValuesAgainstDPR({ v: 0, x: 1, y: 2, z: 3 }, 3)).toMatchSnapshot()
        })
    })

    describe('determineIphoneXSeries', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a portrait Android device with the iPhone default X screensize is not an iPhone X series device', () => {
            global.driver.isIOS = false

            expect(determineIphoneXSeries({ width: IPHONE_X_SIZE, height: 200 })).toEqual(false)
        })

        it('should determine that a landscape Android device with the iPhone default X screensize is not an iPhone X series device', () => {
            global.driver.isIOS = false

            expect(determineIphoneXSeries({ width: 200, height: IPHONE_X_SIZE })).toEqual(false)
        })

        it('should determine that a portrait Android device with the iPhone max X screensize is not an iPhone X series device', () => {
            global.driver.isIOS = false

            expect(determineIphoneXSeries({ width: IPHONE_X_MAX_SIZE, height: 200 })).toEqual(false)
        })

        it('should determine that a landscape Android device with the iPhone max X screensize is not an iPhone X series device', () => {
            global.driver.isIOS = false

            expect(determineIphoneXSeries({ width: 200, height: IPHONE_X_MAX_SIZE })).toEqual(false)
        })

        it('should determine that a iOS device with non matching screensize is not an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineIphoneXSeries({ width: 200, height: 600 })).toEqual(false)
        })

        it('should determine that a portrait iOS device with the iPhone default X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineIphoneXSeries({ width: IPHONE_X_SIZE, height: 200 })).toEqual(true)
        })

        it('should determine that a landscape iOS device with the iPhone default X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineIphoneXSeries({ width: 200, height: IPHONE_X_SIZE })).toEqual(true)
        })

        it('should determine that a portrait iOS device with the iPhone max X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineIphoneXSeries({ width: IPHONE_X_MAX_SIZE, height: 200 })).toEqual(true)
        })

        it('should determine that a landscape iOS device with the iPhone max X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineIphoneXSeries({ width: 200, height: IPHONE_X_MAX_SIZE })).toEqual(true)
        })
    })

    describe('determineLargeIphoneXSeries', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a portrait Android device with the iPhone max X screensize is not an iPhone X Max series device', () => {
            global.driver.isIOS = false

            expect(determineLargeIphoneXSeries({ width: IPHONE_X_MAX_SIZE, height: 200 })).toEqual(false)
        })

        it('should determine that a landscape Android device with the iPhone max X screensize is not an iPhone X Max series device', () => {
            global.driver.isIOS = false

            expect(determineLargeIphoneXSeries({ width: 200, height: IPHONE_X_MAX_SIZE })).toEqual(false)
        })

        it('should determine that a portrait iPhone default X device with the iPhone default X screensize is not an iPhone X Max series device', () => {
            global.driver.isIOS = false

            expect(determineLargeIphoneXSeries({ width: IPHONE_X_MAX_SIZE, height: 200 })).toEqual(false)
        })

        it('should determine that a landscape iPhone default X device with the iPhone default X screensize is not an iPhone X Max series device', () => {
            global.driver.isIOS = false

            expect(determineLargeIphoneXSeries({ width: 200, height: IPHONE_X_MAX_SIZE })).toEqual(false)
        })

        it('should determine that a portrait iOS device with the iPhone max X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineLargeIphoneXSeries({ width: IPHONE_X_MAX_SIZE, height: 200 })).toEqual(true)
        })

        it('should determine that a landscape iOS device with the iPhone max X screensize is an iPhone X series device', () => {
            global.driver.isIOS = true

            expect(determineLargeIphoneXSeries({ width: 200, height: IPHONE_X_MAX_SIZE })).toEqual(true)
        })
    })

    describe('getScreenshotSize', () => {
        it('should be able to retrieve the screenshot size of an image', () => {
            expect(getScreenshotSize(IMAGE_STRING)).toMatchSnapshot()
        })
    })
})
