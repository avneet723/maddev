var site = 'https://banweb.banner.vt.edu/ssb/prod/HZSKVTSC.P_DispRequest';
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


// ---------------------------------------------------------------------------
// Timetable specific
// ---------------------------------------------------------------------------

// Given a value for a Subject, it will set the subject on the page to it, and
// click on the "FIND class sections" button
var loadSingleSubject = function(paramValue) {
  // It looks confusing, but we are just passing the parameter value into the
  // function page.evaluate. I usually wouldn't use "paramValue" as the
  // parameter name here, but I want to make things clear if anyone reads this
  page.evaluate(function(value) {
    $('select[name=SUBJ_CODE]').val(value);
    $('input[name=BTN_PRESSED]').first().click();
  }, paramValue);

};

// On a given Timetable page, this will return the entire table as an object
// such that:
//
//    {
//      "subject": someSubject (e.g. CS)
//      "courses": [
//        {
//          "crnValue": ...
//          "course": ...
//          "title": ...
//          "type": ...
//          "crhrs": ...
//          "instructor": ...
//          "days": ...
//          "begin": ...
//          "end": ...
//          "location": ...
//          "exam": ...
//        }, ...
//      ]
//    }
//
// Note that this documentation of the object is subject to change as this
// function dynamically changes based on what columns that Virginia Tech
// decides to use.
//
var getTableData = function(subject) {

  var tableData = page.evaluate(function(s) {

    // var debug = '';
    // var d = function(s) { debug = debug + s + '\n'; };

    // Holds this entire table in an object and till be added to as we
    // loop through the table.
    var ret = {
      subject: s,
      courses: []
    };

    // get the rows in this table
    var rawRows = $('.dataEntryTable > tbody > tr');

    // get the column types & the number of columns
    var columnTypes = [];
    rawRows.first().children().each(function() {
      // strip everything that isn't alphaNumeric, and make it lowercase
      var text = this.innerText.replace(/\W/g, '').toLowerCase();
      columnTypes.push(text);
    });

    // loop through the rest of the rows in this table (note how we sliced)
    // off element "0" as this is the heading of the table and we don't want
    // it in the data
    rawRows.slice(1);
    rawRows.each(function(rowIndex, row) {

      var rowObject = {};

      // loop through each of the columns in this row and populate the object
      // that represents it
      var columns = $(row).children();

      var i = 0;
      var columnLength = columns.length;
      var colspanShift = 0; // how many colspans have we skipped over?

      while (i < (columnLength + colspanShift)) {

        // Get the column accounting for columns that take up more than
        // one position
        var column = $(columns[i - colspanShift]);

        var text = column.text();
        // remove newlines, and only keep spaces, numeric & alpha values
        // trim space
        text = $.trim(text.replace(/\n|[^a-zA-Z0-9 ]/g, ''));

        // tricky case where there is a column span involved in which we have
        // to expand across multiple columns
        var colspan = column.attr('colspan');

        if (colspan && (colspan = parseInt(colspan, 10)) > 1)
        {
          // loop through however many columns it stretches, and set the
          // object values accordingly
          for (var j = 0; j < colspan; j++) {
            rowObject[columnTypes[i + j]] = text;
          }

          // push the loop counter to where we actually are after adjusting
          i += colspan;

          // adjust the column length so we cover all the values
          // columnLength += colspan - 1;
          colspanShift += colspan - 1;
        }
        else
        {
          rowObject[columnTypes[i]] = text;
          i++; // increment the column type counter
        }

      } // END column loop

      // Push this single row (course) onto the return object
      ret.courses.push(rowObject);

    }); // END each row loop

    // return "debug: " + debug + '\n'; // + JSON.stringify(ret, null, 4);
    return JSON.stringify(ret);

  }, subject);


  return JSON.parse(tableData);
};

var updateReturnObject = function(subject) {
  var tableData = getTableData(subject);
  retObj[subject] = tableData;
};

var initTimetableParser = function() {

  // `page.evaluate` is a sand boxed environment.
  // Nothing but Strings can be passed in and out.
  var subjectValueOptions = page.evaluate(function() {
    // Subject drop down options
    var subjectOptions = $('select[name=SUBJ_CODE] > option');

    var values = [];
    subjectOptions.each(function() { values.push(this.value); });

    // slice off the first value that does not relate to any subjects

    // For some reason this does not work in here, and we must do it outside
    // this sandbox. Annoying, but it's alright, we will start at position one
    // in the loop below.
    // values.slice(1);

    var ret = { optionValues: values };

    return JSON.stringify(ret);
  });

  // convert it back to a JavaScript Object (and pull out the array)
  subjectValueOptions = JSON.parse(subjectValueOptions);
  subjectValueOptions = subjectValueOptions.optionValues;

  // loop through all the possible subject value options, and parse the
  // information from the page.
  // See above in the evaluate on why we are starting at position one
  for (var i = 1; i < subjectValueOptions.length; i++)
  {
    var subject = subjectValueOptions[i];
    steps.push({ func: loadSingleSubject, args: subject });
    steps.push({ func: injectJQuery });
    steps.push({ func: updateReturnObject, args: subject });
  }
};

steps.push({ func: openPage, args: site });
steps.push({ func: injectJQuery });
steps.push({ func: initTimetableParser });


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