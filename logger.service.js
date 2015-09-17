(function() {
    'use strict';

    angular
        .module('angular-logger-max', [])
        .factory('Logger', [Logger]);

    // check for the availablility of the variety of console functions and create holders if necessary
    (function() {
        // handles all the console methods to make the console persistent, mainly for IE
        if (window.console === undefined) {
            window.console = {};
        }

        // assign holder functions to any console method not available to avoid old browser errors
        (function() {
            var methods = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"],
                i = methods.length;
            for (; i--;) {
                if (!window.console[methods[i]]) {
                    window.console[methods[i]] = function() {};
                }
            }
        }());
    }());

    function Logger() {
        var _debug = false,
            _api = {
                log: log,
                error: error,
                warn: warn,
                info: info,
                data: data,
                shout: shout,
                get debug() {
                    return _debug;
                },
                set debug(val) {
                    _debug = val;
                }
            };

        return _api;

        function log(prepend, msg, fullStack, expand) {
            if (!_debug) return;

            _formatOutput('log', 'color: green', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.re.log(prepend, (msg) ? msg : '<< END');
            }
        }

        function info(prepend, msg, fullStack, expand) {
            if (!_debug) return;

            _formatOutput('info', 'color: blue', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.re.info(prepend, (msg) ? msg : '<< END');
            }
        }

        function warn(prepend, msg, fullStack, expand) {
            // always show warnings, debug or not
            _formatOutput('warn', 'color: orange', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.warn(prepend, (msg) ? msg : '<< END');
            }
        }

        function error(prepend, msg, fullStack, expand) {
            // always show errors, debug or not
            _formatOutput('error', 'background-color: maroon; font-weight: bold; color: white', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.re.error(prepend, (msg) ? msg : '<< END');
                console.re.trace();
            }
        }

        function data(prepend, msg, fullStack, expand) {
            if (!_debug) return;

            // for data, by default log them out as full objects
            expand = typeof expand === 'undefined' ? true : expand;

            _formatOutput('data', 'color: hotpink', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.re.debug(prepend, (msg) ? msg : '<< END');
            }
        }

        function shout(prepend, msg, fullStack, expand) {
            if (!_debug) return;

            _formatOutput('shout', 'color: red; font-weight: bold; font-size: 125%;', prepend, msg, _formatStackTrace(fullStack), expand);

            if (console.re) {
                console.re.log(prepend, (msg) ? msg : '<< END');
            }
        }

        /**
         * Function to format the console outputs according to what types of things are passed
         * @param {String}  type        A string to indicate the type of log
         * @param {String}  styles      A string of css styles
         * @param {String}  prepend     Text to prepend the output with
         * @param {Mixed}   msg         What is to be outputted to the console
         * @param {Boolean} fullStack   Indicate whether the full stack trace should be shown (false by default)
         * @param {Boolean} expandObj   Indicate whether any object being logged should be expanded in string form (false by default)
         */
        function _formatOutput(type, styles, prepend, msg, fullStack, expandObj, remote) {
            var stackString = _trace();

            // pre-process type according to calling function
            var moduleType = fullStack.substring(fullStack.indexOf('.', 0) + 1, _xIndexOf('.', fullStack, 2));

            type = (_xIndexOf('.', fullStack, 2) > 0) ? ((stackString) ? '%c' : '') + '[#][' + type.toUpperCase() + '][' + _toTitleCase(moduleType) + ']' : ((stackString) ? '%c' : '') + '[#][' + type.toUpperCase() + ']';

            if (msg === undefined && typeof prepend !== 'object' && typeof prepend !== 'function') { // if a plain string
                if (stackString.length > 0) {
                    console.log(type, styles, prepend, fullStack);
                } else {
                    console.log(type, prepend, fullStack);
                }
            } else if (typeof prepend === 'object') { // if a single object with no prepending text
                if (expandObj) {
                    if (stackString.length > 0) {
                        console.log(type + JSON.stringify(prepend, null, '\t'), styles, fullStack);
                    } else {
                        console.log(type + JSON.stringify(prepend, null, '\t'));
                    }
                } else {
                    if (stackString.length > 0) {
                        console.log(type, styles, prepend, fullStack);
                    } else {
                        console.log(type, prepend, fullStack);
                    }
                }
            } else { // if prepend and msg exists
                if (typeof msg === 'object' && expandObj) { // if msg is an object and it needs to be automatically expanded
                    if (stackString.length > 0) {
                        console.log(type + prepend, styles, JSON.stringify(msg, null, '\t'), fullStack);
                    } else {
                        console.log(type + prepend, JSON.stringify(msg, null, '\t'), fullStack);
                    }
                } else { // log it out as per normal
                    if (stackString.length > 0) {
                        console.log(type + prepend, styles, msg, fullStack);
                    } else {
                        console.log(type + prepend, msg, fullStack);
                    }
                }
            }
        }

        // get the stack track from the output of a dummy error message so we can provide meaningful path information
        function _trace() {
            var err = new Error();
            return err.stack;
        }

        /**
         * Function to format the full or summary stack trace to the console
         * @param  {Boolean}    fullStack Indicate whether the full stack should be shown in the console or just the filename
         * @return {String}
         */
        function _formatStackTrace(fullStack) {
            fullStack = typeof fullStack === 'undefined' ? false : fullStack;

            if (!fullStack) {
                var lines = (_trace()) ? _trace().split('\n') : '',
                    i,
                    l;

                for (i = 0; i < lines.length; i++) {
                    var val = lines[i];
                    if (val.toString()
                        .indexOf('logger.js') === -1 && val.toString() !== 'Error') {
                        return ('____ [' + lines[4].substring(lines[4].lastIndexOf('/') + 1) + ']')
                            .replace(')', '');
                    }
                }
            }

            return (console.re) ? console.re.trace() : _trace();
        }

        /**
         * Function to return the 2nd, 3rd or nth instance of a needle in a string
         * @usage   var PicPath = "/somedirectory/pics/";
         *        	var AppPath = picpath.substring(0, xIndexOf('/', PicPath, 2) + 1);
         * @param  {Number} instance    the number instance to find
         * @param  {String} needle      the needle to search for
         * @param  {String} haystack    the string to search within
         * @return {Number}             the position in the string the nth instance of the needle was found in
         */
        function _xIndexOf(needle, haystack, instance) {
            var found,
                i;

            if (instance <= (haystack.split(needle).length - 1)) {
                found = haystack.indexOf(needle);
                if (instance > 1) {
                    for (i = 1; i < instance; i++) {
                        found = haystack.indexOf(needle, found + 1);
                    }
                }
                return found;
            } else {
                return 0;
            }
        }

        /**
         * Function to title case a string
         * @param  {String} str     the string to title case
         * @return {String}
         */
        function _toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})();
