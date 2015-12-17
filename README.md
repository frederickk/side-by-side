Side-by-Side
==============

Two sites, side-by-side

[Download Extension](https://chrome.google.com/webstore/detail/side-by-side/bobidkladfnoamglfgpnllbkhjlhjlfb?hl=en-US)

TODO: support more than two panes

TODO: find solution to sites that don't allow "framing" (e.g. stackoverflow)

TODO: support incognito mode (https://github.com/philc/vimium/issues/1544)


Installation
-------------

In Chrome, choose Window > Extensions.  Drag ```side-by-side.crx``` into the page that appears.

Or, you can also simply load the uncompiled source as follows:


1. Select ```Extensions``` under the ```Tools``` menu or go to [chrome://extensions](chrome://extensions).

2. Ensure that the ```Developer mode``` checkbox in the top right-hand corner is checked.

3. Click ```Load unpacked extension...``` to pop up a file-selection dialog.

4. Navigate to the ```/src``` directory of this repo or drag and drop the ```/src``` directory onto the opened [chrome://extensions](chrome://extensions) tab.



Build
-------------

TODO: quit being lazy and implement a grunt task to compile ```./src``` to ```./dist```


```bash
$ ./package.sh side-by-side
```



License
-------------
The MIT License (MIT)

Copyright (c) 2015 Ken Frederick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
