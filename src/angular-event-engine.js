/**
 * Event engine for AngularJS
 * @author Slava Kravchina
 * @version v0.0.3
 * @link http://github.com/kravchina/angular-event-engine
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/*jslint forin: true */
/*global window */
(function (angular) {
    'use strict';

    var isUndefined = angular.isUndefined,
        isFunction = angular.isFunction,
        copy = angular.copy;

    /**
    * Configuration class for engine.
    *
    * catchExceptions {Bool}
    * copyEventArgs {Bool}
    */
    function EngineConfig() {
        this.catchExceptions = false;
        this.copyEventArgs = false;
    }

   /**
   * Copy all of the properties in the params objects over to the EngineConfig object.
   *
   * @param {Object} object that contains the new settings.
   */
    EngineConfig.prototype.set = function (config) {
        var prop;
        if (config) {
            for (prop in config) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = config[prop];
                }
            }
        }
    };

    function HandlingContext(name) {
        var isStopHandling = false,
            eventName = name;

        this.getEventName = function () {
            return eventName;
        };

        this.stopHandling = function () {
            isStopHandling = true;
        };

        this.isHandlingStopped = function () {
            return isStopHandling;
        };
    }

    function EventEngine(configuration) {
        var events = [],
            config = configuration,
            logger;

        this.setLog = function ($log) {
            logger = $log;
        };


        /**
        * Bind listener function to event
        *
        * @param {String} event name.
        * @param {Function} listener function.
        */
        this.listen = function (name, fn) {
            if (!isFunction(fn)) {
                throw new Error('Event listener must be a function');
            }

            if (isUndefined(events[name])) {
                events[name] = [];
            }

            events[name].push(fn);
        };

        /**
        * Dispatch the event for listeners 
        *
        * @param {String} event name.
        * @param [{Object},...] listener function.
        */
        this.dispatch = function (name) {
            var listeners = events[name],
                argsForListeners,
                context,
                args,
                fn,
                i;

            if (isUndefined(listeners)) {
                return;
            }

            context = new HandlingContext(name);

            args = Array.prototype.slice.call(arguments, 1);

            for (i = 0; i < listeners.length; i += 1) {
                fn = listeners[i];

                if (context.isHandlingStopped()) {
                    break;
                }

                if (config.copyEventArgs) {
                    argsForListeners = copy(args);
                } else {
                    argsForListeners = args;
                }

                if (config.catchExceptions) {
                    try {
                        fn.apply(context, argsForListeners);
                    } catch (e) {
                        logger.error(e);
                    }
                } else {
                    fn.apply(context, argsForListeners);
                }
            }
        };
    }

    /**
    * Wrapper for AngularJS provider
    *
    * @return {object}
    */
    function EventEngineProvider() {
        var config = new EngineConfig(),
            engine = new EventEngine(config);

        return {
            listen: function (name, fn) {
                engine.listen(name, fn);
            },

            setConfig: function (configuration) {
                config.set(configuration);
            },

            $get: ['$log',
                function ($log) {
                    engine.setLog($log);

                    return {
                        listen: function (name, fn) {
                            engine.listen(name, fn);
                        },
                        dispatch: function () {
                            engine.dispatch.apply(this, arguments);
                        }
                    };
                }
                ]
        };
    }

    angular
        .module('event.engine', [])
        .provider('$eventEngine', EventEngineProvider);
}(window.angular));