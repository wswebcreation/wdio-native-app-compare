import { yellow } from 'chalk';
import { createWriteStream } from 'fs-extra';

const Canvas = require('canvas-prebuilt');

/**
 * Save a (cropped) canvas screen
 *
 * @TODO: also check right and bottom coordinates
 *
 * @param {buffer}  screenshot
 * @param {object}  rectangles
 * @param {object}  resizeDimensions
 */
export function makeCroppedBase64Image(screenshot, rectangles, resizeDimensions) {
    const CanvasImage = Canvas.Image;
    const image = new CanvasImage();
    let canvas;

    console.log('rectangles = ', rectangles);
    console.log('resizeDimensions = ', resizeDimensions);

    image.onerror = (err) => {
        throw err
    };

    image.onload = () => {
        const w = rectangles.width + resizeDimensions.left + resizeDimensions.right;
        const h = rectangles.height + resizeDimensions.top + resizeDimensions.bottom;
        canvas = new Canvas(w, h);
        const ctx = canvas.getContext('2d');

        let sourceXStart = rectangles.x - resizeDimensions.left;
        let sourceYStart = rectangles.y - resizeDimensions.top;

        if (sourceXStart < 0) {
            console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resizeDimensions.left}' MADE THE CROPPING GO OUT OF
 THE IMAGE BOUNDARIES RESULTING IN AN IMAGE STARTPOSITION '${sourceXStart}'.
 THIS HAS BEEN DEFAULTED TO '0'
#####################################################################################
`));
            sourceXStart = 0;
        }

        if (sourceYStart < 0) {
            console.log(yellow(`
#####################################################################################
 THE RESIZE DIMENSION LEFT '${resizeDimensions.top}' MADE THE CROPPING GO OUT OF
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
