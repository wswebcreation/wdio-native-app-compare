/**
 * TODO:
 * - Verify it actually works correctly ;)
 * - Add options to change timeout times for retries and for basline matches
 * - Fix undef errors for WebdriverIO
 * - Get typings to work
 * - Add unit tests
 * - Add documentation
 **/
/* eslint-disable no-undef */

import { rmSync } from 'fs'
import { join } from 'path'
import { expect } from 'expect'

export function addToMatchAppImageSnapshotMatcher() {
    expect.extend({
        toMatchAppImageSnapshot(actual, tag) {
            if (
                !(actual instanceof WebdriverIO.Element) &&
                !(actual instanceof WebdriverIO.Browser)
            ) {
                throw new Error(
                    'Actual value must be a WebdriverIO browser or element instance.'
                )
            }

            return browser.call(async () => {
                console.log('!! inside browser call')

                const result = await performSnapshot(actual, tag)

                try {
                    if (result.baselineImageCreated === false) {
                        // Existing baseline, keep checking until snapshot matches baseline or timeout is reached
                        await waitUntilImageMatch(actual, tag)
                    } else {
                        // New baseline, keep checking until AUT is static for multiple intervals or timeout is reached
                        await waitUntilBaselineCreated(actual, tag)
                    }
                } catch (error) {
                    return { pass: false, message: () => error.message }
                }

                return {
                    pass: true,
                    message: () =>
                        result.baselineImageCreated
                            ? 'Expected baseline creation to fail, but it passed.'
                            : 'Expected image not to match, but it did.',
                }
            })
        },
    })
}

async function waitUntilImageMatch(actual, tag) {
    let misMatchPercentage
    await browser.waitUntil(
        async () => {
            misMatchPercentage = (await performSnapshot(actual, tag))
                .misMatchPercentage
            if (misMatchPercentage === 0) {
                return true
            }
            return false
        },
        {
            timeoutMsg: `No image match before timeout! Mismatchpercentage: ${misMatchPercentage}.`,
        }
    )
}

async function waitUntilBaselineCreated(actual, tag) {
    let count = 0
    let baselineFilename
    try {
        await browser.waitUntil(
            async () => {
                const result = await performSnapshot(actual, tag)
                baselineFilename = join(
                    result.folders.baseline,
                    result.fileName
                )
                if (result.misMatchPercentage !== 0) {
                    rmSync(baselineFilename)
                    count = 0
                }
                if (count === 5) {
                    return true
                }
                count++
                return false
            },
            {
                interval: 1000,
                timeoutMsg:
                    'Application under test did not reach a static state before timeout! No new baseline created.',
            }
        )
    } catch (error) {
        if (existsSync(baselineFilename)) {
            rmSync(baselineFilename)
        }
        throw error
    }
}

async function performSnapshot(actual, tag) {
    let result
    if (actual instanceof WebdriverIO.Element) {
        result = await browser.compareElement(actual, tag)
    } else {
        result = await browser.compareScreen(tag)
    }
    return result
}
