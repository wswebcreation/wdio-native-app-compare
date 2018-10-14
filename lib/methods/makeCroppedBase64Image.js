import { yellow } from 'chalk';
import { createWriteStream } from 'fs-extra';
import { DEFAULT_RESIZE_DIMENSIONS } from '../helpers/constants';

const Canvas = require('canvas-prebuilt');

/**
 * Save a (cropped) canvas screen
 *
 * @param {buffer}  screenshot
 * @param {object}  rectangles
 * @param {object}  resizeDimensions
 */
export function makeCroppedBase64Image(screenshot, rectangles, resizeDimensions) {
    const CanvasImage = Canvas.Image;
    const image = new CanvasImage();
    const resize = {...DEFAULT_RESIZE_DIMENSIONS, ...resizeDimensions};
    let canvas;

    image.onerror = (err) => {
        throw err
    };

    image.onload = () => {
        const w = rectangles.width + resize.left + resize.right;
        const h = rectangles.height + resize.top + resize.bottom;
        canvas = new Canvas(w, h);
        const ctx = canvas.getContext('2d');

        let sourceXStart = rectangles.x - resize.left;
        let sourceYStart = rectangles.y - resize.top;

        if (sourceXStart < 0) {
            console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resize.left}' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${sourceXStart}'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
            sourceXStart = 0;
        }

        if (sourceYStart < 0) {
            console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resize.top}' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${sourceYStart}'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
            sourceYStart = 0;
        }

        ctx.drawImage(image,
            // Start at x/y pixels from the left and the top of the image (crop)
            sourceXStart, sourceYStart,
            // "Get" a (w * h) area from the source image (crop)
            w, h,
            // Place the result at 0, 0 in the canvas,
            0, 0,
            // With as width / height: 100 * 100 (scale)
            w, h
        );
    };
    image.src = `data:image/png;base64,${screenshot}`;

    return canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
}
