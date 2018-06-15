import { checkImageExists, compare } from '../helpers/image';
import { formatFileName } from '../helpers/utils';

/**
 * Compare a screen against a baseline
 *
 * @TODO:
 * - [ ] Add more comparison options and update docs
 * - [ ] Add more examples
 *
 * @param {string}  tag
 * @param {object}  options
 *
 * @example
 *  // Default
 *  browser.compareScreen('tag-name-of-image');
 *
 * @return {Promise<number>}
 */
export default async function compareScreen(tag, options = {}) {
    // First determine filename
    const fileName = formatFileName(this.formatString, tag);
    // Then make a screenshot
    await browser.saveScreen(tag);
    // Check if it exists
    await checkImageExists(this.folders, fileName);
    // Compare
    return await compare(this.folders, fileName, options);
}
