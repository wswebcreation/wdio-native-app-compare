import { addBlockOuts } from '../../lib/methods/addBlockOuts'
import { IMAGE_STRING } from '../mocks/mocks'

describe('addBlockOuts', () => {
    it('should add blockouts to image', async () => {
        await expect(
            addBlockOuts(IMAGE_STRING, [
                { right: 100, bottom: 100, left: 100, top: 100 },
                { right: 200, bottom: 200, left: 1000, top: 1000 },
            ])
        ).resolves.toMatchSnapshot()
    })
})
