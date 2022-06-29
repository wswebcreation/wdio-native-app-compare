OUTPUT
======
Below the output in real format and sizes

## Save output
### saveElement
#### IOS
```js
browser.saveElement($('~selector'), 'saveElement');
```
![iOS Logo](./assets/saveelement-iphone_x.png)

##### With positive resizeDimensions
```js
browser.saveElement(
    $('~selector'),
    'saveElement-positive-resized',
    {
        resizeDimensions: {
          top: 200,
          right: 20,
          bottom: 100,
          left: 40
        }
    }
);
```
![Android Logo](./assets/saveelement-positive-resized-iphone_x.png)

##### With negative resizeDimensions
```js
browser.saveElement(
    $('~selector'),
    'saveElement-negative-resized',
    {
        resizeDimensions: {
          top: -40,
          right: -20,
          bottom: -70,
          left: -250
        }
    }
);
```
![Android Logo](./assets/saveelement-negative-resized-iphone_x.png)

---

#### ANDROID
```js
browser.saveElement($('~selector'), 'saveElement');
```
![Android Logo](./assets/saveelement-pixel_8.1.png)

##### With positive resizeDimensions
```js
browser.saveElement(
    $('~selector'),
    'saveElement-positive-resized',
    {
        resizeDimensions: {
          top: 200,
          right: 20,
          bottom: 100,
          left: 40
        }
    }
);
```
![Android Logo](./assets/saveelement-positive-resized-pixel_8.1.png)

##### With negative resizeDimensions
```js
browser.saveElement(
    $('~selector'),
    'saveElement-negative-resized',
    {
        resizeDimensions: {
          top: -40,
          right: -20,
          bottom: -70,
          left: -250
        }
    }
);
```
![Android Logo](./assets/saveelement-negative-resized-pixel_8.1.png)

### saveScreen
```js
driver.saveScreen('saveScreen');
```
#### IOS
![iOS Home](./assets/savescreen-iphone_x.png)

---

#### ANDROID
![Android Home](./assets/savescreen-pixel_8.1.png)

## Check output on failure
### compareElement
#### IOS
```js
driver.compareElement($('~selector'), 'compareElement');
```
![iOS Logo diff](./assets/compareelement-iphone_x.png)

---

#### ANDROID
```js
driver.compareElement($('~selector'), 'compareElement');
```
![Android Logo diff](./assets/compareelement-pixel_8.1.png)

### compareScreen
#### IOS
```js
driver.compareScreen('compareScreen');
```
![iOS Home diff](./assets/comparescreen-iphone_x.png)

---

#### ANDROID
```js
driver.compareScreen('compareScreen');
```
![Android Home diff](./assets/comparescreen-pixel_8.1.png)

## Block outs
>**Blockouts are only added on comparison, and are not saved in the actual images.They will be only shown when a difference is there and they can be found in the `diff`-folder**

### blockOuts
```js
driver.compareScreen(
  'compareScreen-blockOuts',
  {
    blockOuts: [
      // block out area 1
      {
        height: 100,
        width: 100,
        x: 250,
        y: 900,
      },
      // block out area 2
      {
        height: 25,
        width: 75,
        x: 50,
        y: 400,
      },
    ],
  },
);
```

#### IOS
![iOS blockOuts](./assets/comparescreen-blockouts-iphone_x.png)

---

#### ANDROID
![Android blockOuts](./assets/comparescreen-blockouts-pixel_8.1.png)

### elementBlockOuts
```js
driver.compareScreen(
  'compareScreen-elementBlockOuts',
  {
    elementBlockOuts: [
      // block out element 1
      { element: $('~selector') },
      // block out element 2 (shorthand) with margin
      {
        element: $('~selector-2'),
        margin: 50,
      },
    ],
  },
);
```

#### IOS
![iOS elementBlockOuts](./assets/comparescreen-elementblockouts-iphone_x.png)

---

#### ANDROID
![Android elementBlockOuts](./assets/comparescreen-elementblockouts-pixel_8.1.png)

### blockOutStatusBar || blockOutNavigationBar || blockOutIphoneHomeBar
```js
driver.compareScreen(
  'compare-home-screen-element-blockouts',
  {
    blockOutStatusBar: true,
    blockOutNavigationBar: true,
    blockOutIphoneHomeBar: true,
  },
);
```

#### IOS
![iOS blockOutStatusBar](./assets/comparescreen-status-tool-home-blockout-iphone_x.png)

---

#### ANDROID
![Android blockOutStatusBar](./assets/comparescreen-status-tool-home-blockout-pixel_8.1.png)
