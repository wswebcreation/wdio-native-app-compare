import { join, normalize, resolve } from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import Compare from './helpers/compare';
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
 * @constructor
 * @class WdioNativeAppCompare
 * @param {object}  browser The webdriver instance
 * @param {object}  options
 * @param {string}  options.baselineFolder Path to the baseline folder
 * @param {string}  options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
 * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
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

        // Compare options
        this.compareOptions = Compare.defaultOptions(options);

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
