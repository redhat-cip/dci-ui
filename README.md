# dci-ui

Source code for dci user interface. [https://distributed-ci.io](https://distributed-ci.io)
dci-ui is a static web app pluggable through CORS on a DCI server.

## Getting started

To run the app in development mode follow those steps:

- clone this repository
- ensure DCI api is listening on localhost:5000. See `dci-dev-env`.
- install node dependencies: `npm install`
- run the development server : `VITE_BACKEND_HOST='http://127.0.0.1:5000' npm start`

## Build tools

To manage the workflow the project use npm scripts

List of commands:

- `npm start`: start web server with live reload
- `npm run build`: build application in `build/` folder
- `npm run test`: start unit test
