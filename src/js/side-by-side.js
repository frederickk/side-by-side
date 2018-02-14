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


// ------------------------------------------------------------------------
//
// Properties
//
// ------------------------------------------------------------------------
const prefix = '--sbs-';
const ids = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];



class SideBySide {
  constructor(properties={}) {
    /**
     * Container for holding frames
     * @private {Element}
     */
    this.container_ = document.querySelector('#container');

    /**
     * Container for swap button
     * @private {Element}
     */
    this.swapButton_ = document.querySelector('#swap-button');

    /**
     * The orientation of the frames, left/right, top/bottom
     * @private {string}
     */
    this.orientation_ = localStorage.getItem(`${prefix}this.orientation_`) || 'horizontal';

    /**
     * Integer to track of number of frames.
     * @private {number}
     */
    this.count_ = 0;

    /**
     * Array to hold frames
     * @private {Array}
     */
    this.frames_ = [];

    // Add initial number of frames e.g. 2
    this.add(this.orientation_);
    this.add(this.orientation_);

    // Set orientation of frames
    this.setOrientation(this.orientation_);

    // Add event listeners to key DOM elements
    this.attach_();
  }

  // ------------------------------------------------------------------------
  load(index, overwrite) {
    let frame = document.getElementById(`frame${index}`);
    let input = document.getElementById(`input${index}`);
    let stored = localStorage.getItem(`${prefix}frame${index}`);

    if (!overwrite) {
      input.value = (stored)
        ? stored
        : input.value;
    }

    let isValid = this.isValidURL_(input.value);

    if (isValid) {
      this.hasErrorState_(input, false);
      localStorage.setItem(`${prefix}frame${index}`, String(input.value));
    } else {
      this.hasErrorState_(input, true);
      // input.value = (input.value.indexOf('http') > 0 || input.value.indexOf('file') > 0)
      //   ? input.value
      //   : `http://${input.value}`;

      this.request_('GET', input.value).then((response) => {
        this.hasErrorState_(input, false);
        localStorage.setItem(`${prefix}frame${index}`, String(input.value));

      }).catch((err) => {
        this.hasErrorState_(input, false);
      });
    }

    frame.src = (input.value)
      ? input.value
      : '';
    frame.src = frame.src;
  }

  /**
   * Instantiate Split class to handle window dividing
   * @private
   */
  createGutter_() {
    try {
      let gutter = document.querySelector('.gutter');
      gutter.parentElement.removeChild(gutter);
    } catch(err) {
      console.warn('⚠️ Gutter Error:', err);
    }

    Split(this.frames_, {
      gutterSize: 6,
      cursor: 'col-resize',
      direction: this.orientation_
    });
  }

  /**
   * Set orientation of frames
   *
   * @return {string}
   */
  setOrientation(orientation) {
    // Orient frames, i.e. toggle some CSS classes
    if (orientation === 'vertical') {
      this.container_.classList.remove('split-horizontal');
      this.container_.classList.add('split-vertical');
      this.swapButton_.style.transform = 'rotate(0deg)';
    } else {
      this.container_.classList.add('split-horizontal');
      this.container_.classList.remove('split-vertical');
      this.swapButton_.style.transform = 'rotate(90deg)';
    }
    localStorage.setItem(`${prefix}${orientation}`, orientation);

    // Update gutter orientation
    this.createGutter_();

    // Update frame sizes to maintain proportions set by user before swapping
    // orientation
    this.frames_.forEach(selector => {
      let element = document.querySelector(selector);

      if (orientation == 'horizontal') {
        element.style.width = element.style.height;
        element.style.height = '';
      } else {
        element.style.height = element.style.width;
        element.style.width = '';
      }
    });

    return orientation;
  }

  /**
   * Toggle orientation of frames  top/bottom <--> left/right
   *
   * @return {string}
   */
  swapOrientation() {
    if (this.orientation_ == 'horizontal') {
      this.orientation_ = 'vertical';
    } else {
      this.orientation_ = 'horizontal';
    }

    this.setOrientation(this.orientation_);

    return this.orientation_;
  }

