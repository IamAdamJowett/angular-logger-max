# angular-logger-max
A custom logger for angular with color coding and console.re support

## Installation

There are two easy ways to install the Logger service:

#### Bower

To install via Bower, run:

    bower install angular-logger-max

#### Manual download

Download the `logger.service.js` file, and include it in your index.html file with something like:

    <script type="text/javascript" src="/path/to/logger.service.js"></script>

Also be sure to include the module in your app.js file with:

    angular.module('yourAppName', ['angular-logger-max']);

## Usage

    Logger.log('This is a plain old boring log, but it will be colorful');

    Logger.shout('This is like a log, but loud, and stands out in the console');

    Logger.data('let me see the data structure of myObject: ', myObject, true, true);

    Logger.error('Oops something went wrong, this will stand out a little more in the console');

**More detailed readme coming soon**
