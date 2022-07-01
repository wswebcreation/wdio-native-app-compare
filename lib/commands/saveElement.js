import { determineFileData } from '../helpers/utils'
import { saveBase64Image } from '../methods/saveBase64Image'
import { takeElementScreenshot } from '../methods/takeElementScreenshot'
import { takeResizedElementScreenshot } from '../methods/takeResizedElementScreenshot'

/**
 * Save an element
 *
 * @param {object}  element The element
 * @param {string}  tag
 * @param {object}  options
 *
 * @return {Promise<{
 *  base64Screenshot: string,
 *  fileName: string,
 *  folders: {
 *      actual: string,
 *  },
 * }>}
 */
export default async function saveElement(element, tag, options = {}) {
    // Determine the filedata
    const fileData = determineFileData(
        this.capabilities,
        this.folders.actual,
        this.formatString,
        tag
    )

    let base64Screenshot

    // Create resized element screenshot if needed
    if (options.resizeDimensions) {
        base64Screenshot = await takeResizedElementScreenshot(
            element,
            fileData.fileName,
            options.resizeDimensions
        )
    } else {
        base64Screenshot = await takeElementScreenshot(
            element,
            fileData.fileName
        )
    }

    // Save the screenshot
    await saveBase64Image(fileData.filePath, base64Screenshot)

    // Return the element screenshot data
    return {
        base64Screenshot,
        fileName: fileData.fileName,
        folders: {
            actual: this.folders.actual,
        },
    }
}
