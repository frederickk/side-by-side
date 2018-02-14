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


// -----------------------------------------------------------------------------
//
// Properties
//
// -----------------------------------------------------------------------------
const prefix = '--sbs-';
const urls = [
  '*://*/*'
];
const chromeUrl = [
  'chrome-extension://*/*'
];

let contextMenuItems = [];



// -----------------------------------------------------------------------------
//
// Methods
//
// -----------------------------------------------------------------------------
(function() {
  createContextMenu();
})();

function open(direction, num) {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
    highlighted: true
  },
  (tabs) => {
    localStorage.setItem(`${prefix}frame0`,    String(tabs[0].url));
    localStorage.setItem(`${prefix}direction`, direction);
    localStorage.setItem(`${prefix}number`,    num);
  });
  chrome.tabs.create({
    url: './index.html'
  });
}


// -----------------------------------------------------------------------------
function createContextMenu() {
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
  contextMenuItems = [];

  let parent = chrome.contextMenus.create({
    title               : chrome.i18n.getMessage('extName'),
    documentUrlPatterns : urls,
    contexts            : allContexts
  });
  contextMenuItems.push(parent);

  contextMenuItems.push(chrome.contextMenus.create({
    type     : 'normal',
    id       : 'open-horizontal',
    title    : chrome.i18n.getMessage('menuHorizontal'),
    parentId : parent,
    contexts : allContexts,
    onclick  : function() {
      open('horizontal', 2);
    }
  }));
  contextMenuItems.push(chrome.contextMenus.create({
    type     : 'normal',
    id       : 'open-vertical',
    title    : chrome.i18n.getMessage('menuVertical'),
    parentId : parent,
    contexts : allContexts,
    onclick  : function() {
      open('vertical', 2);
    }
  }));

  return contextMenuItems;
}



// -----------------------------------------------------------------------------
//
// Events
//
// -----------------------------------------------------------------------------
// http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension
chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
    const headers = info.responseHeaders;
    let header;

    for (let i = headers.length - 1; i >= 0; --i) {
      header = headers[i].name.toLowerCase();
      if (header == 'x-frame-options' || header == 'frame-options') {
        headers.splice(i, 1); // Remove header
      }
    }
    return {
      responseHeaders : headers
    };
  },
  {
    urls  : [
      '*://*/*'
    ],
    types : [
      'sub_frame'
    ]
  },
  ['blocking', 'responseHeaders']
);
