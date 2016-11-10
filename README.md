# DV-JS-SDK
The Devless JS SDK provides a host of functions for working with data from the Devless backend.

##### Getting Started
There are a couple of ways to introduce the  sdk into your application 
1. Using the [CDN](http://library.devless.io/cdn/dv-beta-1/dv_sdk.js)  
2. Downloading from the [Github Repo](https://github.com/DevlessTeam/DV-JS-SDK/edit/master/README.md)

Once you have the SDK in your application you may now head over to your Devless instance , then the App Tab , from there you can click on connect to my App and copy the connection details under the web tab . It should look something like below
```
var constants = { "token":"955c8a0dc37b4a22b5950a9e0e9491d0", "key":"TEMPORAL-KEY", "domain":"http://localhost:9000" }
Devless = new Devless(constants);
```
 You can follow up on connection status from the console tab of your browser developer tool.

**queryData:**

Access or query data from any table from the backend using this function.

```
params={
    size:2,
    offset:2,
    orderBy:"name"
    where:["id,1","name,edmond"]
}

Devless.queryData("serviceName", "tableName", params, function(response){
  console.log(response)
});

 Eg: Devless.queryData("serviceName", "table", params, function(response){
      console.log(response)
 });
```

* To query data from the Devless backend you need  to specify the service name, table from which to query  and then a callback function.
* Also you may pass query parameters. for example determine the number of results sent back with the ``size`` parameter,
``orderBy`` param to order the results in descending order based  on a particular field eg ``params= {order:"content"}``.
* The ``where`` parameter gets data where the key id is equal to 2 ``params= {where:["id,2"]}``.

**addData:**

You may add data to a service table using 
```
Devless.addData("serviceName", "tableName", data,  function(response){
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
Devless.addData("serviceName", "tableName", data, function(response){console.log(response)})
```
**updateData:**

You may update data in a service table using ``Devless.updateData("serviceName", "tableName", "identifier_type", "identifier", data, callback)``
where data is a JSON object.
eg:

```
data = {
  "title":"the bear",
  "content": "all about the bear"
}
Devless.updateData("serviceName", "tableName", "id", "1", data, callback)
```
The functions parameters are pretty obvious the identifier_type refers to the field used to select the field to update and the next param is the id value 

**delete:**

You may delete data  using ``Devless.deleteData(serviceName, table, where_key, where_value, callback)``

eg:

```
Devless.deleteData("serviceName", "table", "id", 1, function(response){console.log(response)})
```
**token:**
You will need to set an access token incase you need to login a user 
You can set user access token with ``Devless.token(token, callback)``
You can have access to the current token with ``Devless.token(callback)``

**response structure**
* All response from the Devless backend have status_code where 700 means internal failure
* A message with verbose response to the event 
* An array payload containing returned results and properties 





