Distributed CI web application
==============================

This repository is used by the web application of Distributed CI.
It contains all files necessary to run a static web app pluggable
through CORS on a DCI server.

Getting started
---------------

To run the app in development mode follow those steps:

* clone this repository
* ensure that the API server is running (ex: on localhost:5000)
* fill up the server url in the `config template file <src/config.json.tplt>`_
* run the development server by typing: ``gulp serve:dev``

Build tools
-----------

To manage the workflow the project use `gulp <http://gulpjs.com/>`_, to
run a specific just type: ``gulp <command>``

Command list:

* **jscs**: javascript linter, ensure that javascript files are compliant
  with our guidelines

* **build**: build the application into the ``static`` folder, this is used
  by the dev server

* **clean**: remove all files into ``static`` folder, this is usefull if
  you want to be sure to fully regenerate the application

* **serve:dev**: run a development server, with a watcher on source files
  in order to dynamically reload page on changes

* **test:e2e**: run end to end tests on the application with
  `protractor <https://angular.github.io/protractor/#/>`_

* **test:e2e:debug**: run end to end tests on debug mode, more
  precisions available `here <#test-debug>`_

There is plenty more tasks in the gulpfile but there are not useful for a
end user and are used internally by tasks.

Test debug
----------
For this part please use the
`dci-dev-env <https://github.com/redhat-cip/dci-dev-env>`_

It is sometimes usefull to debug e2e tests, the workflow is not
straightforward so here is a quick tutorial:

We will run google chrome with the chromedriver in a docker container
in order to avoid polluting our computer. We will have to share X
with the container, so run ``xhost +`` in order to enable this feature.

Now, we have to stop the test execution to the point we want to debug,
to do that add ``browser.pause();`` at whatever line you want in the test
file (test are living `here <test>_`).

Run the tests in debug mode by typing ``gulp test:e2e:debug``, this will run a
nodejs process and enter the REPL, just type ``c`` to continue the process.
A chromium browser should open and pause at the line you specify before.

**BEWARE** browser.pause is a beta feature and does not provide stable
workflow, it is good enough for debugging some tests but do not place
high expectations on it.

You can find more information
`here <https://angular.github.io/protractor/#/debugging>`_ for debugging
tests.
