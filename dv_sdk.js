/**
@author Devless
@version 0.01
@description Devless sdk for Javascript
*/
/* Initizialize library */

'use strict'

/**
 * Devless Prototype function
 */

var Devless = function (constants) {
  /** @global */
  /* global XMLHttpRequest */
  window.devless_token = constants.token
  window.devless_instance_url = constants.domain
  window.DEVLESS_STATUS_CODES = {
    MALFORMED_JSON_OBJECT: 400,
    INTERNAL_SERVER_ERROR: 700,
    TOKEN_UPDATED_SUCCESSFULLY: 622,
    TOKEN_NOT_UPDATED: 623,
    ENDPOINT_NOT_OPEN: 624,
    USER_NOT_AUTHENTICATED: 628,
    EXPIRED_TOKEN: 633,
    UNIDENTIFIED_VALIDATOR_TYPE: 618,
    ACCESS_REVOKED: 631,
    JSON_PUSH_FAILURE: 630,
    INNACESSIBLE_RESOURCE: 627,
    METHOD_NOT_SUPPORTED: 608,
    SERVICE_NOT_EXIST_OR_ACTIVE: 604,
    SERVICE_RESOURCE_UNAVAILABLE: 605,
    CONNECTED_WITH_AUTH: 1000
  }

  // check if connection was successfull
  var data = {}
  console.info('App is trying to connect to Devless ...')
  var subUrl = '/api/v1/service/dvauth/script'
  var options = {
    subUrl: subUrl,
    method: 'POST',
    parse: true
  }
  this.requestProcessor(data, options, function (error, response) {
    if (error) {
      console.error(error)
    } else {
      response = JSON.parse(response)
      console.log(response)
      if (response.status_code === window.DEVLESS_STATUS_CODES.ACCESS_REVOKED) {
        console.error('Your app failed to  connect to Devless ): Please make sure token and key is set properly ')
      } else if (response.status_code === window.DEVLESS_STATUS_CODES.CONNECTED_WITH_AUTH) {
        console.debug('Your app connected to Devless successfully and you have auth service installed')
      } else {
        console.debug('your app connected to Devless successfully. you can get services from store.devless.io ')
      }
    }
  })

  return this
}

// add options to params object
Devless.prototype.queryData = function (serviceName, table, params, callback) {
  params = params || {}
  var parameters = ''

  // get nested params
  var innerParams = function (key, params) {
    for (var eachParam in params) {
      parameters = '&' + key + '=' + params[eachParam] + parameters
    }
  }
    // organise parameters
  for (var key in params) {
    if (!params.hasOwnProperty(key)) { /**/ }
    if (params[key] instanceof Array) {
      innerParams(key, params[key])
    } else {
      parameters = '&' + key + '=' + params[key] + parameters
    }
  }

  var subUrl = '/api/v1/service/' + serviceName + '/db?table=' + table + parameters
  var options = {
    subUrl: subUrl,
    method: 'GET'
  }

  this.requestProcessor('', options, function (error, response) {
    callback(error, response)
  })
  return this
}

Devless.prototype.addData = function (serviceName, table, data, callback) {
  var payload = JSON.stringify({
    'resource': [{
      'name': table,
      'field': [
        data
      ]
    }
    ]
  })

  var subUrl = '/api/v1/service/' + serviceName + '/db'
  var options = {
    subUrl: subUrl,
    method: 'POST'
  }
  this.requestProcessor(payload, options, function (error, response) {
    callback(error, response)
  })
  return this
}

Devless.prototype.updateData = function (serviceName, table, whereKey, whereValue, data, callback) {
  var payload = JSON.stringify({
    'resource': [{
      'name': table,
      'params': [{
        'where': whereKey + ',' + whereValue,
        'data': [
          data
        ]
      }]
    }
    ]
  })

  var subUrl = '/api/v1/service/' + serviceName + '/db'
  var options = {
    subUrl: subUrl,
    method: 'PATCH'
  }
  this.requestProcessor(payload, options, function (error, response) {
    callback(error, response)
  })
  return this
}

Devless.prototype.deleteData = function (serviceName, table, whereKey, whereValue, callback) {
  var payloadObj = {
    'resource': [{
      'name': table,
      'params': [{
        'where': whereKey + ',=,' + whereValue
      }]
    }
    ]
  }

  payloadObj.resource[0].params[0]['delete'] = 'true'

  var payloadStr = JSON.stringify(payloadObj)

  var subUrl = '/api/v1/service/' + serviceName + '/db'
  var options = {
    subUrl: subUrl,
    method: 'DELETE'
  }

  this.requestProcessor(payloadStr, options, function (error, response) {
    callback(error, response)
  })
  return this
}

Devless.prototype.getToken = function (callback) {
  var devlessUserToken = window.sessionStorage.getItem('devless_user_token' + window.devless_instance_url + Devless.devless_token)
  var error = devlessUserToken ? null : new Error('Could not load Devless User Token')
  callback(error, devlessUserToken)
}

Devless.prototype.setToken = function (token) {
  window.sessionStorage.setItem('devless_user_token' + window.devless_instance_url + Devless.devless_token, token)
  return true
}

Devless.prototype.call = function (service, method, params, callback) {
  var payload = JSON.stringify({
    'jsonrpc': '2.0',
    'method': service,
    'id': Devless.getId(1, 10000000),
    'params': params
  })

  var subUrl = '/api/v1/service/' + service + '/rpc?action=' + method
  var options = {
    subUrl: subUrl,
    method: 'POST'
  }
  this.requestProcessor(payload, options, function (error, response) {
    callback(error, response)
  })
}

Devless.prototype.getId = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Make a request to the Devless Instance.
 * @param {Object} data - Data to be sent with request body.
 * @param {Object} options - Configuration Options.
 * @param {string} options.subUrl - Sub url for the endpoint.
 * @param {boolean} options.parse - Parse JSON or not.
 * @param {string} options.method - HTTP Method.
 */
Devless.prototype.requestProcessor = function (data, options, callback) {
  var xhr = new XMLHttpRequest()
  var errorMessage = 'Devless cannot be found at ' + window.devless_instance_url + ' Please copy the url from the `App tab`  on you Devless instance by clicking on  `connect to my app`'

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === 4 && !options.parse) {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText)
        callback(null, response)
      } else {
        callback(new Error(errorMessage), null)
        console.error(errorMessage)
      }
    } else if (this.readyState === 4 && options.parse) {
      if (this.status === 200) {
        response = this.responseText
        callback(null, response)
      } else {
        callback(new Error(errorMessage), null)
        console.error(errorMessage)
      }
    }
  })

  xhr.open(options.method.toUpperCase(), window.devless_instance_url + options.subUrl)
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.setRequestHeader('devless-token', window.devless_token)
  if (window.sessionStorage.getItem('devless_user_token' + window.devless_instance_url + window.devless_token)) {
    xhr.setRequestHeader('devless-user-token', window.sessionStorage.getItem('devless_user_token' + window.devless_instance_url + window.devless_token))
  }

  xhr.send(data)
}
