import { pathExistsSync, removeSync } from 'fs-extra'
import { join } from 'path'
import {
    determineFileData,
    determineSmallIphone,
    determineMediumIphone,
    determineLargeIphone,
    determineExtraLargeIphone,
    formatFileName,
    getAndCreatePath,
    getScreenshotSize,
    multiplyIosObjectValuesAgainstDPR,
} from '../../lib/helpers/utils'
import {
    IPHONE_EXTRA_LARGE_SIZE,
    IPHONE_LARGE_SIZE,
    IPHONE_MEDIUM_SIZE,
    IPHONE_SMALL_SIZE,
} from '../../lib/helpers/constants'
import { IMAGE_STRING } from '../mocks/mocks'

describe('utils', () => {
    const folder = join(process.cwd(), '/.tmp/utils')

    describe('formatFileName', () => {
        it('should format a string when no capabilities are provided', () => {
            const capabilities = {}

            expect(
                formatFileName(
                    capabilities,
                    '{deviceName}-{orientation}-{platformName}-{platformVersion}',
                    'tag-string'
                )
            ).toMatchSnapshot()
        })

        it('should format a string when all capabilities are provided with JSON Wire Protocol', () => {
            const capabilities = {
                deviceName: 'jwp-deviceName',
                orientation: 'jwp-orientation',
                platformName: 'jwp-platformName',
                platformVersion: 'jwp-platformVersion',
                appearance: 'jwp-appearance',
            }

            expect(
                formatFileName(
                    capabilities,
                    '{deviceName}-{orientation}-{platformName}-{platformVersion}-{appearance}',
                    'tag-string'
                )
            ).toMatchSnapshot()
        })

        it('should format a string when all capabilities are provided with W3C Protocol', () => {
            const capabilities = {
                'appium:deviceName': 'w3c-deviceName',
                'appium:orientation': 'w3c-orientation',
                'appium:platformName': 'w3c-platformName',
                'appium:platformVersion': 'w3c-platformVersion',
                'nacs:appearance': 'w3c-appearance',
            }

            expect(
                formatFileName(
                    capabilities,
                    '{deviceName}-{orientation}-{platformName}-{platformVersion}-{appearance}',
                    'tag-string'
                )
            ).toMatchSnapshot()
        })
    })

    describe('getAndCreatePath', () => {
        afterEach(() => removeSync(folder))

        it("should create the folder and return the folder name for a device that needs to have it's own folder with JSON Wire Protocol", () => {
            const capabilities = { deviceName: 'jwp-iphone_x' }
            const expectedFolderName = join(folder, capabilities.deviceName)

            expect(pathExistsSync(expectedFolderName)).toEqual(false)
            expect(getAndCreatePath(capabilities, folder, true)).toEqual(
                expectedFolderName
            )
            expect(pathExistsSync(expectedFolderName)).toEqual(true)
        })

        it("should create the folder and return the folder name for a device that needs to have it's own folder with W3C Protocol", () => {
            const capabilities = { 'appium:deviceName': 'w3c-iphone_x' }
            const expectedFolderName = join(
                folder,
                capabilities['appium:deviceName']
            )

            expect(pathExistsSync(expectedFolderName)).toEqual(false)
            expect(getAndCreatePath(capabilities, folder, true)).toEqual(
                expectedFolderName
            )
            expect(pathExistsSync(expectedFolderName)).toEqual(true)
        })

        it('should create the folder and return the folder name when there is no device name and no seperate folder needs to be created', () => {
            const capabilities = {}
            const expectedFolderName = folder

            expect(pathExistsSync(expectedFolderName)).toEqual(false)
            expect(getAndCreatePath(capabilities, folder, false)).toEqual(
                expectedFolderName
            )
            expect(pathExistsSync(expectedFolderName)).toEqual(true)
        })
    })

    describe('determineFileData', () => {
        it('should be able to determine the faile data', () => {
            const capabilities = { deviceName: 'device' }
            const expectedFolderName = join(
                folder,
                `${capabilities.deviceName}.png`
            )

            expect(
                determineFileData(capabilities, folder, '{deviceName}', 'tag')
            ).toEqual({
                fileName: 'device.png',
                filePath: expectedFolderName,
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

            expect(
                multiplyIosObjectValuesAgainstDPR({ v: 0, x: 1, y: 2, z: 3 }, 3)
            ).toMatchSnapshot()
        })

        it('should be able to return data back for iOS', () => {
            global.driver.isIOS = true

            expect(
                multiplyIosObjectValuesAgainstDPR({ v: 0, x: 1, y: 2, z: 3 }, 3)
            ).toMatchSnapshot()
        })
    })

    describe('determineSmallIphone', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a android device with matching screensize is not a small Iphone device', () => {
            global.driver.isIOS = false

            expect(
                determineSmallIphone({ width: IPHONE_SMALL_SIZE, height: 600 })
            ).toEqual(false)
        })

        it('should determine that a iOS device with non matching screensize is not a small Iphone device', () => {
            global.driver.isIOS = true

            expect(
                determineSmallIphone({ width: IPHONE_LARGE_SIZE, height: 600 })
            ).toEqual(false)
        })

        it('should determine that a portrait iOS device with the iPhone default X screensize is a small Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineSmallIphone({ width: IPHONE_SMALL_SIZE, height: 200 })
            ).toEqual(true)
        })

        it('should determine that a landscape iOS device with the iPhone default X screensize is a small Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineSmallIphone({ width: 200, height: IPHONE_SMALL_SIZE })
            ).toEqual(true)
        })
    })

    describe('determineLargeIphone', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a android device with matching screensize is not a large Iphone device', () => {
            global.driver.isIOS = false

            expect(
                determineLargeIphone({ width: IPHONE_LARGE_SIZE, height: 600 })
            ).toEqual(false)
        })

        it('should determine that a iOS device with non matching screensize is not a large Iphone device', () => {
            global.driver.isIOS = true

            expect(
                determineLargeIphone({ width: IPHONE_SMALL_SIZE, height: 600 })
            ).toEqual(false)
        })

        it('should determine that a portrait iOS device with the 11 screensize is a large Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineLargeIphone({ width: IPHONE_LARGE_SIZE, height: 200 })
            ).toEqual(true)
        })

        it('should determine that a landscape iOS device with the 11 screensize is a large Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineLargeIphone({ width: 200, height: IPHONE_LARGE_SIZE })
            ).toEqual(true)
        })
    })

    describe('determineMediumIphone', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a android device with matching screensize is not a medium Iphone device', () => {
            global.driver.isIOS = false

            expect(
                determineMediumIphone({
                    width: IPHONE_MEDIUM_SIZE,
                    height: 600,
                })
            ).toEqual(false)
        })

        it('should determine that a iOS device with non matching screensize is not a medium Iphone device', () => {
            global.driver.isIOS = true

            expect(
                determineMediumIphone({ width: IPHONE_SMALL_SIZE, height: 600 })
            ).toEqual(false)
        })

        it('should determine that a portrait iOS device with the 12 screensize is a medium Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineMediumIphone({
                    width: IPHONE_MEDIUM_SIZE,
                    height: 200,
                })
            ).toEqual(true)
        })

        it('should determine that a landscape iOS device with the 12 screensize is a medium Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineMediumIphone({
                    width: 200,
                    height: IPHONE_MEDIUM_SIZE,
                })
            ).toEqual(true)
        })
    })

    describe('determineExtraLargeIphone', () => {
        beforeEach(() => {
            delete global.driver
            global.driver = {}
        })

        it('should determine that a android device with matching screensize is not a extra large Iphone device', () => {
            global.driver.isIOS = false

            expect(
                determineExtraLargeIphone({
                    width: IPHONE_EXTRA_LARGE_SIZE,
                    height: 600,
                })
            ).toEqual(false)
        })

        it('should determine that a iOS device with non matching screensize is not a extra large Iphone device', () => {
            global.driver.isIOS = true

            expect(
                determineExtraLargeIphone({
                    width: IPHONE_SMALL_SIZE,
                    height: 600,
                })
            ).toEqual(false)
        })

        it('should determine that a portrait iOS device with the 12 Pro Max screensize is a extra large Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineExtraLargeIphone({
                    width: IPHONE_EXTRA_LARGE_SIZE,
                    height: 200,
                })
            ).toEqual(true)
        })

        it('should determine that a landscape iOS device with the 12 Pro Max screensize is a extra large Iphone', () => {
            global.driver.isIOS = true

            expect(
                determineExtraLargeIphone({
                    width: 200,
                    height: IPHONE_EXTRA_LARGE_SIZE,
                })
            ).toEqual(true)
        })
    })

    describe('getScreenshotSize', () => {
        it('should be able to retrieve the screenshot size of an image', () => {
            expect(getScreenshotSize(IMAGE_STRING)).toMatchSnapshot()
        })
    })
})
