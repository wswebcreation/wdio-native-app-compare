# Methods
This tool will add 4 methods to the WebdriverIO `browser`-object that can be used during tests.

## Save methods
The save methods return an object like this:

```json
{
    "fileName": "your-tag-name-iphone_8-ios-11.4.png",
    "folders": {
        "actual": "/Users/wswebcreation/wdio-native-app-compare/.tmp/image-compare/actual/iphone_8"
    }
}

Based on this info the file name can be determined and also where it can be found

### saveElement
With this method you can create a screenshot of an element in the view. You'll need to provide the following options

#### `element`
- **Type:** `object`
- **Mandatory:** Yes

Provide the element, so **NOT** the selector, like for example

```js
// Default
browser.saveElement(browser.element('~your-accessibility-id'), 'name-of-your-file');

// Shorthand
browser.saveElement($('~your-accessibility-id'), 'name-of-your-file');
```

#### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
browser.saveElement($('~your-accessibility-id'), 'name-of-your-file');
```

> **The major release will also hold options to resize dimensions, meaning that you provide options to make an element screenshot bigger by adding extra paddings to the initial element**

### saveScreen
With this method you can create a screenshot of the view. You'll need to provide the following options

#### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
browser.saveScreen('name-of-your-file');
```

## Compare methods
The compare methods return an object like this:

```json
{
    "fileName": "your-tag-name-iphone_8-ios-11.4.png",
    "folders": {
        "actual": "/Users/wswebcreation/wdio-native-app-compare/.tmp/image-compare/actual/iphone_8",
        "baseline": "/Users/wswebcreation/wdio-native-app-compare/__tests__/e2e/image-baseline/iphone_8",
        "diff": "/Users/wswebcreation/wdio-native-app-compare/.tmp/image-compare/diff/iphone_8"
    },
    "misMatchPercentage": 0
}
```

Based on this info the `misMatchPercentage` can be determined, how is is called and also where it can be found

### compareElement
With this method you can compare a screenshot of an element in the view with a baseline image. **It will return a mismatch percentage between the actual element screenshot and the baseline.**
You'll need to provide the following options

#### `element`
- **Type:** `object`
- **Mandatory:** Yes

Provide the element, so **NOT** the selector, like for example

```js
// Default
browser.compareElement(browser.element('~your-accessibility-id'), 'name-of-your-file');

// Shorthand
browser.compareElement($('~your-accessibility-id'), 'name-of-your-file');
```

#### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
expect(browser.compareElement($('~your-accessibility-id'), 'name-of-your-file')).toEqual(0);
```

#### `options`
- **Type:** `Object`
- **Mandatory:** no

You can provide an object with the following options, see [options](./OPTIONS.md#method-options) for details

```js
expect(browser.compareElement(
    '~your-accessibility-id',
    'name-of-your-file',
    {
        //.. options here
    },
).misMatchPercentage).toEqual(0);
```

### compareScreen
With this method you can compare a screenshot of the view with a baseline image. **It will return a mismatch percentage between the actual screenshot and the baseline.**
You'll need to provide the following options

#### `tag`
- **Type:** `String`
- **Mandatory:** Yes

The `tag` is the part that is used for determining the image name when it is saved

```js
expect(browser.compareScreen('name-of-your-file').misMatchPercentage).toEqual(0);
```

#### `options`
- **Type:** `Object`
- **Mandatory:** no

You can provide an object with the following options, see [options](./OPTIONS.md#method-options) for details

```js
expect(browser.compareElement(
    '~your-accessibility-id',
    'name-of-your-file',
    {
        //.. options here
    },
)).toEqual(0);
```
