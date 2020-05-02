import WdioNativeAppCompareService from '../lib/'
import * as Utils from '../lib/helpers/utils'


class DriverMock {
    constructor() {
        this.addCommand = jest.fn().mockImplementation((name, fn) => {
            this[ name ] = fn
        })

        this.call = jest.fn().mockImplementation((fn) => fn())
    }
}

describe('index', () => {
    let getAndCreatePathSpy

    beforeEach(() => {
        delete global.driver

        getAndCreatePathSpy = jest.spyOn(Utils, 'getAndCreatePath').mockResolvedValue()
    })

    afterEach(() => {
        getAndCreatePathSpy.mockRestore()
    })

    describe('before hook', () => {
        it('should register all commands', () => {
            const service = new WdioNativeAppCompareService({})
            global.driver = new DriverMock()

            service.before()

            expect(global.driver.addCommand).toHaveBeenCalledTimes(4)
        })
    })
})
