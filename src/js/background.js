/**!
 * Side-by-Side
 * background.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kenfrederick.de/
 * http://blog.kenfrederick.de/
 *
 */

const defs = require('defs');
const Utils = require('utils');



class Background {
  constructor() {
    /**
     * URL matching patterns
     * @private {Array}
     */
    this.urls_ = [
      '*://*/*'
    ];

    /**
     * Chrome specific URL matching patterns
     * @type {Array}
     */
    this.chromeUrl_ = [
      'chrome-extension://*/*'
    ];

    /**
     * Context menu items array
     * @type {Array}
     */
    this.contextMenuItems_ = [];

    // Create context menu
    this.createContextMenu_();

    // Attach event listeners
    this.attach_();
  }

  /**
   * Open the side by side HTML
   * @private
   * @param  {string} orientation
   */
  open_(orientation) {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
      highlighted: true
    },
    tabs => {
      let panes = Utils.loadArray(`${defs.prefix}pane`);
      let len = panes.length;
      panes = [String(tabs[0].url), ...panes];
      if (panes.length > 1) {
        panes.splice(len);
      }

      Utils.saveArray(`${defs.prefix}pane`, panes);
      localStorage.setItem(`${defs.prefix}orientation`, orientation);
    });
    chrome.tabs.create({
      url: './index.html'
    });
  }

  /**
   * Create context menu
   * @private
   * @return {Array}
   */
  createContextMenu_() {
    // chrome.contextMenus.removeAll();
    let allContexts = [
      'page',
      'frame',
      'selection',
      'editable',
      'image',
      'video',
      'audio',
      'browser_action',
      'page_action'
    ];
    this.contextMenuItems_ = [];

    let parent = chrome.contextMenus.create({
      title: chrome.i18n.getMessage('extName'),
      documentUrlPatterns: this.urls_,
      contexts: allContexts,
    });
    this.contextMenuItems_.push(parent);

    this.contextMenuItems_.push(chrome.contextMenus.create({
      type: 'normal',
      id: 'open-horizontal',
      title: chrome.i18n.getMessage('gutterHorizontal'),
      parentId: parent,
      contexts: allContexts,
      onclick: () => {
        this.open_('horizontal');
      },
    }));

    this.contextMenuItems_.push(chrome.contextMenus.create({
      type: 'normal',
      id: 'open-vertical',
      title: chrome.i18n.getMessage('gutterVertical'),
      parentId: parent,
      contexts: allContexts,
      onclick: () => {
        this.open_('vertical');
      },
    }));

    return this.contextMenuItems_;
  }



  // -----------------------------------------------------------------------------
  //
  // Events
  //
  // -----------------------------------------------------------------------------
  attach_() {
    // http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension
    chrome.webRequest.onHeadersReceived.addListener(info => {
      const headers = info.responseHeaders;
      let header;

      for (let i = headers.length - 1; i >= 0; --i) {
        header = headers[i].name.toLowerCase();
        if (header == 'x-frame-options' || header == 'frame-options') {
          headers.splice(i, 1); // Remove header
        }
      }
      return {
        responseHeaders: headers,
      };
    }, {
      urls: ['*://*/*'],
      types: ['sub_frame'],
    }, ['blocking', 'responseHeaders']);
  }
}


module.exports = Background;


new Background();
