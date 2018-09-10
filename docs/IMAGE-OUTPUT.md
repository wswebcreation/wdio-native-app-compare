OUTPUT
======
Below the output in real format and sizes

## Save output
### saveElement
#### IOS
![iOS Logo](./assets/baseline/logo-iphone_8.png)

---

#### ANDROID
![Android Logo](./assets/baseline/logo-nexus_5_7.1.1.png)

### saveScreen
#### IOS
![iOS Home](./assets/baseline/home-screen-iphone_8.png)

---

#### ANDROID
![Android Home](./assets/baseline/home-screen-nexus_5_7.1.1.png)

## Check output on failure
### checkElement
#### IOS
![iOS Logo diff](./assets/diff/compare-logo-iphone_8.png)

---

#### ANDROID
![Android Logo diff](./assets/diff/compare-logo-nexus_5_7.1.1.png)

### checkScreen
#### IOS
![iOS Home diff](./assets/diff/compare-home-screen-nexus_5_7.1.1.png)

---

#### ANDROID
![Android Home diff](./assets/diff/compare-home-screen-nexus_5_7.1.1.png)

## Block outs
>**Blockouts are only added on comparison, and are not saved in the actual images.They will be only shown when a difference is there and they can be found in the `diff`-folder**

### blockOuts

```js
browser.compareScreen(
  'compare-home-screen-blockouts',
  {
    blockOuts: [
      // block out area 1
      {
        height: 100,
        width: 100,
        x: 50,
        y: 150,
      },
      // block out area 2
      {
        height: 25,
        width: 75,
        x: 200,
        y: 250,
      },
    ],
  },
);
```

#### IOS
![iOS blockOuts](./assets/baseline/compare-home-screen-blockouts-iphone_8.png)

---

#### ANDROID
![Android blockOuts](./assets/baseline/compare-home-screen-blockouts-nexus_5_7.1.1.png)

### elementBlockOuts

```js
device.compareScreen(
  'compare-home-screen-element-blockouts',
  {
    elementBlockOuts: [
      { element: $(logo) },
      {
        element: $(`${TEST_PREFIX}${labels.tabNavigator.webview}`),
        margin: 10,
      },
    ],
  },
);
```

#### IOS
![iOS elementBlockOuts](./assets/baseline/compare-home-screen-element-blockouts-iphone_8.png)

---

#### ANDROID
![Android elementBlockOuts](./assets/baseline/compare-home-screen-element-blockouts-nexus_5_7.1.1.png)

### blockOutStatusBar

```js
device.compareScreen(
  'compare-home-screen-element-blockouts',
  {
    blockOutStatusBar: true,
  },
);
```

#### IOS
![iOS blockOutStatusBar](./assets/baseline/compare-home-screen-disabled-statusbar-iphone_8.png)

---

#### ANDROID
![Android blockOutStatusBar](./assets/baseline/compare-home-screen-disabled-statusbar-nexus_5_7.1.1.png)

### blockOutNavigationBar

```js
device.compareScreen(
  'compare-home-screen-element-blockouts',
  {
    blockOutNavigationBar: true,
  },
);
```

#### ANDROID
![Android blockOutStatusBar](./assets/baseline/compare-home-screen-disabled-status-navigation-bar-nexus_5_7.1.1.png)
