# Express_App


# CSYE 6225 Assignment 9

This assignment is for creating rest end point for checking health end point for get end point, user endpoints for put, post and get methods.

## Softwares Used:

1. VSCode.
2. Postman
3. SQLWorkBench

## How to Build?

1. The project resides on the repo webapp in SaiCharan-Northeastern organization.
2. To make changes to the repo code, fork the repo and clone it locally by running the below command: `git clone <link to forked repo>`
3. After cloning the repo locally run the below command after opening the project in IDE of choice:
   `npm i`

## How to Test?

1. Once the project is open you can run the below command to run tests that are pre written in the codebase :
   `npm test`
2. To test the API end points manually, move to the root folder of the project and run `node server.js`
3. Once you get a prompt that "server is listening on port 3300" open postman or any rest client.
4. The end points and the expected results are mentioned in [swaggerLink](https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a1#/)

## How to Deploy?

1. Once the changes are made in the feature branch locally, add the changed files to the branch using the below command: `git add <file names>`
2. Once this is done, commit the changes and push them to the feature branch.
3. Now create a Pull request to merge the changes to the organization repo after the github action runs successfully.

## Programming Lanuage used

Node.js -19.x

## Third party libraries

Below are the dependencies used for building the project:

"bcrypt": "^5.1.0",
"chai": "^4.3.7",
"express": "^4.18.2",
"mocha": "^10.2.0",
"mysql2": "^3.1.0",
"sequelize": "^6.28.0",
"supertest": "^6.3.3"
