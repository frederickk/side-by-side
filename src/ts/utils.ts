import {devDomain, devPort} from './defs';
import * as Validator from 'validator';
import normalizeUrl = require('normalize-url');

/**
 * Checks if string is a valid URL.
 */
 export const isValidURL = (str = ''): boolean => {
  if (str != undefined) {
    const isValid = Validator.default.isURL(str, {
      protocols: [
        'http',
        'https',
        'ftp',
        'file',
        'localhost',
        'chrome',
        'chrome-extension'
      ],
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
 * Loads specified URL into specified frame.
 * @return true if URL is valid and loaded, false otherwise
 */
export const load = (element: HTMLIFrameElement, url = ''): boolean => {
  const isValid = isValidURL(url);

  if (element.nodeName.toLowerCase() === 'iframe') {
    if (!isValid) {
      if (url != null || url != undefined) {
        const origUrl = url;

        // Attempt to make a valid URL
        try {
          url = normalizeUrl(url);

          request('GET', url).then(() => {
            load(element, url);
          }, () => {
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
      if (element.src.indexOf(`${devDomain}:${devPort}`) > -1 ||
          element.src.indexOf('chrome-extension://') > -1) {
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
 * Loads an array from localStorage.
 * @return the values in localStorage
 */
 export const loadArray = (key: string): any => {
  return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * Generates a random string.
 * @param  len  desired string length
 */
export const randomStr = (len = 36): string => {
  return Math.random().toString(len).substring(2, 15);
}

/**
 * Promisifies XHR request.
 * TODO (frederickk): Deprecate this and use fetch().
 * http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
 */
export const request = (method: string, url: string): Promise<any> => {
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
    xhr.onerror = () => {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

/**
 * Saves an array to localStorage.
 */
export const saveArray = (key: string, val: Array<any>) => {
  localStorage.setItem(key, JSON.stringify(val));
}
