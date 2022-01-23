import {prefix} from './defs';
import {load, saveArray} from './utils';

export class SplitPane {
  public iframeContainer = <HTMLIFrameElement>document.createElement('div');
  public iframe = <HTMLIFrameElement>document.createElement('iframe');
  public inputContainer = <HTMLElement>document.createElement('div');
  public input = <HTMLInputElement>document.createElement('input');

  constructor() {
    this.iframeContainer.classList.add('split');
    this.inputContainer.classList.add('input-container');

    this.input.type = 'text';
    this.input.value = '';

    // Add event listeners to key DOM elements
    this.attach_();
  }

  /**
   * Creates all of the elements for each split pane.
   */
  create(parent: HTMLElement, id = '') {
    this.iframeContainer.id = id;

    this.input.id = this.input.name = `input-${id}`;
    this.input.value = '';
    this.input.placeholder = 'Enter URL';

    this.iframe.id = `frame-${id}`;
    this.iframe.src = './blank.html';
    // sandbox values and their meanings
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
    // TODO(frederickk): Dig deeper into having <iframes> work when frame busting
    // code is implemented by site
    // https://github.com/frederickk/side-by-side/issues/1
    // (no value)           Applies all restrictions
    // allow-forms          Re-enables form submission
    // allow-pointer-lock   Re-enables APIs
    // allow-popups         Re-enables popups
    // allow-same-origin    Allows the iframe content to be treated as being from the same origin
    // allow-scripts        Re-enables scripts
    // allow-top-navigation Allows the iframe content to navigate its top-level browsing context
    this.iframe.setAttribute('sandbox',
        'allow-forms allow-same-origin allow-scripts');

    // See if content is loaded
    this.isReloaded_(this.iframe);

    this.inputContainer.appendChild(this.input);
    this.iframeContainer.appendChild(this.inputContainer);
    this.iframeContainer.appendChild(this.iframe);
    parent.appendChild(this.iframeContainer);
  }

  /**
   * Checks if input element has an error state.
   */
  private hasErrorState_(element: HTMLInputElement,
        isError: boolean): boolean {

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

  /**
   * Adds onLoad event to keep track of how many times the content of an element
   * is (re)loaded.
   */
  private isReloaded_(element: HTMLElement) {
    element.dataset.reloaded = (0).toString();

    element.onload = () => {
      let reloadAmt = parseInt(element.dataset.reloaded);
      reloadAmt++;
      element.dataset.reloaded = reloadAmt.toString();

      if (reloadAmt > 0) {
      //   element.src = './load-error.html';
      //   console.warn('stop', element.document);
      //   // element.stop();
      //   element.setAttribute('sandbox', '');
      //   window.frames[1].stop();
      //   window.stop();
      }
    };
  }

  /**
   * Attaches event listeners.
   */
  private attach_() {
    this.iframe.addEventListener('paneload',
        this.iframePaneloadHandler_.bind(this));

    this.input.addEventListener('blur', this.inputInputHandler_.bind(this));
    this.input.addEventListener('keypress', event => {
      const key = event.which || event.keyCode;
      if (key === 13) { // enter
        this.input.blur();
      }
    });
  }

  /**
   * Handler for custom <iframe> 'paneload' Events; iterates through every
   * <input> in the DOM and saves them in localStorage as an array.
   */
  private iframePaneloadHandler_() {
    const split = this.iframe.closest('.split');
    const input = split.querySelector('input');

    input.value = this.iframe.src;

    let srcArray = [];
    document.querySelectorAll('.split input').forEach(
          (input: HTMLInputElement) => {
      srcArray.push(input.value);
    });

    saveArray(`${prefix}pane`, srcArray);
  }

  /**
   * Handler for URL <input>.
   */
  private inputInputHandler_() {
    const split = this.input.closest('.split');
    const iframe = split.querySelector('iframe');

    const isLoaded = load(iframe, this.input.value);
    if (isLoaded) {
      this.hasErrorState_(this.input, false);
    } else {
      this.hasErrorState_(this.input, true);
      this.iframe.src = './load-error.html';
    }
  }
}