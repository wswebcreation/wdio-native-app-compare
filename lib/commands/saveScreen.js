import { resolve } from 'path';
import { takeBase64Screenshot } from '../helpers/takeBase64Screenshot';
import { saveImage } from '../helpers/image';
import { formatFileName } from '../helpers/utils';

/**
 * Save a screen
 *
 * @param {string} tag
 * @param {boolean} returnBuffer
 *
 * @example
 *  browser.saveScreen('tag-name-of-image');
 *
 * @return {Promise<buffer|object>}
 */
export default async function saveScreen(tag, returnBuffer = false) {
    // Determine filename
    const fileName = formatFileName(this.formatString, tag);
    const filePath = resolve(this.folders.actual, fileName);
    // Take the screenshot
    const buffer = await takeBase64Screenshot();

    saveImage(filePath, buffer);

    return returnBuffer ? buffer : {
        fileName,
        folders:{
            actual: this.folders.actual
        }
    };
}
