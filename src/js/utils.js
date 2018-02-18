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
  static get(method, url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpUtils();
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
   * @param  {Boolean} [overwrite=false]
   * @return {Boolean} return true if URL is valid and loaded, false otherwise
   */
  static load(selector, url='', overwrite=false) {
    let iframe = document.querySelector(`${selector}`);

    let isValid = Utils.isValidURL(url);

    if (!isValid) {
      // last ditch effort to make a valid URL, i.e. prepend protocol
      url = (url.indexOf('http') > 0 || url.indexOf('file') > 0)
        ? url
        : `http://${url}`;

      Utils.get('GET', url).then((response) => {
        // this.hasErrorState_(input, false);
        // localStorage.setItem(`${prefix}frame${index}`, String(url));
      }).catch((err) => {
        // this.hasErrorState_(input, false);
      });

      return false;
    }

    iframe.src = (url)
      ? url
      : '';
    iframe.src = iframe.src;

    return true;
  }

  /**
   * Save an array to localStorage
   * @private
   * @param  {string} name
   * @param  {array} val
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

}


module.exports = Utils;
