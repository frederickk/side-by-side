/**!
 * Side-by-Side
 * utils.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kenfrederick.de/
 * http://blog.kenfrederick.de/
 *
 */

const Validator = require('validator');


class Utils {
  /**
   * Promisify-ed XHR request
   * http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
   * @private
   * @param  {string} method
   * @param  {string} url
   * @return {Promise}
   */
  static request(method, url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open(method, url, true);
      xhr.onload = () => {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = err => {
        reject({
          status: xhr.status,
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
  static isValidURL(str='') {
    if (str != undefined) {
      return Validator.isURL(str, {
        protocols: ['http', 'https', 'ftp', 'file', 'localhost', 'chrome', 'chrome-extension'],
        require_protocol: true,
        require_valid_protocol: true
      });
    } else {
      return false;
    }
  }

  /**
   * Load specified URL into specified frame (via selector)
   * @param  {string}  selector
   * @param  {string}  [url='']
   * @return {Boolean} return true if URL is valid and loaded, false otherwise
   */
  static load(element, url='') {
    const isValid = Utils.isValidURL(url);

    console.log('load element', element.nodeName);
    console.log('load url', url);
    console.log('load isValid', isValid);

    if (element.nodeName.toLowerCase() === 'iframe') {
      if (!isValid) {
        if (url != null || url != undefined) {
      //     const origUrl = url;
      //
      //     // last ditch effort to make a valid URL, i.e. prepend protocol
      //     url = (url.indexOf('http') > 0 || url.indexOf('file') > 0)
      //       ? url
      //       : `http://${url}`;
      //
      //     console.log('load url', url);
      //
      //     // TODO(frederickk): This could likely be simplified
      //     Utils.request('GET', url).then(response => {
      //       Utils.load(selector, url);
      //
      //     }, reason => {
      //       console.warn(`Utils.load Warning: ${reason} One last attempt to check if ${origUrl} is valid, via https://`);
      //       url = `https://${origUrl}`;
      //       Utils.request('GET', url).then(response => {
      //         Utils.load(selector, url);
      //
      //       }, reason => {
      //         console.error(`Utils.load Error: ${reason} ${origUrl} is not a valid URL, we tried...`);
      //       });
      //     });

        } else {
          return false;
        }
      }

      console.log('load url', url);

      if (url) {
        element.src = url;
        element.src = element.src;
      // } else {
      //   // element.removeAttribute('src');
      //   element.src = './blank.html';
      }

      element.onload = () => {
        console.log('element.src', element.src);
        if (element.src.indexOf('0.0.0.0:1112') > -1 || element.src.indexOf('chrome-extension://') > -1) {
          element.removeAttribute('src');
          // element.src = './blank.html';
        }

        const event = new CustomEvent('paneload');
        element.dispatchEvent(event);
      };

      return true;
    } else {
      return false;
    }
  }

  /**
   * Save an array to localStorage
   * @private
   * @param  {string} name
   * @param  {Array} val
   */
  static saveArray(name, val) {
    localStorage.setItem(name, JSON.stringify(val));
  }

  /**
   * Load an array from localStorage
   * @private
   * @param  {string} name
   * @return {Array} the values in localStorage
   */
  static loadArray(name) {
    return JSON.parse(localStorage.getItem(name)) || [];
  }

  /**
   * Create a random string
   * @param  {number} [len=36] desired string length
   * @return {string}
   */
  static randomStr(len=36) {
    return Math.random().toString(len).substring(2, 15);
  }
}


module.exports = Utils;
