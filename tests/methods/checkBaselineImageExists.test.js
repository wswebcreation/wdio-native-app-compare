jest.mock('fs-extra')

import { access, copySync } from 'fs-extra'
import { checkBaselineImageExists } from '../../lib/methods/checkBaselineImageExists'

describe('checkBaselineImageExists', () => {
    const folders = {
        actual: 'usr/actual-folder',
        baseline: 'usr/baseline-folder',
    }
    const fileName = 'save-screen-filename.png'

    beforeEach(() => {
        access.mockReset()
    })

    it('should return true when baseline image exists', async () => {
        access.mockImplementation((file, cb) => {
            cb()
        })

        await expect(checkBaselineImageExists(folders, fileName, true)).resolves.toEqual(
            true
        )
    })

    describe('when baseline image does not exist', () => {
        beforeEach(() => {
            access.mockImplementation((file, cb) => {
                cb(new Error('no access'))
            })

            copySync.mockReset()
        })

        describe('when autoSaveBaseline is set to true', () => {
            it('should return false if copySync is succesfull', async () => {
                await expect(
                    checkBaselineImageExists(folders, fileName, true)
                ).resolves.toEqual(false)
            })

            it('should throw an error if copySync fails', async () => {
                copySync.mockImplementation(() => {
                    throw new Error('copy failed')
                })

                await expect(
                    checkBaselineImageExists(folders, fileName, true)
                ).rejects.toMatch('Image could not be copied.')
            })
        })

        it('should throw an error if autoSaveBaseline is set to false', async () => {
            await expect(
                checkBaselineImageExists(folders, fileName, false)
            ).rejects.toMatch('Image not found')
        })
    })
})
