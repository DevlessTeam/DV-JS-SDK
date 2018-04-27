/**
      @author Devless
      @version 1
      @description Devless sdk for Javascript	
      */
    /* Initizialize library */

    (function (global /*this will contain the global window object*/) {
        "use strict";

        var baseUrl = "/api/v1/service/"; //makes reference to service url easier

        //this func help create devless instance without having to use the new operator. 
        //which is easy to forget sometimes.(idea borrowed from jquery)
        var Devless = function (constants) {
            //just return if nothing is passed. no need to instantiate
            if (!constants) {
                console.error("Your app failed to  connect to Devless ): Please make sure token and key is set properly ");
                return;
            }
            console.info("App is trying to connect to Devless ...");
            var sub_url = baseUrl + "/dvauth/script";
            var data = {};
            var DevlessInstance = new Devless.init(constants);
            global.returnedInstance = ''; //serve a hook for devless instance . will be taken off if i find a better way

            //call is used to control the (this) instance to use ,bcoz requestProcessor is treated as private function 
            requestProcessor.call(DevlessInstance, data, sub_url, "POST", function (response) {
                response = JSON.parse(response);
                if (response.status_code == 631) {

                    console.error("Your app failed to  connect to Devless ): Please make sure token and key is set properly ");
                } else if (response.status_code == 1000) {

                    console.debug("Your app connected to Devless successfully and you have auth service installed");
                    returnedInstance = DevlessInstance; //and returns a new Devless instance only if connected successfully

                } else {
                    console.info("Your app connected to Devless successfully");
                    returnedInstance = DevlessInstance; //returns a new Devless instance only if connected successfully

                }
            }, true);

            return DevlessInstance;
        }

        Devless.prototype = {
            queryData: queryData,
            addData: addData,
            updateData: updateData,
            deleteData: deleteData,
            getToken: getToken,
            setToken: setToken,
            call: call,
            publicWS: WS,
            signUp: signUp,
            signIn: signIn,
            updateProfile: updateProfile,
            getProfile: getProfile,
            logout: logout
        };

        Devless.init = function (constants) {
            var Self = this; //using this can be ambigiouse in certain context. so  i aliased it to point to this very constructor.
            Self.devless_token = constants.token;
            Self.devless_instance_url = constants.domain;
        }

        Devless.init.prototype = Devless.prototype;



        //add options to params object
        function queryData(serviceName, table, params, callback) {
            params = params || {};
            var parameters = "";

            //get nested params 
            var innerParams = function (key, params) {
                for (var eachParam in params) {
                    parameters = "&" + key + "=" + params[eachParam] + parameters;
                }

            }
            //organise parameters
            for (var key in params) {
                if (!params.hasOwnProperty(key)) { /**/ }
                if (params[key] instanceof Array) {
                    innerParams(key, params[key])
                } else {
                    parameters = "&" + key + "=" + params[key] + parameters;
                }

            }

            var sub_url = baseUrl + serviceName + "/db?table=" + table + parameters;

            requestProcessor.call(this, "", sub_url, "GET", function (response) {
                callback(response);
            })
            return this;
        }

        function addData(serviceName, table, data, callback) {

            var payload = JSON.stringify({
                "resource": [{
                    "name": table,
                    "field": [

                        data
                    ]
                }

                ]
            });

            var sub_url = baseUrl + serviceName + "/db";
            requestProcessor.call(this, payload, sub_url, "POST", function (response) {

                callback(response);

            });
            return this;

        }

        function updateData(serviceName, table, where_key, where_value, data, callback) {

            var payload = JSON.stringify({
                "resource": [{
                    "name": table,
                    "params": [{
                        "where": where_key + "," + where_value,
                        "data": [
                            data
                        ]

                    }]
                }

                ]
            });

            var sub_url = baseUrl + serviceName + "/db";
            requestProcessor.call(this, payload, sub_url, "PATCH", function (response) {
                callback(response);
            });
            return this;
        }

        function deleteData(serviceName, table, where_key, where_value, callback) {

            var payloadObj = {
                "resource": [{
                    "name": table,
                    "params": [{
                        "where": where_key + ",=," + where_value
                    }]
                }

                ]
            };

            payloadObj.resource[0].params[0]['delete'] = "true";

            var payloadStr = JSON.stringify(payloadObj);

            var sub_url = baseUrl + serviceName + "/db";

            requestProcessor.call(this, payloadStr, sub_url, "DELETE", function (response) {

                callback(response);

            });
            return this;
        }

        function getToken(callback) {
            var withCallback = callback || false;
            if (withCallback) {
                callback(localStorage.getItem('devless_user_token' + this.devless_instance_url + this.devless_token));
            } else {

                return localStorage.getItem('devless_user_token' + this.devless_instance_url + this.devless_token)
            }

        }

        function setToken(token) {
            localStorage.setItem('devless_user_token' + this.devless_instance_url + this.devless_token, token);
            return true;
        }

        function call(service, method, params, callback) {

            var payload = JSON.stringify({
                "jsonrpc": "2.0",
                "method": service,
                "id": getId(1, 10000000),
                "params": params
            });

            var sub_url = baseUrl + service + "/rpc?action=" + method;

            requestProcessor.call(this, payload, sub_url, "POST", function (response) {

                callback(response);

            });
        }

        function getId(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function WS(callback) {
            var es = new EventSource('https://7058c724.fanoutcdn.com/test/sse');
            es.addEventListener('message', function (event) {
                callback(JSON.parse(event.data.slice(0, -1)));
            }, false);

        }

        function signUp(details, callback) {
            var innerSelf = this;
            this.call('devless', 'signUp', [details.email, details.password,
            details.username, details.phone, details.firstname, details.lastname, null], function (resp) {
                innerSelf.setToken(resp.payload.result.token);
                console.log("response on siging up => ", resp.payload.result);
                callback(resp.payload.result);
            });
        }

        function signIn(details, callback) {
            var innerSelf = this;
            this.call('devless', 'login', [details.username, details.email, details.phone, details.password],
                function (response) {
                    innerSelf.setToken(response.payload.result.token);
                    callback(response.payload.result);
                });

        }

        function updateProfile(details, callback) {
            this.call('devless', 'updateProfile', [details.email, details.password,
            details.username, details.phone, details.firstname, details.lastname, 'anything else'],
                function (response) {
                    callback(response.payload.result);
                });

        }

        function getProfile(callback) {
            this.call('devless', 'profile', [], function (response) { callback(response) })
        }

        function logout(callback) {
            this.call('devless', 'logout', [], function (response) { callback(response) })
        }
        //Took off the requestPrecessor from the base prototype to make it private for internal operations only.
        //it is inaccessible outside but can be called within because of its lexical scope with respect to the
        //other function. 
        function requestProcessor(data, sub_url, method, callback, parse) {
            parse = parse || false;

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {


                var response = '';
                if (this.readyState === 4 && parse == false) {
                    if (this.status == 200) {
                        response = JSON.parse(this.responseText);
                        callback(response);
                    } else {
                        callback(response);
                        console.error("Devless cannot be found at " + this.devless_instance_url + " Please copy the url from the `App tab`  on you Devless instance by clicking on  `connect to my app`")
                    }


                } else if (this.readyState === 4 && parse == true) {

                    if (this.status == 200) {
                        response = this.responseText;
                        callback(response);
                    } else {
                        callback(response);
                        console.error("Devless cannot be found at " + this.devless_instance_url + " Please copy the url from the `App tab`  on you Devless instance by clicking on  `connect to my app`")
                    }
                }
            });

            xhr.open(method.toUpperCase(), this.devless_instance_url + sub_url);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("devless-token", this.devless_token);
            if (localStorage.getItem('devless_user_token' + this.devless_instance_url + this.devless_token) != "") {

                xhr.setRequestHeader("devless-user-token", localStorage.getItem('devless_user_token' + this.devless_instance_url + this.devless_token));
            }



            xhr.send(data);

        }
        global.Devless = global.DV = Devless; //exposes devless to the world;
    })(window /*injects the window object into the library.*/);
