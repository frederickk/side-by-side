/*
 * Side-by-Side
 * app.js
 *
 * Ken Frederick
 * ken.frederick@gmx.de
 *
 * http://kennethfrederick.de/
 * http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
//
// Properties
//
// ------------------------------------------------------------------------
const prefix = '--sbs-';
const container = document.getElementById('container');
const swap = document.getElementById('swap');
const ids = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

let frames = [];

let direction;
let num = 0;



// ------------------------------------------------------------------------
//
// Methods
//
// ------------------------------------------------------------------------
(function() {
    direction = localStorage.getItem(prefix + 'direction');

    add(direction);
    add(direction);

    Split(frames, {
        gutterSize : 6,
        cursor     : 'col-resize',
        direction  : direction
    });
})();

// ------------------------------------------------------------------------
function load(index, overwrite) {
    let frame = document.getElementById(`frame${index}`);
    let input = document.getElementById(`input${index}`);
    let stored = localStorage.getItem(`${prefix}frame${index}`);

    if (!overwrite) {
        input.value = (stored)
            ? stored
            : input.value;
    }

    if (!isValidURL(input.value)) {
        // assume that adding 'http://' solves the problem
        input.value = `http://${input.value}`;
        makeRequest('GET', input.value).then(function(response) {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
            }
            localStorage.setItem(`${prefix}'frame'${index}`, String(input.value));
        }).catch(function(err) {
            input.classList.add('error');
        });
    }

    frame.src = (input.value)
        ? input.value
        : '';
    frame.src = frame.src;
}

// ------------------------------------------------------------------------
function add(direction, id) {
    let index = num;
    let val = (id)
        ? prefix + id
        : prefix + ids[index];
    frames.push('#' + val);

    let frameContainer = document.createElement('div');
    frameContainer.id = val;
    frameContainer.classList.add('split');
    if (direction === 'vertical') {
        frameContainer.classList.add('split-vertical');
    }
    else {
        frameContainer.classList.add('split-horizontal');
    }

    let inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    if (direction === 'vertical') {
        inputContainer.classList.add('vertical');
    }
    inputContainer.addEventListener('mousemove', function(event) {
        let top = this.parentNode.getBoundingClientRect().top;
        if (event.y < top + parseInt(window.getComputedStyle(this, null)['height']) * 0.5) {
            this.classList.add('show');
        }
    });
    inputContainer.addEventListener('mouseout', function(event) {
        this.classList.remove('show');
    });

    let input = document.createElement('input');
    input.type = 'text';
    input.id = input.name = 'input' + index;
    input.value = '';
    input.placeholder = 'Enter URL';
    input.addEventListener('blur', function(event) {
        load(index, true);
        if (this.classList.contains('show')) {
            this.classList.remove('show');
        }
    });
    input.addEventListener('keypress', function(event) {
        let key = event.which || event.keyCode;
        if (key === 13) { // enter
            this.blur();
        }
    });

    let frame = document.createElement('iframe');
    frame.id = `frame${index}`;
    frame.src = './blank.html';

    inputContainer.appendChild(input);
    frameContainer.appendChild(inputContainer);
    frameContainer.appendChild(frame);

    container.appendChild(frameContainer);

    load(index, false);

    num++;
}

// ------------------------------------------------------------------------
function remove(val) {
    num = ((num - 1) > 0)
        ? num - 1
        : num;
}

// ------------------------------------------------------------------------
function swapDirection() {
    if (direction === 'vertical') {
        direction = 'horizontal';
    }
    else {
        direction = 'vertical';
    }
    localStorage.setItem(`${prefix}direction`, direction);

    return direction;
}

function isValidURL(str) {
    return validator.isURL(str, {
        protocols              : ['http', 'https', 'ftp', 'file', 'localhost'],
        require_protocol       : true,
        require_valid_protocol : true
    });
}

// http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
function makeRequest(method, url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            }
            else {
                reject({
                    status     : this.status,
                    statusText : xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status     : this.status,
                statusText : xhr.statusText
            });
        };
        xhr.send();
    });
}



// ------------------------------------------------------------------------
//
// Events
//
// ------------------------------------------------------------------------
swap.addEventListener('click', function(event) {
    swapDirection();
    window.location.reload(true);
});
swap.addEventListener('animationend', animTransEnd);
swap.addEventListener('transitionend', animTransEnd);

function animTransEnd(event) {
    swap.style.transform = 'rotate(90deg)';
}
