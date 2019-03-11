import { initOptions } from '../lib/helpers/options'

describe('Options', () => {
    describe('initOptions', () => {
        it('should set the default options if no nativeAppCompare options are provided', () => {
            expect(initOptions({})).toMatchSnapshot()
        })

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
})
