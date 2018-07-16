import { resolve } from 'path';
import Screenshots from '../helpers/screenshots';
import { determineFilePath, formatFileName } from '../helpers/utils';
import { saveImage } from '../helpers/image';

/**
 * Save a screen
 *
 * @param {string} tag
 *
 * @example
 *  browser.saveScreen('tag-name-of-image');
 *
 * @return {Promise<buffer>}
 */
export default async function saveScreen(tag) {
    // Determine filename
    const fileName = formatFileName(this.formatString, tag);
    // Take the screenshot
    const buffer = await Screenshots.getBufferedScreenshot();
    saveImage(
        determineFilePath(
            this.folders.actualFolder,
            this.savePerDevice,
            fileName
        ),
        buffer,
    );

    return buffer;
}
