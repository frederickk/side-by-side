/**!
 * Side-by-Side
 * side-by-side.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kenfrederick.de/
 * http://blog.kenfrederick.de/
 *
 */

const Split = require('split.js')
const SplitPane = require('split-pane');
const Utils = require('utils');



// ------------------------------------------------------------------------
//
// Properties
//
// ------------------------------------------------------------------------
/**
 * Prefix for classes/IDs/localStorage
 * @private {string}
 */
const prefix_ = '--sbs-';

/**
 * Default width of gutter
 * @private {number}
 */
const width_ = 6;

/**
 * Default height of inputs
 * @private {number}
 */
const height_ = 42;

/**
 * Menu items for options menu
 * @private {Array}
 */
const optionsMenuItems_ = ['swap', 'flip', 'add'];
// const optionsMenuItems_ = ['swap', 'flip', 'add', 'share', 'distribute'];



class SideBySide {
  constructor() {
    /**
     * Container for holding frames
     * @private {Element}
     */
    this.container_ = document.querySelector('#container');

    /**
     * The orientation of the frames, left/right, top/bottom
     * @private {string}
     */
    this.orientation_ = 'vertical';
    // this.orientation_ = localStorage.getItem(`${prefix_}orientation`) || 'horizontal';

    /**
     * Load array of frame (URLs)
     * @private {Array}
     */
    this.panes_ = Utils.loadArray(`${prefix_}pane`);

    // Create/inject panes into #container
    this.createPanes_();

    // Set orientation of frames
    this.setOrientation(this.orientation_);

    // Add event listeners to key DOM elements
    this.attach_();
  }

  /**
   * [createPanes_ description]
   * @return {[type]} [description]
   */
  createPanes_() {
    // To be safe, clear everything from container and start fresh
    this.container_.innerHTML = '';

    if (this.panes_.length === 1) {
      // this.panes_ should have a length of 2, so add an empty value
      this.panes_ = this.panes_.concat([null]);
    } else if (this.panes_.length <= 0) {
      this.panes_ = [null, null];
    }

    this.panes_.forEach(url => {
      this.add(url);
    });

    // After the panes are created, inject the .gutter
    this.createGutter_();
  }

  /**
   * Instantiate Split class to handle window dividing
   * @private
   */
  createGutter_() {
    let gutter;

    // If a gutter(s) already exists, remove it(them).
    this.adjustGutters_(gutter => {
      gutter.parentElement.removeChild(gutter);
    });

    const split = new Split([...document.querySelectorAll('.split')], {
      gutterSize: width_,
      cursor: 'col-resize',
      direction: this.orientation_,
    });

    // create options menu within gutter
    this.adjustGutters_(gutter => {
      gutter.addEventListener('mouseover', this.gutterMouseoverHandler_, false);
      gutter.addEventListener('mouseout', this.gutterMouseoutHandler_, false);
      this.createOptions_(gutter);
    });
  }

  /**
   * Create options menu items
   * @param  {[type]} parent [description]
   */
  createOptions_(parent) {
    let optionsMenu = document.createElement('ul');
    optionsMenu.classList.add('options-menu');

    optionsMenuItems_.forEach(str => {
      let item = document.createElement('li');
      item.classList.add('menu-item', `${str}`, 'material-icons');

      let icon = document.createElement('i');
      icon.classList.add('material-icons');

      // item.innerHTML = str;
      // TODO(frederickk): fix this sloppiness, although it might not semantically
      // make sense, erhpas the optionsMenuItems_ array should be a list of
      // valid icon names e.g. ['view_agenda', 'swap_horiz', 'open_in_new']
      if (str === 'swap') {
        // icon.innerHTML = 'autorenew';
        // icon.innerHTML = 'vertical_align_center';
        icon.innerHTML = 'view_agenda';
        item.addEventListener('click', this.swapOrientation.bind(this), false);
      } else if (str === 'flip') {
        icon.innerHTML = 'swap_horiz';
        // icon.innerHTML = 'flip';
        item.addEventListener('click', this.flipButtonHandler_.bind(this), false);
      } else if (str === 'add') {
        icon.innerHTML = 'add';
        item.addEventListener('click', this.addButtonHandler_.bind(this), false);
      } else if (str === 'share') {
        // icon.innerHTML = 'share';
        // icon.innerHTML = 'web';
        icon.innerHTML = 'open_in_new';
        item.addEventListener('click', this.shareButtonHandler_.bind(this), false);
      }

      item.appendChild(icon);
      optionsMenu.appendChild(item);
    });

    parent.appendChild(optionsMenu);
  }

  /**
   * Loop through all gutters and use callback to adjust individually
   * @private
   * @param  {Function} callback
   * @param  {string}   [selector='.gutter']
   */
  adjustGutters_(callback, selector='.gutter') {
    let gutter;

    try {
      gutter = document.querySelectorAll(selector);
      gutter.forEach(item => {
        callback(item);
      });
    } catch(err) {
      // console.warn('⚠️ Gutter Error:', err);
    }
  }

