/**!
 * Side-by-Side
 * content-script.js
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

let googMenu;



// -----------------------------------------------------------------------------
//
// Methods
//
// -----------------------------------------------------------------------------
(function() {
  googMenu = document.querySelectorAll('.goog-menu.goog-menu-noaccel');
  // googMenu = document.getElementById('cm-cell');

  console.warn(googMenu);

  googMenu.forEach(function(ele, index) {
    console.warn(ele, ele.visibilityState, index);
    // ele.innerHTML += '<div class="goog-menuitem" name="test" role="menuitem" id="test" style="user-select: none; background-color: #f0f;"><div class="goog-menuitem-content" style="user-select: none;">Test</div></div>';
  });
})();

function open(direction, num) {
  // chr“ome.tabs.query({
  //     active        : true,
  //     currentWindow : true,
  //     highlighted   : true
  // },
  // function(tabs) {
  //     localStorage.setItem(`${prefix}frame0`,    String(tabs[0].url));
  //     localStorage.setItem(`${prefix}direction`, direction);
  //     localStorage.setItem(`${prefix}number`,    num);
  // });
  // chrome.tabs.create({
  //     url: './index.html'
  // });”
}

function defaultMenus() {
  return [
    // chrome.contextMenus.create({
    //     type     : 'normal',
    //     id       : 'open-horizontal',
    //     title    : chrome.i18n.getMessage('menuHorizontal'),
    //     parentId : parent,
    //     onclick  : function() {
    //         open('horizontal', 2);
    //     }
    // }),
    // chrome.contextMenus.create({
    //     type     : 'normal',
    //     id       : 'open-vertical',
    //     title    : chrome.i18n.getMessage('menuVertical'),
    //     parentId : parent,
    //     onclick  : function() {
    //         open('vertical', 2);
    //     }
    // })
  ];
}
