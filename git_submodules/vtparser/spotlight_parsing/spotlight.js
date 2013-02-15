var rootSite = 'http://www.vt.edu/spotlight/';

// array of links that lead to listings of archives
var spotlightArchiveLinks = [];

var page = require('webpage').create();

var loadInProgress = false;

page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

var openPage = function(url) {
  page.open(url);
};

var injectJQuery = function() {
  page.injectJs('jquery-1.8.0.min.js');
};

// Keeps track of what we are going to actually do. We will push functions
// into this step array and run them one at a time at the end of the program.
// If a "step" reloads the page / redirects to another page - it will be
// handled by waiting for the page to finish loading.
var steps = [];

// This is the object that we will convert at the end into a JSON String that
// holds all the data contained in the timetable of classes.
var retObj = {};

var getSpotlightArchiveLinks = function() {
  var spotlightLinks = page.evaluate(function() {
    // grabs all the links to the spotlight archives
    var rawLinks = $('#vt_body_col > p > a');
    var links = [];
    rawLinks.each(function() {
      links.push(this.href);
    });

    return JSON.stringify(links);
  });

  spotlightArchiveLinks = JSON.parse(spotlightLinks);
};

var parseSingleSpotlight = function(args) {
  var categoryUrl = args[0], spotlightUrl = args[1];

  var ret = JSON.parse(page.evaluate(function() {
    // get the article title
    var spotTitle = $('#vt_body_col > h2').text().trim();

    // grabs all images that exist within this specific spotlight
    var spotImages = $('img', $('#vt_body_col'));
    var images = [];
    spotImages.each(function() {
      images.push({
        src: this.src,
        alt: this.alt.trim()
      });
    });

    // grabs all the spotlight content / text in the order it appears
    // (h4 headers included because why miss out on lovely information??)
    var spotContent = $('#vt_body_col > p, h4');
    var content = [];
    spotContent.each(function() {
      content.push({
        tag: this.tagName,
        html: this.innerHTML.trim()
      });
    });

    var ret = {
      title: spotTitle,
      images: images,
      content: content
    };

    return JSON.stringify(ret);
  }));

  // console.log(ret.title);

  retObj[categoryUrl][spotlightUrl].title = ret.title;
  retObj[categoryUrl][spotlightUrl].images = ret.images;
  retObj[categoryUrl][spotlightUrl].content = ret.content;
};

var gatherIndividualSpotlights = function() {

  // var testsize = function(obj) {
  //     var size = 0, key;
  //     for (key in obj) {
  //         if (obj.hasOwnProperty(key)) size++;
  //     }
  //     return size;
  // };

  // loop though the spotlight categories
  // (Innovation, Achievement, Impact, etc)
  for(var spotlightCategoryLink in retObj) {
    // console.log(spotlightCategoryLink);
    // listing of spotlights inside of this category
    var spotlightArchiveListing = retObj[spotlightCategoryLink];

    // loop through every single dang link, open it, inject JQuery, and
    // parse the heck out of it & tack on to the retObj
    for(var singleSpotlightLink in spotlightArchiveListing) {
      // console.log('    ' + singleSpotlightLink);
      steps.push({ func: openPage, args: singleSpotlightLink });
      steps.push({ func: injectJQuery });
      steps.push({ func: parseSingleSpotlight,
                   args: [spotlightCategoryLink, singleSpotlightLink] });
    }
  }
};

// Handles the list of archives (assumes that we're on a particular spotlights
// archive list)
var handleSpotlightArchiveList = function(archiveListLink) {

  var ret = JSON.parse(page.evaluate(function() {
    // grabs all the spotlight archive links
    var spotLinks = $('.vt_sn_spotlight > h3 > a');
    // grabs all the spotlight descriptions
    var spotDescs = $('.vt_sn_spotlight > div');

    // hopefully they're the same length, just throwing this in to prevent
    // any errors that could happen?
    var len = Math.min(spotLinks.length, spotDescs.length);
    var ret = {};

    for(var i = len - 1; i >= 0; --i) {
      var spotlightLink = spotLinks[i].href;
      var spotlightShortDesc = spotDescs[i].innerText.trim();
      ret[spotlightLink] = {
        link: spotlightLink,
        shortDesc: spotlightShortDesc
      };
    }

    return JSON.stringify(ret);
  }));

  retObj[archiveListLink] = ret;
};

// loops through all the spotlight links and sets up the steps to take to
// parse the data on each page
var initSpotlightArchives = function() {
  for(var i = spotlightArchiveLinks.length - 1; i >= 0; --i) {
    steps.push({ func: openPage, args: spotlightArchiveLinks[i] });
    steps.push({ func: injectJQuery });
    steps.push({ func: handleSpotlightArchiveList,
                 args: spotlightArchiveLinks[i] });
  }

  steps.push({ func: gatherIndividualSpotlights });
};

//
//
//
//

steps.push({ func: openPage, args: rootSite });
steps.push({ func: injectJQuery });
steps.push({ func: getSpotlightArchiveLinks });
steps.push({ func: initSpotlightArchives });


// This chunk of code is responsible for running the steps that we have
// provided in the previous sections. It allows for easy page transitions
// and other good stuff.
//
// Modified from: http://stackoverflow.com/questions/9246438/ to accept
// arguments for functions that have been dynamically added to the steps
// along with other various things.
//
var stepIndex = 0; // The current async function that we are on.

interval = setInterval(function() {

  if (stepIndex < steps.length && !loadInProgress &&
      typeof steps[stepIndex].func === 'function')
  {
    steps[stepIndex].func(steps[stepIndex].args);
    stepIndex++;
  }

  if (stepIndex >= steps.length ||
      typeof steps[stepIndex].func !== 'function')
  {
    console.log(JSON.stringify(retObj, null, 4));
    phantom.exit();
  }

}, 50);
