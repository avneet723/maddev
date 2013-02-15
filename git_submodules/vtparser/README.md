VT Parser
=========

Various parsing scripts that gather data from Virginia Tech's online services.

Timetable Parser
----------------

Parses the timetable of classes in it's entirety and stores it in JSON format. This will take roughly 2-5 minutes to parse.

Run with phantomjs:

    phantomjs timetable.js > sample_output.json


Spotlight Parser
----------------

Parses the "spotlight" section of Virginia Tech in it's entirety and stores it in JSON format. This will take roughly 5-10 minutes to parse.

Run with phantomjs:

    phantomjs spotlight.js > sample_output.json
