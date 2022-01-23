import {contextMenus, i18n, Menus, tabs, webRequest} from 'webextension-polyfill';
import {prefix} from './defs';
import {loadArray, saveArray} from './utils';

// URL matching patterns.
const URLS: Array<string> = [
  '*://*/*'
];

webRequest.onHeadersReceived.addListener(info => {
  const headers = info.responseHeaders;
  let header: any;

  for (let i = headers.length - 1; i >= 0; --i) {
    header = headers[i].name.toLowerCase();
    if (header === 'x-frame-options' || header === 'frame-options') {
      headers.splice(i, 1); // Remove header
    }
  }
  return {
    responseHeaders: headers,
  }
}, {
  urls: URLS,
  types: ['sub_frame'],
  // }, ['blocking', 'responseHeaders']);
});

// runtime.onStartup.addListener(() => {
  // createContextMenu();
// });

contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'open-horizontal') {
    open('horizontal');
  } else if (info.menuItemId === 'open-vertical') {
    open('vertical');
  }
});

/**
 * Opens the side by side HTML.
 */
const open = (orientation: string) => {
  tabs.query({
    active: true,
    currentWindow: true,
    // highlighted: true
  }).then(tabs => {
    const panes = loadArray(`${prefix}pane`);

    return [String(tabs[0].url), ...panes];
  }).then(panes => {
    let len = panes.length;
    if (len > 1) {
      panes.splice(len);
    }

    saveArray(`${prefix}pane`, panes);
    localStorage.setItem(`${prefix}orientation`, orientation);
  }, (error) => {
    console.error('Side|Side background.js Error: open', error);
  })

  tabs.create({
    url: './index.html'
  });
}

// https://bugs.chromium.org/p/chromium/issues/detail?id=1268098
/**
 * Returns localized string from _locales based on given key.
 */
const localized = (key: string): string => {
  try {
    return i18n.getMessage(key);
  } catch(_err: any) {
    return key;
  }
};

/**
 * Creates context menu.
 */
const createContextMenu = (): Array<any> => {
  const contextMenuItems: Array<any> = [];
  const allContexts: Menus.ContextType[] = [
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

  const parent = contextMenus.create({
    contexts: allContexts,
    documentUrlPatterns: URLS,
    id: `${prefix}menu`,
    // title: localized('extName'),
    title: localized('Side|Side'),
  });

  contextMenuItems.push(parent);
  contextMenuItems.push(contextMenus.create({
    contexts: allContexts,
    id: 'open-horizontal',
    parentId: parent,
    // title: localized('gutterHorizontal'),
    title: localized('Open with left/right split'),
    type: 'normal',
  }));
  contextMenuItems.push(contextMenus.create({
    contexts: allContexts,
    id: 'open-vertical',
    parentId: parent,
    // title: localized('gutterVertical'),
    title: localized('Open with top/bottom split'),
    type: 'normal',
  }));

  return contextMenuItems;
}

createContextMenu();