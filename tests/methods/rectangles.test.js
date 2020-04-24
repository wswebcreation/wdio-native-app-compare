import * as DeviceInfo from '../../lib/methods/getDeviceInfo'
import {IMAGE_STRING} from '../mocks/mocks'

describe('rectangles', () => {
    let getDeviceInfoSpy, ignoreRectanglesOptions, Rectangles

    beforeEach(() => {
        jest.isolateModules(() => {
            Rectangles = require('../../lib/methods/rectangles')
        })
        delete global.browser
        delete global.$$

        global.$$ = () => [{'element-selector-1': {}}]
        global.browser = {
            getElementRect: jest.fn().mockResolvedValue({x: 1, y: 2, width: 10, height: 20}),
            getSettings: jest.fn().mockResolvedValue({allowInvisibleElements: false}),
            updateSettings: jest.fn().mockResolvedValue({}),
            isIOS: false,
            isAndroid: false,
        }
        getDeviceInfoSpy = jest.spyOn(DeviceInfo, 'getDeviceInfo').mockResolvedValue({
            dpr: 2,
            isIphoneXSeries: true,
            isLargeIphoneXSeries: false,
            screenSize: {
                height: 1700,
                width: 812,
            },
            screenshotHeight: 1700,
            screenshotWidth: 812,
            isPortrait: true,
            iosRectangles: {
                STATUS_BAR: 20,
                HOME_BAR: {
                    PORTRAIT: {
                        height: 0,
                        width: 0,
                        x: 0,
                        y: 0,
                    },
                },
            },
        })
        ignoreRectanglesOptions = {
            blockOuts: [],
            blockOutNavigationBar: false,
            blockOutStatusBar: false,
            elementBlockOuts: [],
        }
    })

    afterEach(() => {
        global.browser = {
            getElementRect: jest.fn().mockRestore(),
            getSettings: jest.fn().mockRestore(),
            updateSettings: jest.fn().mockRestore(),
        }
        getDeviceInfoSpy.mockRestore()
    })

    describe('determineIgnoreRectangles', () => {
        it('should return nothing if no ignore rectangles need to be returned', async () => {
            expect(await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)).toMatchSnapshot()
        })

        it('should get the status bar block outs', async () => {
            ignoreRectanglesOptions.blockOutStatusBar = true

            expect(await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)).toMatchSnapshot()
        })

        it('should get the android navigation bar block outs', async () => {
            global.browser.isAndroid = true
            ignoreRectanglesOptions.blockOutNavigationBar = true

            expect(await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)).toMatchSnapshot()
        })

        it('should get the block outs', async () => {
            ignoreRectanglesOptions.blockOuts = [{x: 11, y: 22, width: 33, height: 44}, {
                x: 21,
                y: 32,
                width: 43,
                height: 54
            }]

            expect(await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)).toMatchSnapshot()
        })

        it('should return iPhone X bottom bar rectangles', async () => {
            ignoreRectanglesOptions.blockOutIphoneXBottomBar = true
            getDeviceInfoSpy = jest.spyOn(DeviceInfo, 'getDeviceInfo').mockResolvedValue({
                dpr: 2,
                screenshotWidth: 812,
                isIphoneXSeries: true,
                isLargeIphoneXSeries: false,
                iosRectangles:{
                    STATUS_BAR: 44,
                    HOME_BAR: {
                        PORTRAIT: {
                            height: 5,
                            width: 148,
                            x: 133,
                            y: 883,
                        },
                    },
                }
            })
            global.browser.isIOS = true

            expect(await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)).toMatchSnapshot()
        })

        it('should call the settings API for android when the status bar needs to be blocked out', async () => {
            global.browser.isAndroid = true
            ignoreRectanglesOptions.blockOutStatusBar = true

            await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)

            expect(global.browser.getSettings).toBeCalled()
            expect(global.browser.updateSettings).toBeCalledWith({allowInvisibleElements: true})
            expect(global.browser.updateSettings).toHaveBeenLastCalledWith({allowInvisibleElements: false})
        })

        it('should call the settings API for android when the navigation bar needs to be blocked out', async () => {
            global.browser.isAndroid = true
            ignoreRectanglesOptions.blockOutNavigationBar = true

            await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)

            expect(global.browser.getSettings).toBeCalled()
            expect(global.browser.updateSettings).toBeCalledWith({allowInvisibleElements: true})
            expect(global.browser.updateSettings).toHaveBeenLastCalledWith({allowInvisibleElements: false})
        })

        it('should call the settings API for android when elements needs to be blocked out', async () => {
            global.browser.isAndroid = true
            ignoreRectanglesOptions.elementBlockOuts = [{element: {selector: 'selector-1'}}, {
                element: {selector: 'selector-1'}
            }]
            await Rectangles.determineIgnoreRectangles(IMAGE_STRING, ignoreRectanglesOptions)
            expect(global.browser.getSettings).toBeCalled()
            expect(global.browser.updateSettings).toBeCalledWith({allowInvisibleElements: true})
            expect(global.browser.updateSettings).toHaveBeenLastCalledWith({allowInvisibleElements: false})
        })
    })

    describe('determineStatusBarRectangles', () => {
        it('should determine the initial statusbar rectangles', async () => {
            expect(await Rectangles.determineStatusBarRectangles({
                dpr: 4,
                iosStatusBar: 20,
                screenshotWidth: 300,
            })).toMatchSnapshot()
        })

        it('should determine the statusbar rectangles by using the already defined one', async () => {
            expect(await Rectangles.determineStatusBarRectangles({
                dpr: 10,
                iosStatusBar: 20,
                screenshotWidth: 30,
            })).toMatchSnapshot()

            // Call it again, this should not alter the outcome
            expect(await Rectangles.determineStatusBarRectangles({
                dpr: 40,
                iosStatusBar: 50,
                screenshotWidth: 60,
            })).toMatchSnapshot()
        })

        it('should determine the iOS statusbar rectangles', async () => {
            global.$ = () => [{'element-selector-1': {}}]
            global.browser.isIOS = true

            expect(await Rectangles.determineStatusBarRectangles({
                dpr: 4,
                iosStatusBar: 20,
                screenshotWidth: 300,
            })).toMatchSnapshot()
        })
    })

    describe('determineAndroidNavigationBarRectangles', () => {
        it('should determine the navigationbar rectangles', async () => {
            global.$ = () => [{'element-selector-1': {}}]

            expect(await Rectangles.determineAndroidNavigationBarRectangles({screenshotWidth: 500})).toMatchSnapshot()
        })

        it('should determine the navigationbar rectangles by using the already defined one', async () => {
            global.$ = () => [{'element-selector-1': {}}]

            expect(await Rectangles.determineAndroidNavigationBarRectangles({screenshotWidth: 500})).toMatchSnapshot()
            // Call it again, this should not alter the outcome
            expect(await Rectangles.determineAndroidNavigationBarRectangles({screenshotWidth: 1000})).toMatchSnapshot()
        })
    })

    describe('determineValidBlockOuts', () => {
        it('should return the valid blockouts if an valid array if provided', () => {
            const blockOuts = [
                {x: 1, y: 2, width: 3, height: 4},
                {x: 1, y: 2, width: 3, height: 4},
            ]

            expect(Rectangles.determineValidBlockOuts(blockOuts)).toMatchSnapshot()
        })
        it('should return the valid blockouts if an array with invalid keys is provided', () => {
            const blockOuts = [
                {x: 5, y: 6, width: 7, height: 8},
                {b: 5, y: 6, widthy: 7, height: 8},
                {x: 9, y: 12, width: 13, height: 14},
                {x: 9, ho: 12, width: 13, bar: 14},
            ]

            expect(Rectangles.determineValidBlockOuts(blockOuts)).toMatchSnapshot()
        })
    })

    describe('determineElementBlockOuts', () => {
        it('should return an empty array if no elements are provided', async () => {
            expect(await Rectangles.determineElementBlockOuts({
                components: [],
                dpr: 1,
            })).toMatchSnapshot()
        })

        it('should return an array of one element blockout if 1 element is provided', async () => {
            const selector = 'element-selector-1'
            const components = [
                {element: {selector}}
            ]
            global.$$ = () => [{'element-selector-1': {}}]

            expect(await Rectangles.determineElementBlockOuts({
                components: components,
                dpr: 1,
            })).toMatchSnapshot()
        })

        it('should return an array of one element blockout if multiple elements are provided but 1 with an element number', async () => {
            const selector = 'element-selector-1'
            const components = [
                {element: {selector}, elementNumber: 1}
            ]
            global.$$ = () => [{'element-selector-1': {}}, {'element-selector-1': {}}, {'element-selector-1': {}}]

            expect(await Rectangles.determineElementBlockOuts({
                components: components,
                dpr: 1,
            })).toMatchSnapshot()
        })

        it('should return an array of element blockouts if multiple elements are provided', async () => {
            const selector = 'element-selector-1'
            const components = [{element: {selector}}, {element: {selector}}, {element: {selector}}]
            global.$$ = () => [{'element-selector-1': {}}, {'element-selector-1': {}}, {'element-selector-1': {}}]

            expect(await Rectangles.determineElementBlockOuts({
                components: components,
                dpr: 1,
            })).toMatchSnapshot()
        })
    })

    describe('determineDimensions', () => {
        it('should be able to determine the dimensions when no margin is provided', () => {
            expect(Rectangles.determineDimensions({
                x: 100,
                y: 200,
                width: 1000,
                height: 2000,
            }, 0)).toMatchSnapshot()
        })

        it('should be able to determine the dimensions when a positive margin is provided', () => {
            expect(Rectangles.determineDimensions({
                x: 100,
                y: 200,
                width: 1000,
                height: 2000,
            }, 25)).toMatchSnapshot()
        })

        it('should be able to determine the dimensions when a negative margin is provided', () => {
            expect(Rectangles.determineDimensions({
                x: 100,
                y: 200,
                width: 1000,
                height: 2000,
            }, -25)).toMatchSnapshot()
        })
    })

    describe('getElementRectangles', () => {
        it('should return element rectangles', async () => {

            expect(await Rectangles.getElementRectangles({elementId: 1})).toMatchSnapshot()
            expect(global.browser.getElementRect).toBeCalledWith(1)
        })
    })
})
