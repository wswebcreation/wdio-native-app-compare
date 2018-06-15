import { checkImageExists, compare } from '../helpers/image';
import { formatFileName } from '../helpers/utils';

/**
 * Compare an element against a baseline
 *
 * @TODO:
 * - [ ] Add more comparison options and update docs
 * - [ ] Add more examples
 *
 * @param {string}  elementSelector
 * @param {string}  tag
 * @param {object}  options
 *
 * @example
 *  // Default
 *  browser.compareElement('~selector', 'tag-name-of-image');
 *
 * @return {Promise<number>}
 */
export default async function compareElement(elementSelector, tag, options = {}) {
    // First determine filename
    const fileName = formatFileName(this.formatString, tag);
    // Then make a screenshot
    await browser.saveElement(elementSelector, tag, options);
    // Check if it exists
    await checkImageExists(this.folders, fileName);
    // Compare
    return await compare(this.folders, fileName, options);
}
