'use strict';

/**
 * @fileoverview Utility class.
 */



const defs = require('defs');
const Validator = require('validator');
const NormalizeUrl = require('normalize-url');



class Utils {
  /**
   * Promisify-ed XHR request
   * http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
   * @param  {string} method
   * @param  {string} url
   * @return {Promise}
   */
  static request(method, url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open(method, url, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
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
   * @param  {string}  str
   * @return {Boolean} true if valid, false otherwise
   */
  static isValidURL(str='') {
    if (str != undefined) {
      const isValid = Validator.isURL(str, {
        protocols: ['http', 'https', 'ftp', 'file', 'localhost', 'chrome', 'chrome-extension'],
        require_protocol: true,
        require_valid_protocol: true,
        require_tld: false,
      });
      return isValid;
    } else {
      return false;
    }
  }

  /**
   * Load specified URL into specified frame
   * @param  {HTMLElement}  element
   * @param  {string}  [url='']
   * @return {Boolean} return true if URL is valid and loaded, false otherwise
   */
  static load(element, url='') {
    const isValid = Utils.isValidURL(url);

    if (element.nodeName.toLowerCase() === 'iframe') {
      if (!isValid) {
        if (url != null || url != undefined) {
          const origUrl = url;

          // Attempt to make a valid URL
          try {
            url = NormalizeUrl(url);

            Utils.request('GET', url).then(response => {
              Utils.load(element, url);
            }, reason => {
              console.warn(`Utils.error: "${origUrl}" is unfortunately not a valid URL.`);
            });
          } catch(err) {
            console.warn(`Utils.error: ${url} Normalization Error:`, err);
          }

          return false;
        } else {
          return false;
        }
      }

      if (url) {
        element.src = url;
        element.src = element.src;
      }

      element.onload = () => {
        if (element.src.indexOf(`${defs.devDomain}:${defs.devPort}`) > -1 || element.src.indexOf('chrome-extension://') > -1) {
          // element.removeAttribute('src');
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
   * @param  {string} name
   * @param  {Array} val
   */
  static saveArray(name, val) {
    localStorage.setItem(name, JSON.stringify(val));
  }

  /**
   * Load an array from localStorage
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
