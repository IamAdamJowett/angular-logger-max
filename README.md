# angular-logger-max
A custom logger for angular with color coding (in Chrome, plain in other browsers including Internet Explorer) and also with remote debugging options via the [console.re](console.re) service.

The benefits of using this logger instead of vanilla console.log outputs is readability, extra information by default and the ability to turn all debugging on or off via `Logger.debug = false` or `Logger.debug = true`;

The exception to the above are errors and warnings which are always outputted to the console.

There are options to show the full stack in an output as well as whether to expand and print out objects by default on a per call basis.

As an example, here is a screenshot showing some of the different types of Logger method outputs:

## Installation

There are two easy ways to install the Logger service:

#### With Bower

To install via Bower, run:

    bower install angular-logger-max

#### Manual Installation

Download the `logger.service.js` file, and include it in your index.html file with something like:

    <script type="text/javascript" src="/path/to/logger.service.js"></script>

Also be sure to include the module in your app.js file with:

    angular.module('yourAppName', ['angular-logger-max']);

## Usage

All Logger methods take the same parameters, all if which are option except for 'prepend', which if it is the only parameter passed, turns into the log message:

###Parameters

- prepend - A string to prepend your output with, useful when labelling output of an object such as Logger.log('myObj: ', myObj);
- msg - The main output string (if prepend is not passed, then prepend becomes the same as this). Can be of any type.
- fullStack - A boolean indicating whether to output the entire stack trace (if it is gettable in the browser) for more detailed debugging (default false)
- expand - A boolean indicating whether to expand objects by default via JSON.stringify (default false)


    Logger.log('This is a plain old boring log, but it will be colorful');
    Logger.info('An object, but not via Logger.data, expanded: ', someObj, false, true);
    Logger.shout('This is like a log, but loud, and stands out in the console');
    Logger.data('myObject structure: ', myObject);
    Logger.error('An error, so lets see the full stack trace', null, true, false);

## Logging to the http://console.re service

Integration into the remote logging service at console.re is available by default. To enable this feature, simply go to the [console.re](console.re) website and follow their "How to install" instructions.

angular-logger-max will automatically look to see if the library has been included, and if so, will log out to both the local console, and to the console.re console you have set up.

An example output looks something like this in the console.re console:

When console.re is included, you will get duplicate logs in your browser console, to clean this up, you can filter by [#] to show only non-console.re logs:
