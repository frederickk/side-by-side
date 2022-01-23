import Split from 'split.js';
import {prefix} from './defs';
import {SplitPane} from './split-pane';
import {load, loadArray, randomStr} from './utils';

interface Gutter {
  (item: HTMLElement): void;
}

/**
 * Default width of gutter.
 */
const WIDTH = 6;

/**
 * Default height of inputs.
 */
const HEIGHT = 42;

/**
 * Menu items for options menu.
 */
const OPTIONS_MENU_ITEMS = ['swap', 'flip', 'add'];
// const OPTIONS_MENU_ITEMS = ['swap', 'flip', 'add', 'share', 'distribute'];

export class SideBySide {
  /**
   * Keep track of initial instantiation.
   */
  private isInstatiated_ = false;

  /**
   * Container for holding frames.
   */
  private container_: HTMLElement = document.querySelector('#container');

  /**
   * Orientation of the frames, left/right, top/bottom.
   */
  private orientation_: string = 'horizontal';

  /**
   * Array of frame (URLs).
   */
  private panes_: Array<any> = loadArray(`${prefix}pane`);

  constructor() {
    this.orientation_ =
        localStorage.getItem(`${prefix}orientation`) || 'horizontal';

    this.createPanes_();
    this.setOrientation(this.orientation_);
    this.attach_();
  }

  /**
   * Creates/injects panes into #container.
   */
  private createPanes_() {
    // To be safe, clear everything from container and start fresh
    this.container_.innerHTML = '';

    if (!this.isInstatiated_) {
      // If this is the initial load, remove any empthy string URL's first
      this.panes_ = this.panes_.filter(item => item !== '');
    }

    if (this.panes_.length === 1) {
      // this.panes_ should have a length of 2, so add an empty value
      this.panes_ = this.panes_.concat([null]);
    } else if (this.panes_.length <= 0) {
      // or if there aren't any values add 2 null values
      this.panes_ = [null, null];
    }

    if (!this.isInstatiated_ && this.panes_.length > 2) {
      // If this is the initial load, and there are more than 2 saved urls,
      // trim array
      this.panes_.splice(2);
    }

    this.panes_.forEach(url => {
      this.add(url);
    });

    // After the panes are created, create gutter (draggable divider)
    this.createGutter_();

    // Flip instantiation flag to true
    this.isInstatiated_ = true;
  }

  /**
   * Creates gutter and instantiate Split.js class to handle window dividing.
   */
  private createGutter_() {
    // If a gutter(s) already exists, remove it(them).
    this.adjustGutters_((gutter: HTMLElement) => {
      gutter.parentElement.removeChild(gutter);
    });

    const elemArray: Array<HTMLElement> =
        Array.from(document.querySelectorAll('.split'));

    Split([...elemArray], {
      gutterSize: WIDTH,
      cursor: 'col-resize',
      // TODO (frederickk): fix type declaration of orientation_.
      //@ts-ignore
      direction: this.orientation_,
    });

    // create options menu within gutter
    this.adjustGutters_((gutter: HTMLElement) => {
      gutter.addEventListener('mouseover',
          this.gutterMouseoverHandler_.bind(this), false);
      gutter.addEventListener('mouseout',
          this.gutterMouseoutHandler_.bind(this), false);
      this.createOptions_(gutter);
    });
  }

  /**
   * Creates options menu items.
   */
  private createOptions_(parent: HTMLElement) {
    let optionsMenu = document.createElement('ul');
    optionsMenu.classList.add('options-menu');

    OPTIONS_MENU_ITEMS.forEach(str => {
      let item = document.createElement('li');
      item.classList.add('menu-item', `${str}`, 'material-icons');

      let icon = document.createElement('i');
      icon.classList.add('material-icons');

      // TODO(frederickk): fix this sloppiness, although it might not
      // semantically make sense, perhpas the OPTIONS_MENU_ITEMS array should be
      // a list of valid icon names e.g.:
      // ['view_agenda', 'swap_horiz', 'open_in_new']
      if (str === 'swap') {
        // icon.innerHTML = 'autorenew';
        // icon.innerHTML = 'vertical_align_center';
        icon.innerHTML = 'view_agenda';
        item.addEventListener('click',
            this.swapOrientation.bind(this), false);

      } else if (str === 'flip') {
        icon.innerHTML = 'swap_horiz';
        // icon.innerHTML = 'flip';
        item.addEventListener('click',
            this.flipButtonHandler_.bind(this), false);

      } else if (str === 'add') {
        icon.innerHTML = 'add';
        item.addEventListener('click',
            this.addButtonHandler_.bind(this), false);

      } else if (str === 'share') {
        // icon.innerHTML = 'share';
        // icon.innerHTML = 'web';
        icon.innerHTML = 'open_in_new';
        item.addEventListener('click',
            this.shareButtonHandler_.bind(this), false);
      }

      item.appendChild(icon);
      optionsMenu.appendChild(item);
    });

    parent.appendChild(optionsMenu);
  }

  /**
   * Loops through all gutters and use callback to adjust individually.
   */
  private adjustGutters_(callback: Gutter, selector = '.gutter') {
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
   * Adds a pane.
   */
  add(url: string) {
    const id = `${prefix}${randomStr()}`;
    const pane = new SplitPane();
    pane.create(this.container_, id);

    // Load pane with content
    load(pane.iframe, url);
  }

  /**
   * Sets orientation of frames.
   */
  setOrientation(orientation) {
    if (orientation === 'horizontal') {
      this.container_.classList.add('split-horizontal');
      this.container_.classList.remove('split-vertical');
    } else {
      this.container_.classList.remove('split-horizontal');
      this.container_.classList.add('split-vertical');
    }
    localStorage.setItem(`${prefix}orientation`, orientation);

    // Update gutter orientation, i.e. re-create gutter
    this.createGutter_();

    // Update pane sizes to maintain proportions set by user before swapping
    // orientation
    document.querySelectorAll('.split').forEach((pane: HTMLElement) => {
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
   * Toggles orientation of frames  top/bottom <--> left/right.
   */
  swapOrientation(): string {
    if (this.orientation_ === 'horizontal') {
      this.orientation_ = 'vertical';
    } else {
      this.orientation_ = 'horizontal';
    }

    this.setOrientation(this.orientation_);

    return this.orientation_;
  }

  /**
   * Flips placement of element with sibling.
   */
  private flipPlacement_(element: HTMLElement) {
    const previous = element.previousSibling;
    const next = element.nextSibling;

    element.after(previous);
    element.before(next);
  }

  /**
   * Attaches event listeners.
   */
  private attach_() {
    // TODO(frederickk): fix the frame busting!
    // http://stackoverflow.com/questions/958997/frame-buster-buster-buster-code-needed
    // https://github.com/frederickk/side-by-side/issues/1
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
   * Handler for gutter on mouseover.
   */
  private gutterMouseoverHandler_(event: MouseEvent) {
    const target = <HTMLElement>event.target;
    const threshold = HEIGHT * OPTIONS_MENU_ITEMS.length;

    if (target.classList.contains('gutter-horizontal') &&
        event.clientY <= threshold) {
      target.style.width = `${HEIGHT}px`;
    } else if (target.classList.contains('gutter-vertical') &&
        event.clientX <= threshold) {
      target.style.height = `${HEIGHT}px`;
    }
  }

  /**
   * Handler for gutter on mouseout.
   */
  private gutterMouseoutHandler_(event: Event) {
    const target = <HTMLElement>event.target;

    if (target.classList.contains('gutter-horizontal')) {
      target.style.width = `${WIDTH}px`;
    } else if (target.classList.contains('gutter-vertical')) {
      target.style.height = `${WIDTH}px`;
    }
  }

  /**
   * Handler for flipping the placement of two adjacent <iframes>.
   */
  private flipButtonHandler_(event: Event) {
    const target = <HTMLElement>event.target;

    this.flipPlacement_(target.closest('.gutter'));
  }

  /**
   * Handler for adding additional split pane.
   */
  private addButtonHandler_() {
    // Make sure this.panes_ is actually in sync
    // TODO(frederickk): It would be better to create an event listern of sorts
    // to ensure that this.panes_ stays 1:1 synced with what is exactly stored
    // in local storage;
    this.panes_ = loadArray(`${prefix}pane`);
    this.panes_.push('');
    // TODO(frederickk): Add panes respective of where button is e.g. to the
    // right of the gutter where button is located/
    // TODO(frederickk): Create a specific method for pane adding as opposed to
    // using initial createPanes()
    this.createPanes_();
  }

  /**
   * Handler for opening split as shareable live URL
   * TODO (frederickk).
   */
  private shareButtonHandler_() {
  }
}