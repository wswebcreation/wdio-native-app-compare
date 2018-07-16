import { join, normalize, resolve } from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import Compare from './helpers/compare';
import {
    ACTUAL,
    DEFAULT_BASELINE_FODLER,
    DEFAULT_IMAGE_FORMAT_NAME,
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
 * @param {boolean} options.autoSaveBaseline If no baseline image is found the image is automatically copied to the baselinefolder
 * @param {string}  options.baselineFolder Path to the baseline folder
 * @param {boolean} options.blockOutStatusBar If the statusbar on mobile / tablet needs to blocked out by default
 * @param {string}  options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
 * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
 * @param {number}  options.imageNameFormat Custom variables for the image name (default:{tag}-{deviceName})
 * @param {number}  options.largeImageThreshold Enable skipping pixels during the comparison to mitigate performance issues based on a amount of pixels (width / height), default 0
 * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
 * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
 * @param {number}  options.savePerDevice Save the images per device in a separate folder
 */
class WdioNativeAppCompare {
    constructor(browser, options) {
        if (!browser) {
            throw new Error('A WebdriverIO instance is needed to initialise wdio-native-app-compare')
        }

        // Determine folders
        const baselineFolder = normalize(options.baselineFolder || DEFAULT_BASELINE_FODLER);
        const baseFolder = normalize(options.screenshotPath || DEFAULT_SCREENSHOTS);
        this.folders = {
            actualFolder: join(baseFolder, ACTUAL),
            baseFolder,
            baselineFolder,
            diffFolder: join(baseFolder, DIFF),
        };

        // The options
        this.autoSaveBaseline = options.autoSaveBaseline || false;
        this.compareOptions = Compare.defaultOptions(options);
        this.formatString = options.imageNameFormat || DEFAULT_IMAGE_FORMAT_NAME;
        this.savePerDevice = options.savePerDevice || false;

        // Add the commands to WebdriverIO instance
        browser.addCommand('saveElement', saveElement.bind(this));
        browser.addCommand('compareElement', compareElement.bind(this));
        browser.addCommand('saveScreen', saveScreen.bind(this));
        browser.addCommand('compareScreen', compareScreen.bind(this));

        // Add a custom object to save data to
        browser.wdioNac = {};
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
