import { resolve } from 'path';
import Screenshotter from '../helpers/screenshots';
import { formatFileName } from '../helpers/utils';

/**
 * Save a screen
 * @param {string} tag
 *
 * @return {Promise<void|string>}
 */

/**
 * Save a screen
 *
 * @param {string} tag
 *
 * @example
 *  browser.saveScreen('tag-name-of-image');
 *
 * @return {Promise<void>}
 */
export default async function saveScreen(tag) {
    // Determine filename
    const fileName = formatFileName(this.formatString, tag);
    // Take the screenshot
    await Screenshotter.saveToFile(resolve(this.folders.actualFolder, fileName));
}
