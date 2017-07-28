thinfin\_btn
============

More user-friendly gateway into Thinfinity Remote Desktop Server systems


License
-------

Commercial and private use are permitted. Distribution, modification, and sublicensing are all forbidden. Copyright details can be found in the file LICENSE.md.


Install
-------

Perform the following commands as root.

Setup the node.js environment on the host with <code># apt-get update && apt-get install nodejs npm node-semver</code>

Fix the Ubuntu naming error <code># ln -fs /usr/bin/nodejs /usr/local/bin/node</code>

Create the application directory <code># mkdir -p /opt/app</code>

Change into that directory and clone this repo., or download a ZIP file and inflate it there.

Set the ownership, as appropriate, <code># chown -R administrator:administrator /opt/app/thinfin\_btn</code>

Fulfill the startup requirements with <code># npm install forever -g</code>

Change into that directory and place the startup script <code># cd /opt/app/thinfin\_btn; cp init\_d-thinfin\_btn /etc/init.d/thinfin\_btn</code>

Update the system service definitions <code># update-rc.d thinfin\_btn defaults</code>

Create the runtime directory <code># mkdir -p /opt/run/forever/</code>

As the application user (not root), change into that directory and fulfill the application requirements with <code>$ npm install</code>


Startup
-------

In the application directory, <code>$ cp example\_facilities.json facilities.json; nano facilities.json</code>, as appropriate.

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
