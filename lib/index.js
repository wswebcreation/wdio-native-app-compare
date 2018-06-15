import { join, normalize, resolve } from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import {
    ACTUAL,
    DEFAULT_BASELINE_FODLER,
    DEFAULT_SCREENSHOTS,
    DIFF
} from './helpers/constants';
import compareScreen from './commands/compareScreen';
import compareElement from './commands/compareElement';
import saveElement from './commands/saveElement';
import saveScreen from './commands/saveScreen';

/**
 * The webdriver.io native app compare class
 *
 * @TODO:
 *  - [ ] Add comparison options for the constructor
 *
 * @constructor
 * @class WdioNativeAppCompare
 * @param {object}  browser The webdriver instance
 * @param {object}  options
 * @param {string}  options.baselineFolder Path to the baseline folder
 * @param {string}  options.screenshotPath Path to the folder where the screenshots are saved
 */
class WdioNativeAppCompare {
    constructor(browser, options) {
        if (!browser) {
            throw new Error('A WebdriverIO instance is needed to initialise wdio-native-app-compare')
        }

        // set some stuff
        const baselineFolder = normalize(options.baselineFolder || DEFAULT_BASELINE_FODLER);
        const baseFolder = normalize(options.screenshotPath || DEFAULT_SCREENSHOTS);
        this.folders = {
            actualFolder: join(baseFolder, ACTUAL),
            baseFolder,
            baselineFolder,
            diffFolder: join(baseFolder, DIFF),
        };
        this.formatString = options.formatImageName || '{tag}';

        // Create the folders that are needed
        ensureDirSync(this.folders.actualFolder);
        ensureDirSync(this.folders.baselineFolder);
        ensureDirSync(this.folders.diffFolder);

        // Add the commands to WebdriverIO instance
        browser.addCommand('saveElement', saveElement.bind(this));
        browser.addCommand('compareElement', compareElement.bind(this));
        browser.addCommand('saveScreen', saveScreen.bind(this));
        browser.addCommand('compareScreen', compareScreen.bind(this));

    }
}

/**
 * Init function for webdriver.io
 *
 * @param {object}  browser The webdriver instance
 * @param {object}  options
 *
 * @return {WdioNativeAppCompare}
 */
export function init(webdriverInstance, options) {
    return new WdioNativeAppCompare(webdriverInstance, options);
}
