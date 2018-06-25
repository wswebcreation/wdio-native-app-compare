import { readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import { compareImages } from '../resemble/compareImages';

export default class Compare {
    /**
     * Compare 2 images with each other
     *
     * @param {object}  folders
     * @param {string}  fileName
     * @param {object}  options
     *
     * @return {Promise<number>}
     */
    static async execute(folders, fileName, options) {
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
            readFileSync(join(process.cwd(), folders.baselineFolder, fileName)),
            readFileSync(join(process.cwd(), folders.actualFolder, fileName)),
            options
        );
        const misMatchPercentage = options.rawMisMatchPercentage
            ? data.rawMisMatchPercentage
            : Number(data.rawMisMatchPercentage.toFixed(2));

        if (misMatchPercentage > options.saveAboveTolerance || options.debug) {
            writeFileSync(join(process.cwd(), folders.diffFolder, fileName), data.getBuffer());
        }

        return misMatchPercentage;
    }

    /**
     * Determine the default compare options
     *
     * @param {object}  options
     * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
     * @param {boolean} options.ignoreAlpha compare images and discard alpha
     * @param {boolean} options.ignoreAntialiasing compare images and discard anti aliasing
     * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @param {boolean} options.ignoreLess compare images and compare with red = 16, green = 16, blue = 16, alpha = 16, minBrightness=16, maxBrightness=240
     * @param {boolean} options.ignoreNothing compare images and compare with red = 0, green = 0, blue = 0, alpha = 0, minBrightness=0, maxBrightness=255
     * @param {boolean} options.ignoreTransparentPixel Will ignore all pixels that have some transparency in one of the images
     * @param {boolean} options.rawMisMatchPercentage default false. If true the return percentage will be like 0.12345678, default is 0.12
     * @param {number}  options.saveAboveTolerance Allowable value of misMatchPercentage that prevents saving image with differences
     *
     * @return {{
     *      debug: boolean
     *      ignore: array
     *      ignoreAlpha: boolean,
     *      ignoreAntialiasing: boolean,
     *      ignoreColors: boolean,
     *      ignoreLess: boolean,
     *      ignoreNothing: boolean,
     *      ignoreTransparentPixel: boolean,
     *      rawMisMatchPercentage: boolean
     *      saveAboveTolerance: number
     *  }}
     */
    static defaultOptions(options) {
        return {
            debug: options.debug || false,
            ignore: [],
            ignoreAlpha: options.ignoreAlpha || false,
            ignoreAntialiasing: options.ignoreAntialiasing || false,
            ignoreColors: options.ignoreColors || false,
            ignoreLess: options.ignoreLess || false,
            ignoreNothing: options.ignoreNothing || false,
            ignoreTransparentPixel: options.ignoreTransparentPixel || false,
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
