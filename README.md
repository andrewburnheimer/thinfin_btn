thinfin_btn
============

More user-friendly gateway into Thinfinity Remote Desktop Server systems


License
-------

Commercial and private use are permitted. Distribution, modification, and sublicensing are all forbidden. Copyright details can be found in the file LICENSE.md.


Install
-------

Setup the node.js environment on the host with <code># apt-get update && apt-get install nodejs npm node-semver</code> as root.

Clone, or download a ZIP file from the github.inbcu.com repository site.

Change into that directory and fulfill the application requirements with <code>$ npm install</code>

Fulfill the startup requirements with <code>$ sudo npm install forever -g</code>

Place the startup script <code>$ sudo cp init\_d-thinfin\_btn /etc/init.d/thinfin\_btn</code>

Update the system service definitions <code>$ sudo update-rc.d thinfin\_btn defaults</code>


Startup
-------

Start the web server with <code>$ sudo service thinfin\_btn start</code>


Usage
-----

See web interface.


Contribute
----------

Please fork the GitHub project (https://github.inbcu.com/206443820)
make any changes, commit and push to GitHub, and submit a pull request.


Contact
-------

This project was initiated by Andrew Burnheimer.

* Email:
  * andrew.burnheimer@nbcuni.com
* Twitter:
  * @aburnheimer
* Github:
  * https://github.inbcu.com/206443820
