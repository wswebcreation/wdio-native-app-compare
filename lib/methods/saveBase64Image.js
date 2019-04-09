import { outputFile } from 'fs-extra'

/**
 * Save the base64 image to a file
 *
 * @param   {string}  filePath
 * @param   {string}  base64Image
 *
 * @returns {Promise<void>}
 */
export async function saveBase64Image(filePath, base64Image) {
    return outputFile(filePath, base64Image, 'base64')
}
