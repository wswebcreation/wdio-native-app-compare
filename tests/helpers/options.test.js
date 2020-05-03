import {defaultCompareOptions, initOptions, instanceCompareOptions} from '../../lib/helpers/options'

describe('Options', () => {
    describe('initOptions', () => {
        it('should set the default options if no options are provided', () => {
            expect(initOptions({})).toMatchSnapshot()
        })

        describe('V5', () => {
            it('should return the default baselineFolder if it is not provided', () => {
                const options = {
                    nativeAppCompare: {
                        foo: 1,
                        screenshotPath: './screenshotPath/',
                    }
                }
                expect(initOptions(options)).toMatchSnapshot()
            })

            it('should return the default screenshotPath if it is not provided', () => {
                const options = {
                    nativeAppCompare: {
                        baselineFolder: './somewhere/'
                    }
                }
                expect(initOptions(options)).toMatchSnapshot()
            })

            it('should return the provided options if the baselineFolder and screenshotPath are provided', () => {
                const options = {
                    nativeAppCompare: {
                        baselineFolder: './baselineFolder/',
                        screenshotPath: './screenshotPath/',
                        foo: 1,
                        bar: {
                            foo: 2,
                        }
                    }
                }
                expect(initOptions(options)).toMatchSnapshot()
            })
        })

        describe('V6', () => {
            it('should return the default baselineFolder if it is not provided', () => {
                const options = {
                    foo: 1,
                    screenshotPath: './screenshotPath/',
                }
                expect(initOptions(options)).toMatchSnapshot()
            })

            it('should return the default screenshotPath if it is not provided', () => {
                const options = {
                    baselineFolder: './somewhere/'
                }
                expect(initOptions(options)).toMatchSnapshot()
            })

            it('should return the provided options if the baselineFolder and screenshotPath are provided', () => {
                const options = {
                    baselineFolder: './baselineFolder/',
                    screenshotPath: './screenshotPath/',
                    foo: 1,
                    bar: {
                        foo: 2,
                    }
                }
                expect(initOptions(options)).toMatchSnapshot()
            })
        })
    })

    describe('defaultCompareOptions', () => {
        it('should set the default options if no options are provided', () => {
            expect(defaultCompareOptions({})).toMatchSnapshot()
        })

        it('should return the provided options if they are provided', () => {
            const options = {
                blockOutStatusBar: true,
                blockOutNavigationBar: true,
                blockOutIphoneXBottomBar: true,
                debug: true,
                ignoreAlpha: true,
                ignoreAntialiasing: true,
                ignoreColors: true,
                ignoreLess: true,
                ignoreNothing: true,
                rawMisMatchPercentage: true,
                saveAboveTolerance: 1234,
                largeImageThreshold: true,
            }
            expect(defaultCompareOptions(options)).toMatchSnapshot()
        })
    })

    describe('instanceCompareOptions', () => {
        it('should return nothing if no instance options are provided', () => {
            expect(instanceCompareOptions({})).toMatchSnapshot()
        })

        it('should return the provided instance blockout options and resize dimensions if they are provided', () => {
            const options = {
                blockOuts: [{height: 100, width: 100, x: 250, y: 900}, {height: 25, width: 75, x: 50, y: 400}],
                elementBlockOuts: [{element: 'LoginScreen.loginButton'}, {element: 'LoginScreen.email', margin: 50}],
                resizeDimensions: {top: 200, right: 20, bottom: 100, left: 40},
            }
            expect(instanceCompareOptions(options)).toMatchSnapshot()
        })

        it('should not return the provided instance ignore options if they are false', () => {
            const options = {
                blockOutStatusBar: false,
                blockOutIphoneXBottomBar: false,
                blockOutNavigationBar: false,
                ignoreAlpha: false,
                ignoreAntialiasing: false,
                ignoreColors: false,
                ignoreLess: false,
                ignoreNothing: false,
            }
            expect(instanceCompareOptions(options)).toMatchSnapshot()
        })

        it('should return the provided instance ignore options if they are true', () => {
            const options = {
                blockOutStatusBar: true,
                blockOutIphoneXBottomBar: true,
                blockOutNavigationBar: true,
                ignoreAlpha: true,
                ignoreAntialiasing: true,
                ignoreColors: true,
                ignoreLess: true,
                ignoreNothing: true,
            }
            expect(instanceCompareOptions(options)).toMatchSnapshot()
        })
    })
})
