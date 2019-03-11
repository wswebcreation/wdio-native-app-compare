// import { pathExistsSync, removeSync } from 'fs-extra'
// import { join } from 'path'
// import { getAndCreatePath } from '../lib/helpers/utils'
//
// describe('Utils', () => {
//     describe('getAndCreatePath', () => {
//         const folder = join(process.cwd(), '/.tmp/utils')
//         const capabilities = {
//             capabilities: {
//                 alwaysMatch: {
//                     deviceName: 'iPhone_X',
//                     platformName: 'iOS',
//                     platformVersion: '12.1',
//                     orientation: 'PORTRAIT',
//                     app:
//                         '/Users/wimselles/Sauce/Git/wdio-native-app-compare-test/apps/iOS-Simulator-NativeDemoApp-0.2.1.app.zip',
//                     noReset: true,
//                     newCommandTimeout: 240,
//                 },
//                 firstMatch: [ {} ],
//             },
//             desiredCapabilities: {
//                 deviceName: 'iPhone_X',
//                 platformName: 'iOS',
//                 platformVersion: '12.1',
//                 orientation: 'PORTRAIT',
//                 app: '/Users/wimselles/Sauce/Git/wdio-native-app-compare-test/apps/iOS-Simulator-NativeDemoApp-0.2.1.app.zip',
//                 noReset: true,
//                 newCommandTimeout: 240,
//             },
//         }
//
//         afterEach(() => removeSync(folder))
//
//         it('should create the folder and return the folder name for a device that needs to have it\'s own folder', () => {
//             const expectedFolderName = join(folder, capabilities.desiredCapabilities.deviceName)
//
//             expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
//             expect(getAndCreatePath(folder, capabilities, true)).toEqual(expectedFolderName)
//             expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
//         })
//
//         // it('should create the folder and return the folder name for a browser that needs to have it\'s own folder', () => {
//         //     const options = {
//         //         browserName: 'browser',
//         //         deviceName: '',
//         //         isMobile: false,
//         //         savePerInstance: true,
//         //     };
//         //     const expectedFolderName = join(folder, `desktop_${ options.browserName }`)
//         //
//         //     expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
//         //     expect(getAndCreatePath(folder, options)).toEqual(expectedFolderName)
//         //     expect(pathExistsSync(expectedFolderName)).toMatchSnapshot()
//         // })
//         //
//         // it('should create the folder and return the folder name for a browser', () => {
//         //     const options = {
//         //         browserName: 'browser',
//         //         deviceName: '',
//         //         isMobile: false,
//         //         savePerInstance: false,
//         //     }
//         //
//         //     expect(pathExistsSync(folder)).toMatchSnapshot()
//         //     expect(getAndCreatePath(folder, options)).toEqual(folder)
//         //     expect(pathExistsSync(folder)).toMatchSnapshot()
//         // });
//     })
// })
