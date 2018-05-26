# dci-ui

Source code for dci user interface. [https://distributed-ci.io](https://distributed-ci.io)
dci-ui is a static web app pluggable through CORS on a DCI server.

## Getting started

To run the app in development mode follow those steps:

 * clone this repository
 * ensure DCI api is listening on localhost:5000. See `dci-dev-env`. An alternative is to consume an existing API (edit apiURL in [src/config.json](src/config.json))
 * install node dependencies: `npm install`
 * run the development server : `npm start`

## Build tools

To manage the workflow the project use npm scripts

Command list:

 * `npm start`: start web server with live reload
 * `npm run build`: build application in `static/` folder
 * `npm run test:unit`: start unit test
 * `npm test`: start unit and end to end tests

