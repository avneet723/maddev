# MAD Web Dev #
- [Setting up development](#dev)
    - [Editor](#dev_editor)
    - [Installing Node.js](#dev_node)
    - [Setting up MongoDB](#dev_mongodb)
- [Parsing Data](#parsing)
    - [phantomjs](#parsing_phantom)

<a id="dev"></a>
## Setting up development ##

<a id="dev_editor"></a>
### Editor ###
Use any editor you like!

<a id="dev_node"></a>
### Installing Node.js ###
Visit their [download page](http://nodejs.org/download/).

<a id="dev_mongodb"></a>
### Setting up MongoDB ###
Charlie, I'll leave this to you - you're the expert on it! - Trev

<a id="parsing"></a>
## Parsing Data ##


<a id="parsing_phantom"></a>
### phantomjs ###
[PhantomJS](http://phantomjs.org/) is a great tool for parsing data from websites as it allows you control a headless WebKit browser using JavaScript.

Any `*.js` file in the parsing directory is most likely going to require [PhantomJS](http://phantomjs.org/) to run*:

    >>> phantomjs scriptName.js > outputFile

<sub>*If you view the source of the script, and it includes `require('webpage').create();` near the top, then it will require PhantomJS.</sub>