  /**
   * Add a frame
   * @param {string} orientation
   */
  add(orientation='horizontal') {
    let index = this.count_;
    let selector = `${prefix}${ids[index]}`;

    // Add frame, include '#' ID marker
    this.frames_.push(`#${selector}`);

    // Create iFrame container
    let frameContainer = document.createElement('div');
    frameContainer.id = selector;
    frameContainer.classList.add('split');

    // Create input (e.g. URL holder)
    let inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    // Create frame URL input
    let input = document.createElement('input');
    input.type = 'text';
    input.id = input.name = `input${index}`;
    input.value = '';
    input.placeholder = 'Enter URL';
    input.addEventListener('blur', event => {
      this.load(index, true);
      if (input.classList.contains('show')) {
        input.classList.remove('show');
      }
    });
    input.addEventListener('keypress', event => {
      let key = event.which || event.keyCode;
      if (key === 13) { // enter
        input.blur();
      }
    });

    // Create iFrame for content
    let frame = document.createElement('iframe');
    frame.id = `frame${index}`;
    frame.src = './blank.html';
    // (no value)       Applies all restrictions
    // allow-forms      Re-enables form submission
    // allow-pointer-lock   Re-enables APIs
    // allow-popups     Re-enables popups
    // allow-same-origin  Allows the iframe content to be treated as being from the same origin
    // allow-scripts    Re-enables scripts
    // allow-top-navigation Allows the iframe content to navigate its top-level browsing context
    frame.setAttribute('sandbox', 'allow-forms allow-same-origin allow-scripts');

    // See if content is loaded
    this.isReloaded_(frame);

    // Append frames and input to container
    inputContainer.appendChild(input);
    frameContainer.appendChild(inputContainer);
    frameContainer.appendChild(frame);
    this.container_.appendChild(frameContainer);

    // Load frame with content
    this.load(index, false);

    this.count_++;
  }

  /**
   * Remove a frame
   * @param  {[type]} val
   * @return {[type]}
   */
  remove(val) {
    this.count_ = ((this.count_ - 1) > 0)
      ? this.count_ - 1
      : this.count_;
  }

  /**
   * Promisify-ed XHR request
   * http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
   * @private
   * @param  {string} method
   * @param  {string} url
   * @return {Promise}
   */
  request_(method, url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = () => {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = () => {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  /**
   * Check if string is a valid URL
   * @private
   * @param  {string}  str
   * @return {Boolean} true if valid, false otherwise
   */
  isValidURL_(str) {
    return validator.isURL(str, {
      protocols: ['http', 'https', 'ftp', 'file', 'localhost', 'chrome', 'chrome-extension'],
      require_protocol: true,
      require_valid_protocol: true
    });
  }

  /**
   * Add onLoad event to keep track of how many times the content of an element
   * is (re)loaded
   * @private
   * @param  {Element}  ele
   * @return {Boolean}
   */
  isReloaded_(ele) {
    ele.dataset.reloaded = 0;

    let id = ele.id;

    ele.onload = () => {
      let reloaded = ele.dataset.reloaded;
      ele.dataset.reloaded++;

      // if (reloaded > 0) {
      //   ele.src = './load-error.html';
      //   console.warn('stop', ele.document);
      //   // ele.stop();
      //   ele.setAttribute('sandbox', '');
      //   window.frames[1].stop();
      //   window.stop();
      // }
    };
  }

  /**
   * Check if Element has an error state
   * @private
   * @param  {Element} ele
   * @param  {Boolean} isError
   * @return {Boolean}
   */
  hasErrorState_(ele, isError) {
    if (isError && !ele.classList.contains('error')) {
      ele.classList.add('error');
      return true;
    } else if (!isError && ele.classList.contains('error')) {
      ele.classList.remove('error');
      return false;
    }
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
    document.querySelector(`#${prefix}b`).onload = () => {
      console.warn('load!!!', this.contentWindow);
    }
    // window.onbeforeunload = () => {
    //   alert('onbeforeunload');
    // }
    // console.alert(window.onbeforeunload);

    this.swapButton_.addEventListener('click', this.swapClickHandler_.bind(this));
  }

  swapClickHandler_(event) {
    this.swapOrientation();
    // window.location.reload(true);
  }

  // TODO: fix the frame busting!
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


// Instantiate class
new SideBySide();
