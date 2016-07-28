Geo-Poetry Demo
=================

This is a simple browser frontend for the Geo-Poetry E-literature system. The system produces crowd-sourced, computer-generated poetry and mood music for the user's current location.

The frontend is a single-page application, the `demo.html` page. It can be served by any standard HTTP server. For instance, if you have Python 2.7 installed, you can navigate to the root directory of the project and run
	python -m SimpleHTTPServer

The application will now be accessible at `http://localhost:8000/demo.html`.


Connecting to the Server
------------------------

The application needs to connect to an instance of the Geo-Poetry Server (see the source at [https://github.com/UCI-TPL/geo-poetry-server](https://github.com/UCI-TPL/geo-poetry-server)). It currently assumes that the server is accessible at `http://localhost:5000`, but this can be configured by changing the variable `SERVER_BASE_URL` in the file `demo.js`.


Credits
-------

This application is made with [AngularJS](https://angularjs.org/) and includes code from the open-source project [https://github.com/FCSAmerica/angular-fcsa-number](https://github.com/FCSAmerica/angular-fcsa-number).