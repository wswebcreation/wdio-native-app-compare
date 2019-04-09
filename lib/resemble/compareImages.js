import * as resemble from './resemble'

/**
 * Compare the 2 images with ResembleJS
 *
 * @param image1
 * @param image2
 * @param options
 *
 * @return {Promise<object>}
 */
export function compareImages(image1, image2, options) {
    return new Promise((resolve, reject) => {
        resemble.compare(image1, image2, options, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}
