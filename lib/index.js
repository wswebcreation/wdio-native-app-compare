import { join, normalize } from 'path'
import { ACTUAL, DEFAULT_IMAGE_FORMAT_NAME, DIFF } from './helpers/constants'
import compareScreen from './commands/compareScreen'
import compareElement from './commands/compareElement'
import saveElement from './commands/saveElement'
import saveScreen from './commands/saveScreen'
import { defaultCompareOptions, initOptions } from './helpers/options'
import { getAndCreatePath } from './helpers/utils'
import { addToMatchAppImageSnapshotMatcher } from './matchers/toMatchAppImageSnapshot'

/**
 * The webdriver.io native app compare class
 *
 * @constructor
 * @class WdioNativeAppCompare
 * @param {object}  driver The webdriver instance
 * @param {object}  options
 * @param {boolean} options.autoSaveBaseline If no baseline image is found the image is automatically copied to the baselinefolder
 * @param {string}  options.baselineFolder Path to the baseline folder
 * @param {boolean} options.blockOutStatusBar If the statusbar on mobile / tablet needs to blocked out by default
 * @param {string}  options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {boolean} options.ignoreAlpha compare images and discard alpha
 * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16,
 *                  maxBrightness=240
 * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0,
 *                  maxBrightness=255
 * @param {number}  options.imageNameFormat Custom variables for the image name (default:{tag}-{deviceName})
 * @param {number}  options.largeImageThreshold Enable skipping pixels during the comparison to mitigate performance issues based on a
 *                  amount of pixels (width / height), default 0
 * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
 * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
 * @param {number}  options.savePerDevice Save the images per device in a separate folder
 */
export default class WdioNativeAppCompare {
    constructor(options) {
        this.options = initOptions(options)
    }

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `drover`. It is the perfect place to define custom commands.
     *
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    before(capabilities) {
        // The options
        const nativeAppCompareOptions = this.options
        this.autoSaveBaseline =
            nativeAppCompareOptions.autoSaveBaseline || false
        this.compareOptions = defaultCompareOptions(nativeAppCompareOptions)
        this.formatString =
            nativeAppCompareOptions.imageNameFormat || DEFAULT_IMAGE_FORMAT_NAME
        this.savePerDevice = nativeAppCompareOptions.savePerDevice || false

        this.capabilities = capabilities

        // Determine folders
        const baselineFolder = normalize(nativeAppCompareOptions.baselineFolder)
        const baseFolder = normalize(nativeAppCompareOptions.screenshotPath)

        this.folders = {
            actual: getAndCreatePath(
                this.capabilities,
                join(baseFolder, ACTUAL),
                this.savePerDevice
            ),
            baseline: getAndCreatePath(
                this.capabilities,
                baselineFolder,
                this.savePerDevice
            ),
            diff: getAndCreatePath(
                this.capabilities,
                join(baseFolder, DIFF),
                this.savePerDevice
            ),
        }

        // Add the commands to WebdriverIO instance
        driver.addCommand('saveElement', saveElement.bind(this))
        driver.addCommand('compareElement', compareElement.bind(this))
        driver.addCommand('saveScreen', saveScreen.bind(this))
        driver.addCommand('compareScreen', compareScreen.bind(this))

        addToMatchAppImageSnapshotMatcher()
    }
}
