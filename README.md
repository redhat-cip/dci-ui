Distributed CI web application
==============================

This repository is used by the web application of Distributed CI.
It contains all files necessary to run a static web app pluggable
through CORS on a DCI server.

Getting started
---------------

To run the app in development mode follow those steps:

* clone this repository
* ensure that control server is running (ex: on localhost:5000) see `dci-dev-env`
* install node dependencies: `npm install`
* run the development server : `npm run dev`

Build tools
-----------

To manage the workflow the project use npm scripts

Command list:

* **npm start**: start web server without live reload

* **npm run dev**: start web server with live reload

* **npm run build**: build application in `static/` folder

* **npm run test:unit**: start unit test

* **npm run test**: run end to end tests on the application
