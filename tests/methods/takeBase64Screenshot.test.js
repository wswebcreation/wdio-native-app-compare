import * as Screenshot  from '../../lib/methods/takeBase64Screenshot'

describe('takeBase64Screenshot', () => {
    it('should be able to take a screenshot', async () => {
        global.driver = {
            takeScreenshot: jest.fn().mockResolvedValue('image-string'),
        }

        expect(await Screenshot.takeBase64Screenshot()).toEqual('image-string')
        expect(global.driver.takeScreenshot).toHaveBeenCalled()

        global.driver = {
            saveScreen: jest.fn().mockRestore(),
        }
    })
})
