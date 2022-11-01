import { makeCroppedBase64Image } from '../../lib/methods/makeCroppedBase64Image'
import { IMAGE_STRING } from '../mocks/mocks'

describe('makeCroppedBase64Image', () => {
    it('should crop image without resizeDimensions', async () => {
        await expect(
            makeCroppedBase64Image(IMAGE_STRING, {
                height: 500,
                width: 500,
                x: 800,
                y: 300,
            })
        ).resolves.toMatchSnapshot()
    })

    it('should crop image with resizeDimensions', async () => {
        await expect(
            makeCroppedBase64Image(
                IMAGE_STRING,
                { height: 500, width: 500, x: 800, y: 300 },
                {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50,
                }
            )
        ).resolves.toMatchSnapshot()
    })

    it('should default to 0 if the image boundaries on top and left go out of bounds', async () => {
        await expect(
            makeCroppedBase64Image(
                IMAGE_STRING,
                { height: 500, width: 500, x: 800, y: 300 },
                {
                    left: 801,
                    right: 50,
                    top: 301,
                    bottom: 50,
                }
            )
        ).resolves.toMatchSnapshot()
    })
})
