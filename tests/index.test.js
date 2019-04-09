import WdioNativeAppCompareService from '../lib/'
import * as Utils from '../lib/helpers/utils'


class BrowserMock {
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
        delete global.browser

        getAndCreatePathSpy = jest.spyOn(Utils, 'getAndCreatePath').mockResolvedValue()
    })

    afterEach(() => {
        getAndCreatePathSpy.mockRestore()
    })

    describe('before hook', () => {
        it('should register all commands', () => {
            const service = new WdioNativeAppCompareService({})
            global.browser = new BrowserMock()

            service.before()

            expect(global.browser.addCommand).toHaveBeenCalledTimes(4)
        })
    })
})
