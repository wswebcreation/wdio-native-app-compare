import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { compareImages } from '../resemble/compareImages';
import { saveImage } from './image';
import { determineFilePath } from './utils';

export default class Compare {
    /**
     * Compare 2 images with each other
     *
     * @param {object}  folders
     * @param {boolean} savePerDevice
     * @param {string}  fileName
     * @param {object}  options
     *
     * @return {Promise<number>}
     */
    static async execute(folders, savePerDevice, fileName, options) {
        if (options.ignoreAlpha) {
            options.ignore.push('alpha')
        }
        if (options.ignoreAntialiasing) {
            options.ignore.push('antialiasing')
        }
        if (options.ignoreColors) {
            options.ignore.push('colors')
        }
        if (options.ignoreLess) {
            options.ignore.push('less')
        }
        if (options.ignoreNothing) {
            options.ignore.push('nothing')
        }

        // Execute the compare and retrieve the data
        const data = await compareImages(
            readFileSync(determineFilePath(folders.baselineFolder, savePerDevice, fileName)),
            readFileSync(determineFilePath(folders.actualFolder, savePerDevice, fileName)),
            options
        );
        const misMatchPercentage = options.rawMisMatchPercentage
            ? data.rawMisMatchPercentage
            : Number(data.rawMisMatchPercentage.toFixed(2));

        if (misMatchPercentage > options.saveAboveTolerance || options.debug) {
            saveImage(determineFilePath(folders.diffFolder, savePerDevice, fileName), data.getBuffer());
        }

        return misMatchPercentage;
    }

    /**
     * Determine the default compare options
     *
     * @param {object}  options
     * @param {boolean} options.blockOutStatusBar If the statusbar on mobile / tablet needs to blocked out by default
     * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
     * @param {boolean} options.ignoreAlpha compare images and discard alpha
     * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
     * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
     * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
     * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
     * @param {number}  options.largeImageThreshold Enable skipping pixels during the comparison to mitigate performance issues based on a amount of pixels (width / height), default 0
     * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
     * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
     *
     * @return {{
     *      blockOutStatusBar: boolean,
     *      debug: boolean,
     *      ignore: array,
     *      ignoreAlpha: boolean,
     *      ignoreAntialiasing: boolean,
     *      ignoreColors: boolean,
     *      ignoreLess: boolean,
     *      ignoreNothing: boolean,
     *      ignoreRectangles: array,
     *      ignoreTransparentPixel: boolean,
     *      largeImageThreshold: number,
     *      rawMisMatchPercentage: boolean,
     *      saveAboveTolerance: number,
     *  }}
     */
    static defaultOptions(options) {
        return {
            blockOutStatusBar: options.blockOutStatusBar || false,
            debug: options.debug || false,
            ignore: [],
            ignoreAlpha: options.ignoreAlpha || false,
            ignoreAntialiasing: options.ignoreAntialiasing || false,
            ignoreColors: options.ignoreColors || false,
            ignoreLess: options.ignoreLess || false,
            ignoreNothing: options.ignoreNothing || false,
            ignoreRectangles: [],
            ignoreTransparentPixel: options.ignoreTransparentPixel || false,
            largeImageThreshold: options.largeImageThreshold || 0,
            rawMisMatchPercentage: options.rawMisMatchPercentage || false,
            saveAboveTolerance: options.saveAboveTolerance || 0,
        }
    }

    /**
     * Determine the instance compare options
     *
     * @param {object}  options
     * @param {boolean} options.ignoreAlpha compare images and discard alpha
     * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
     * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
     * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
     * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
     *
     * @return {{}}
     */
    static instanceOptions(options) {
        return {
            ...(options.ignoreAlpha ? { ignoreAlpha: options.ignoreAlpha } : {}),
            ...(options.ignoreAntialiasing ? { ignoreAntialiasing: options.ignoreAntialiasing } : {}),
            ...(options.ignoreColors ? { ignoreColors: options.ignoreColors } : {}),
            ...(options.ignoreLess ? { ignoreLess: options.ignoreLess } : {}),
            ...(options.ignoreNothing ? { ignoreNothing: options.ignoreNothing } : {}),
            ...(options.ignoreTransparentPixel ? { ignoreTransparentPixel: options.ignoreTransparentPixel } : {}),
        }
    }
}
