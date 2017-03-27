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


Startup
-------

1. Log into the server, and create a session that can be disconnected from: <code>screen</code>

2. Become the application user: <code>sudo su - pi</code>

3. Change into the application directory: <code>cd /opt/app/thinfin_btn</code>

4. Start the web server with <code>nodejs server.js</code>

6. Disconnect from the session by pressing: CTRL-A, then the D key

7. Resume the session later with: <code>screen -r</code>

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
