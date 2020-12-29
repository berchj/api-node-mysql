steps to use :
- clone this repo 

- import the database 

- install with npm the dependencies of the project

- configure the file lib/pool/index with the data you use in mysql server (user,password)

- run the command "npm run test" to start this application

use with curl :

- curl -X GET http://localhost:5900/api/products/

- curl -X POST -H "Content-Type: application/json" -d '{"name": "android","price": 600}' http://localhost:5900/api/products/ (for example)

- curl -X PUT -H "Content-Type: application/json" -d '{"name": "android","price": 600}' http://localhost:5900/api/products/2 (for example)

- curl -X DELETE -H "Content-Type: application/json" http://localhost:5900/api/products/2 (for example)
  