  /**
   * Create a random string to use as ID's for <iframe>
   * @return {string}
   */
  createID_() {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Add a frame
   * @param {string} url
   */
  add(url) {
    const id = this.createID_();
    const selector = `${prefix_}${id}`;

    // Create pane and add to parent (.container)
    let pane = new SplitPane();
    pane.create(this.container_, selector);

    // Load pane with content
    Utils.load(`#frame-${selector}`, url, false);
  }

  /**
   * TODO(frederickk)
   */
  remove() {
  }

  /**
   * Set orientation of frames
   */
  setOrientation(orientation) {
    if (orientation === 'horizontal') {
      this.container_.classList.add('split-horizontal');
      this.container_.classList.remove('split-vertical');
    } else {
      this.container_.classList.remove('split-horizontal');
      this.container_.classList.add('split-vertical');
    }
    localStorage.setItem(`${prefix_}${orientation}`, orientation);

    // Update gutter orientation, i.e. re-create gutter
    this.createGutter_();

    // Update pane sizes to maintain proportions set by user before swapping
    // orientation
    document.querySelectorAll('.split').forEach(pane => {
      if (orientation == 'horizontal') {
        pane.style.width = pane.style.height;
        pane.style.height = '';
      } else {
        pane.style.height = pane.style.width;
        pane.style.width = '';
      }
    });
  }

  /**
   * Toggle orientation of frames  top/bottom <--> left/right
   */
  swapOrientation() {
    if (this.orientation_ === 'horizontal') {
      this.orientation_ = 'vertical';
    } else {
      this.orientation_ = 'horizontal';
    }

    this.setOrientation(this.orientation_);
  }

  /**
   * [flipPlacement_ description]
   * @param  {Element} element
   * @return {[type]}         [description]
   */
  flipPlacement_(element) {
    const previous = element.previousSibling;
    const next = element.nextSibling;

    element.after(previous);
    element.before(next);
  }



  // ------------------------------------------------------------------------
  //
  // Events
  //
  // ------------------------------------------------------------------------
  /**
   * Attach event listeners to verious DOM elements
   * @private
   */
  attach_() {
    window.addEventListener('onpaneload', event => {
      let srcArray = [];
      document.querySelectorAll('iframe').forEach(iframe => {
        srcArray.push(iframe.src);
      });

      Utils.saveArray(`${prefix_}pane`, srcArray);
    });

    // TODO(frederickk): fix the frame busting!
    // http://stackoverflow.com/questions/958997/frame-buster-buster-buster-code-needed
    // window.onbeforeunload = () => {
    //   document.body.dataset.reloaded++;
    //   console.warn(document.body.dataset.reloaded);
    // };
    // setInterval(() => {
    //
    //   if (parseInt(document.body.dataset.reloaded) > 0) {
    //     document.body.dataset.reloaded -= 2;
    //     // window.top.location = 'http://example.org/page-which-responds-with-204';
    //
    //     alert(`onbeforeunload ${document.body.dataset.reloaded}`);
    //
    //     for (let i = 0; i < window.frames.length; i++) {
    //       console.warn(i);
    //       window.frames[i].setAttribute('sandbox', '');
    //       window.frames[i].stop();
    //       console.log(window.frames[i]);
    //       window.stop();
    //       // clearInterval(frameBustBust);
    //     }
    //   }
    // }, 1);
  }

  /**
   * Handler for gutter on mouseover
   * @private
   * @param  {Event} event
   */
  gutterMouseoverHandler_(event) {
    const threshold = height_ * optionsMenuItems_.length;

    if (this.classList.contains('gutter-horizontal') && event.clientY <= threshold) {
      this.style.width = `${height_}px`;
    } else if (this.classList.contains('gutter-vertical') && event.clientX <= threshold) {
      this.style.height = `${height_}px`;
    }
  }

  /**
   * Handler for gutter on mouseout
   * @private
   * @param  {Event} event
   */
  gutterMouseoutHandler_(event) {
    if (this.classList.contains('gutter-horizontal')) {
      this.style.width = `${width_}px`;
    } else if (this.classList.contains('gutter-vertical')) {
      this.style.height = `${width_}px`;
    }
  }

  /**
   * Handler for flipping the placement of two adjacent <iframes>
   * @private
   * @param  {Event} event
   */
  flipButtonHandler_(event) {
    this.flipPlacement_(event.target.closest('.gutter'));
  }

  /**
   * Handler for adding additional split pane
   * @private
   * @param  {Event} event
   */
  addButtonHandler_(event) {
    this.panes_.push('');
    this.createPanes_();
  }

  /**
   * Handler for opening split as shareable live URL
   * @private
   * @param  {Event} event
   */
  shareButtonHandler_(event) {
  }


}


module.exports = SideBySide;
