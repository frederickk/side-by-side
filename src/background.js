/*
 * Side-by-Side
 * background.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kennethfrederick.de/
 * http://blog.kennethfrederick.de/
 *
 */


// -----------------------------------------------------------------------------
//
// Properties
//
// -----------------------------------------------------------------------------
var prefix = '--sbs-';
var urls = [
    'file://*',
    'http://*/*',
    'https://*/*'
];
var chromeUrl = [
    'chrome-extension://*/*'
];

var parent = chrome.contextMenus.create({
    title               : chrome.i18n.getMessage('extName'),
    documentUrlPatterns : urls
});

var menuItems = defaultMenus();



// -----------------------------------------------------------------------------
//
// Methods
//
// -----------------------------------------------------------------------------
function open(direction, num) {
    chrome.tabs.query({
        active        : true,
        currentWindow : true,
        highlighted   : true
    },
    function(tabs) {
        localStorage.setItem(prefix + 'frame0',    String(tabs[0].url));
        localStorage.setItem(prefix + 'direction', direction);
        localStorage.setItem(prefix + 'number',    num);
    });
    chrome.tabs.create({
        url: './index.html'
    });
}


// -----------------------------------------------------------------------------
function defaultMenus() {
    return [
        chrome.contextMenus.create({
            type     : 'normal',
            id       : 'open-horizontal',
            title    : chrome.i18n.getMessage('menuHorizontal'),
            parentId : parent,
            onclick  : function() {
                open('horizontal', 2);
            }
        }),
        chrome.contextMenus.create({
            type     : 'normal',
            id       : 'open-vertical',
            title    : chrome.i18n.getMessage('menuVertical'),
            parentId : parent,
            onclick  : function() {
                open('vertical', 2);
            }
        })
    ];
}



// -----------------------------------------------------------------------------
//
// Events
//
// -----------------------------------------------------------------------------
// http://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension
chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i = headers.length-1; i >= 0; --i) {
            var header = headers[i].name.toLowerCase();
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
