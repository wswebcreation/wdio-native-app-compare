jest.mock('fs-extra')

import { IMAGE_STRING } from '../mocks/mocks'
import { outputFile } from 'fs-extra'
import { saveBase64Image } from '../../lib/methods/saveBase64Image'

describe('saveBase64Image', () => {
    it('should be able to save a saveBase64Image', async () => {
        outputFile.mockResolvedValue()

        saveBase64Image('file-path', IMAGE_STRING)

        expect(outputFile).toBeCalledWith('file-path', IMAGE_STRING, 'base64')
    })
})
