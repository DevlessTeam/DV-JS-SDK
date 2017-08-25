# DV-JS-SDK
The Devless JS SDK provides a host of functions for working with data from the Devless backend.

##### Getting Started
To introduce the SDK into your framework use the ```connect to app``` button within the DevLess framework 
![connect to app](https://github.com/EDDYMENS/service-images/blob/master/connect-to-app.png)


## Getting Started 
Paste the copied connection details from ```connect to app``` into your HTML or web page. You may check if connection has been established from the web console of your favourite browser.
You can follow up on connection status from the console tab of your browser developer tool.

**queryData:**

Access or query data from any table from the backend using this function.

```
params={
    size:2,
    offset:2,
    orderBy:"name",
    search:"field with name edmond",
    orWhere: ["age,2"],
    lessThan: ["age,1"],
    between: ["age,1,5"],
    greaterThan: ["age,20"],
    lessThanEqual: ["age,30"],
    greaterThanEqual: ["age,1"],
    where:["id,1","name,edmond"]
}

SDK.queryData("serviceName", "tableName", params, function(response){
  console.log(response)
});

 Eg: SDK.queryData("serviceName", "table", params, function(response){
      console.log(response)
 });
```

* To query data from the Devless backend you need  to specify the service name, table from which to query  and then a callback function.
* Also you may pass query parameters. for example determine the number of results sent back with the ``size`` parameter,
``orderBy`` param to order the results in descending order based  on a particular field eg ``params= {order:"content"}``.
* The ``where`` parameter gets data where the key id is equal to 2 ``params= {where:["id,2"]}``.

**N.B.** Pay attention to whitespaces. If the params doesn't contain whitespaces and you provide one, query will return no results.

**addData:**

You may add data to a service table using 
```
data = {"name":"edmond", "age":12};
SDK.addData("serviceName", "tableName", data,  function(response){
    console.log(response)
})
 ```
where data is a JSON object.
eg:

```
data = {
  "title":"the fox",
  "content": "all about the fox"
}
SDK.addData("serviceName", "tableName", data, function(response){console.log(response)})
```
**updateData:**

You may update data in a service table using ``SDK.updateData("serviceName", "tableName", "identifier_type", "identifier", data, callback)``
where data is a JSON object.
eg:

```
data = {
  "title":"the bear",
  "content": "all about the bear"
}
SDK.updateData("serviceName", "tableName", "id", "1", data, callback)
```
The functions parameters are pretty obvious the identifier_type refers to the field used to select the field to update and the next param is the id value 

**delete:**

You may delete data  using ``SDK.deleteData(serviceName, table, where_key, where_value, callback)``

eg:

```
SDK.deleteData("serviceName", "table", "id", 1, function(response){console.log(response)})
```
**Remote Precedure Call (rpc)**
``
SDK.call(serviceName, remoteProcedure, argsArray,callback);
``
eg:
```
SDK.call('AvengerService', 'assembleMethod', ["Hulk","Tor","Tony"],function(response){console.log(response)});
```

**Authentication**
Devless comes with authentication baked in.
You can access the authentication methods using the DevLess SDK

**Sign Up a user**
```
SDK.call('devless', 'signUp', ['example@mail.com', 'password', 'username', '+233540420521', 'firstname', 'lastname', 'anything else'],function(resp){SDK.setToken(resp.payload.result.token);console.log(resp.payload.result)});
```
**Sign in a user**
```
SDK.call('devless', 'login', ['username', 'example@mail.com', '+2330420521', 'password'], function(response){SDK.setToken(response.payload.result.token)});

```
### NB: You can use either username, email or phone_number in the authentication process. Just set the other params as empty strings except the password which is required.

**Get user profile**

```
SDK.call('devless', 'profile', [], function(response){console.log(response)})

```

**Update user profile**
```
SDK.call('devless', 'updateProfile', ['example@mail.com', 'password', 'username', '+2330540420521', 'firstname', 'lastname', 'anything else'], function(response){console.log(response)});

```
### NB: If you wish not to update any field within the profile just leave as empty string without spacing in between. 

**Logging user out**
```
SDK.call('devless', 'logout', [], function(response){console.log(response)})

```

**token:**
You will need to set an access token incase you need to login a user .
You can set user access token with ``SDK.setToken(token)`` .
You can have access to the current token with ``SDK.getToken()`` or you can pass an optional callback function to process the token.
``SDK.getToken(callback)``



**response structure**
* All response from the Devless backend have status_code where 700 means internal failure
* A message with verbose response to the event 
* An array payload containing returned results and properties 





