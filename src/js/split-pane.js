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


class SplitPane() {
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
    this.isReloaded_(frame);

    // Add <input> to inputContainer
    this.inputContainer.appendChild(input);

    // Add inputContainer to iframeContainer
    this.iframeContainer.appendChild(inputContainer);

    // Add <iframe> to iframeContainer
    this.iframeContainer.appendChild(this.iframe);

    // Add iframeContainer to parent
    parent.appendChild(this.iframeContainer);
  }

  /**
   * Add onLoad event to keep track of how many times the content of an element
   * is (re)loaded
   * @private
   * @param  {Element}  ele
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
      // this.load(index, true);
      if (this.input.classList.contains('show')) {
        this.input.classList.remove('show');
      }
    });

    this.input.addEventListener('keypress', event => {
      const key = event.which || event.keyCode;
      if (key === 13) { // enter
        this.input.blur();
      }
    });
  }
}
