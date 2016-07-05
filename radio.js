define(['bluebird', 'underscore'], function(Promise, _) {

    /**
     * Public API
     */
    function Radio(allowedOrigins, windows) {
        var _listeners = {},
            _requests = {},
            _thisWindow = window,
            _thisOrigin = _thisWindow.location.origin,
            _allowedOrigins = [_thisOrigin].concat[allowedOrigins];

        // create an event listener so we can handle all incoming messages
        window.addEventListener('message', _handler, false);

        /**
         * This method handles all messages sent to the current window that radio is running in.
         * @param event
         * @private
         */
        function _handler(event) {
            // check to make sure the origin of the event is valid
            if(!_isValidOrigin(event.origin)) return;

            var data = event.data;

            // handle incoming requests
            if(data.type === 'request') {
                var handler = _listeners[data.name],
                    response = new Response(data, event.source, event.origin, handler);

                return response.send();
            }

            // handle incoming responses
            if(data.type === 'response') {

                // handle success responses
                if (data.success) {
                    _requests[data.id].resolve(data.message);
                    return _disposeRequest(data.id);
                }

                // handle error responses
                _requests[data.id].reject(data.error);
                _disposeRequest(data.id);
            }
        }

        /**
         * Remove the given request id from the request cache
         * @param id
         * @private
         */
        function _disposeRequest(id) {
            delete _requests[id];
        }

        /**
         * Check if origin is in the allowedOrigins
         * @param origin
         * @returns {boolean}
         * @private
         */
        function _isValidOrigin(origin) {
            for(var i = 0, o; o = _allowedOrigins[i]; i++)
                if(o === origin) return true;

            return false;
        }


        function _allowFrom(url) {
            if(!Array.isArray(url)) {
                if(url == _thisOrigin) return;
                return _allowedOrigins.push(url);
            }

            for(var i = 0; i < url.length; i++)
                _allowedOrigins.push(url[i]);
        }

        /**
         * Dispatches the payload to the given target
         * @param target
         * @param origin
         * @param payload
         * @private
         */
        function _dispatch(target, origin, payload) {
            target.postMessage(JSON.stringify(payload), origin);
        }

        /**
         * Class representing a request to another window
         * @param name
         * @param message
         * @constructor
         */
        function Request(name, message) {
            this.id = _.uniqueId(); // todo: create function to create true unique id
            this.type = 'request';
            this.name = name;
            this.message = message;

            _requests[this.id] = Promise;
        }

        Request.prototype.send = function() {
            this.targetSource = this.targetSource || _thisWindow;
            this.targetOrigin = this.targetOrigin || _thisOrigin;

            // send messaage to registered windows
            for(var name in _windows) {
                if(!_windows.hasOwnProperty(name)) continue;
                _dispatch(_windows[name].source, _windows[name].origin, this);
            }
        };

        /**
         * Class representing a response back to another window
         * @param request
         * @param source
         * @param origin
         * @param messageHandler
         * @constructor
         */
        function Response(request, source, origin, messageHandler) {
            this.id = request.id;
            this.type = 'response';
            this.name = request.name;
            this.targetSource = source;
            this.targetOrigin = origin;

            try {
                this.message = messageHandler(request);
                this.success = true;
            } catch (e) {
                this.error = e;
                this.success = false;
            }
        }

        Response.prototype.send = function() {
            _dispatch(this.targetSource, this.targetOrigin, this);
        };
    }

    Radio.prototype = {
        start: function(_window) {
            // store the window

            // make request to initialize radio on other _window
        },
        /**
         * Sets allowable origins for all incoming messages to the current window
         * @param url - String or Array[String]
         * @returns {void}
         */
        allowFrom: _allowFrom,
        /**
         * Create a handler for the given event name. This will listen to incoming messages and check event.data.name for a match.
         * If there is no match, an error will be returned in the response. To set a default handler for all incoming messages just
         * pass the handler as the only argument.
         * @param name - Optional
         * @param handler
         */
        listen: function(name, handler) {
            var isHandler = typeof name === 'function';

            handler = isHandler ? name : handler;
            name = isHandler ? '*' : name;

            _listeners[name] = handler;
        },
        /**
         * Send a message to another radio listener (ie: another window). If no name is specifed and only the message is passed
         * then it will be passed under the '*' name.
         * @param message
         * @returns {*}
         */
        send: function(message) {
            // create a new Request so we can store it to wait for the response
            var req = new Request('*', message);
            return req.send();
        }
    };

    return Radio;
});