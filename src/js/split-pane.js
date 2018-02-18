/**!
 * Side-by-Side
 * split-pane.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kenfrederick.de/
 * http://blog.kenfrederick.de/
 *
 */

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



class SplitPane {
  constructor() {
    /**
     * <iframe> container
     * @type {Element}
     */
    this.iframeContainer = document.createElement('div');
    this.iframeContainer.classList.add('split');

    /**
     * The <iframe> to hold the content/site
     * @type {Element}
     */
    this.iframe = document.createElement('iframe');

    /**
     * <input> field container
     * @type {Element}
     */
    this.inputContainer = document.createElement('div');
    this.inputContainer.classList.add('input-container');

    /**
     * <input> field (e.g. URL holder)
     * @type {Element}
     */
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.value = '';

    // Add event listeners to key DOM elements
    this.attach_();
  }

  /**
   * Create all of the elements for each split pane
   * @param  {Element} parent
   */
  create(parent, id) {
    this.iframeContainer.id = id;

    this.input.id = this.input.name = `input-${id}`;
    this.input.value = '';
    this.input.placeholder = 'Enter URL';

    this.iframe.id = `frame-${id}`;
    this.iframe.src = './blank.html';
    // (no value)           Applies all restrictions
    // allow-forms          Re-enables form submission
    // allow-pointer-lock   Re-enables APIs
    // allow-popups         Re-enables popups
    // allow-same-origin    Allows the iframe content to be treated as being from the same origin
    // allow-scripts        Re-enables scripts
    // allow-top-navigation Allows the iframe content to navigate its top-level browsing context
    this.iframe.setAttribute('sandbox', 'allow-forms allow-same-origin allow-scripts');

    // See if content is loaded
    this.isReloaded_(this.iframe);

    // Add <input> to inputContainer
    this.inputContainer.appendChild(this.input);

    // Add inputContainer to iframeContainer
    this.iframeContainer.appendChild(this.inputContainer);

    // Add <iframe> to iframeContainer
    this.iframeContainer.appendChild(this.iframe);

    // Add iframeContainer to parent
    parent.appendChild(this.iframeContainer);
  }

  /**
   * Add onLoad event to keep track of how many times the content of an element
   * is (re)loaded
   * @private
   * @param  {Element}  element
   */
  isReloaded_(element) {
    element.dataset.reloaded = 0;

    let id = element.id;

    element.onload = () => {
      let reloaded = element.dataset.reloaded;
      element.dataset.reloaded++;

      // if (reloaded > 0) {
      //   element.src = './load-error.html';
      //   console.warn('stop', element.document);
      //   // element.stop();
      //   element.setAttribute('sandbox', '');
      //   window.frames[1].stop();
      //   window.stop();
      // }
    };
  }

  /**
   * Check if Element has an error state
   * @private
   * @param  {Element} element
   * @param  {Boolean} isError
   * @return {Boolean}
   */
  hasErrorState_(element, isError) {
    if (element.value != '') {
      if (isError && !element.classList.contains('error')) {
        element.classList.add('error');
        return true;
      } else if (!isError && element.classList.contains('error')) {
        element.classList.remove('error');
        return false;
      }
    } else {
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
    this.input.addEventListener('blur', event => {
      const parent = this.input.closest('.split');
      const iframe = parent.querySelector('iframe');

      const isLoaded = Utils.load(`#${iframe.id}`, this.input.value, true);

      if (isLoaded) {
        this.hasErrorState_(this.input, false);
      } else {
        this.hasErrorState_(this.input, true);
      }

      if (document.activeElement === this.input) {
        // this.input.focus();
        this.input.blur();
      }
    });

    this.input.addEventListener('keypress', event => {
      const key = event.which || event.keyCode;
      if (key === 13) { // enter
        this.input.blur();
      }
    });

    this.iframe.addEventListener('load', event => {
      const paneLoad = new CustomEvent('onpaneload', {
        detail: {
          id: event.target.id,
          src: event.target.src,
        }
      });

      window.dispatchEvent(paneLoad);
    }, true);
  }



}


module.exports = SplitPane;
