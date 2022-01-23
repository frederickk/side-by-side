Side|Side
==============

## Load sites—side by side

**v0.7.0**

[Install Extension for Chrome](https://chrome.google.com/webstore/detail/side-by-side/bobidkladfnoamglfgpnllbkhjlhjlfb)

[Install AddOn for Firefox](https://addons.mozilla.org/de/firefox/addon/side-side/)

![adjust](assets/side-by-side_chrome_adjust.gif)

**Options**

A discrete options menu is located at the top (or left, depending on orientation) which allows the user to rotate the orientation, flip the position of panes, or add panes.

![options](assets/side-by-side_chrome_options.gif)

| Rotate orientation of panes—left/right or top/bottom.       | Flip position of panes.                              | Add a pane.                                        |
| :------------------------------------------------------------: | :----------------------------------------------------: | :--------------------------------------------------: |
| ![Orientation](assets/side-by-side_chrome_options_orientation-crop.png) | ![Flip](assets/side-by-side_chrome_options_flip-crop.png) | ![Add](assets/side-by-side_chrome_options_add-crop.png) |



### Build

| Command                   | Description                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------|
| `$ npm run dev`           | Spin up Webpack watch task and development server ([0.0.0.0:1112](http://0.0.0.0:1112)) |
| `$ npm run build`         | Compile (and uglify) necessary files                                                    |
| `$ npm run build:all`     | Compile (and uglify) necessary files into .zip (Chrome) and .zip (Firefox)              |
| `$ npm run build:chrome`  | Compile (and uglify) necessary files into .zip only for Chrome                          |
| `$ npm run build:firefox` | Compile (and uglify) necessary files into .zip only for Firefox                         |


### Issues, Bugs, TODOs

All TODOs, features, and bugs are tracked within [issues](https://github.com/frederickk/side-by-side/issues/).
