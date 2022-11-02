export {}

declare global {
    namespace WebdriverIO {
        interface ServiceOption extends PluginOptions {}

        interface Browser {
            /**
             * Saves an image of an element
             */
            saveElement(
                element: Element,
                tag: string,
                options?: SaveElementMethodOptions
            ): Promise<SaveMethodOutput>

            /**
             * Saves an image of a screen
             */
            saveScreen(tag: string): Promise<SaveMethodOutput>

            /**
             * Compare an image of an element
             */
            compareElement(
                element: Element,
                tag: string,
                options?: CompareElementMethodOptions
            ): Promise<CompareMethodOutput>

            /**
             * Compares an image of a screen
             */
            compareScreen(
                tag: string,
                options?: CompareScreenMethodOptions
            ): Promise<CompareMethodOutput>
        }

        interface Element {}
    }
}

interface PluginOptions extends CompareOptions, CompareScreenOptions {
    baselineFolder?: string
    screenshotPath?: string
    autoSaveBaseline?: boolean
    debug?: boolean
    imageNameFormat?: string
    savePerDevice?: boolean
}

interface SaveElementMethodOptions {
    resizeDimensions?: ResizeDimensions
}

interface CompareElementMethodOptions extends CompareOptions {
    resizeDimensions?: ResizeDimensions
}

interface CompareScreenMethodOptions
    extends CompareOptions,
        CompareScreenOptions {
    elementBlockOuts?: ElementBlockOuts[]
}

interface CompareOptions {
    blockOuts?: Blockouts[]
    ignoreAlpha?: boolean
    ignoreAntialiasing?: boolean
    ignoreColors?: boolean
    ignoreLess?: boolean
    ignoreNothing?: boolean
    ignoreTransparentPixel?: boolean
    largeImageThreshold?: number
    rawMisMatchPercentage?: boolean
    saveAboveTolerance?: number
}

interface CompareScreenOptions {
    blockOutStatusBar?: boolean
    blockOutIphoneHomeBar?: boolean
    blockOutNavigationBar?: boolean
}

interface ResizeDimensions {
    top?: number
    right?: number
    bottom?: number
    left?: number
}

interface Blockouts {
    height: number
    width: number
    x: number
    y: number
}

interface ElementBlockOuts {
    element: WebdriverIO.Element | WebdriverIO.Element[]
    margin?: number
    elementNumber?: number
}

interface SaveMethodOutput {
    fileName: string
    folders: {
        actual: string
    }
}

interface CompareMethodOutput {
    fileName: string
    folders: {
        actual: string
        baseline: string
        diff: string
    }
    misMatchPercentage: number
    baselineImageCreated: boolean
}
