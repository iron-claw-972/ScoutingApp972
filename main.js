const AUTO_DECISION_DEADBAND = .49;

const AUTO_SCALE_COLOR = 'blue'
const AUTO_SWITCH_COLOR = 'green'
const AUTO_LINE_COLOR = 'orange'
const AUTO_NONE_COLOR = 'red'

// Client ID and API key from the Developer Console
const CLIENT_ID = '706334826731-skluvlcun29l30bghou6oa6educgcflh.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBkABC_Q-vMyP0ML1O3AKiSp_YCKsxKUT4';
const spreadsheetId = '1XfIrmB9tNzBckh3W689WZToBLRnU2kwWatePk_pawoc';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

const defaultTable = '<tr>' +
  '<th onclick="sortDisplayTable(0)">Team</th>' +
  '<th onclick="sortDisplayTable(1)">Auto</th>' +
  '<th onclick="sortDisplayTable(2)">Switch</th>' +
  '<th onclick="sortDisplayTable(3)">Scale</th>' +
  '<th onclick="sortDisplayTable(4)">Climb</th>' +
  '<th onclick="sortDisplayTable(5)">Win</th>' +
  '</tr>'

var actualData = [];
var tableData = [];

function toFixed(value, precision) {
  var power = Math.pow(10, precision || 0);
  return String(Math.round(value * power) / power);
}

function sort(table, col, inv) {
  console.log('baadsfadsf')
  if (!inv) {
    table.sort(function(a, b) {
      return a[col] - b[col]
    })
  } else {
    table.sort(function(a, b) {
      return b[col] - a[col]
    })
  }
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {

  if (isSignedIn) {

    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'inline-block'

    console.log('start')

    // load cahche
    if (localStorage['actualData'] != 'undefined' && localStorage['actualData'] != undefined) {
      console.log(localStorage['actualData'])
      actualData = JSON.parse(localStorage['actualData'])

      sort(actualData, 0)
      setupTable(actualData)
      createChart('switch', actualData, 6)
      createChart('scale', actualData, 7)
      createChart('climbs', actualData, 10)
      createChart('wins', actualData, 12)
      $('#switch, #scale, #climbs, #wins').show()

      function sleepFor(sleepDuration) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
      }
      console.log('middle')
    }

    actualData = []

    gainAccess(function() {
      sort(actualData, 0)
      setupTable(actualData)
      createChart('switch', actualData, 6)
      createChart('scale', actualData, 7)
      createChart('climbs', actualData, 10)
      createChart('wins', actualData, 12)
      $('#switch, #scale, #climbs, #wins').show()

      console.log('finish')

      localStorage['actualData'] = JSON.stringify(actualData);
    })

  } else {

    authorizeButton.style.display = 'inline-block'
    signoutButton.style.display = 'none'

    $('#statsTable').hide()
    $('#switch, #scale, #climbs, #wins').hide()

  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/*
 * @param {object} google row object
 */
function appendRow(row) {
  var datarow = []
  datarow.push(row[0])
  for (var i = 1; i < row.length; i++) {
    datarow.push(toFixed(row[i], 3))
  }
  actualData.push(datarow)
}

function gainAccess(callback) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'stats!A2:M',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        if (JSON.stringify(row[3]) == '"#NAME?"') {
          console.log("waitin")
          setTimeout(gainAccess, 100)
          return
        }
        appendRow(row);
      }
    } else {
      console.log('No data found.');
    }
    callback();
  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function createRow(team, auto, switchAve, scaleAve, climb, win) {
  // var t = '<td><a href="team/?tn=' + team + '">' + team + '</a></td>'
  var t = '<td onclick="window.location.href = \'team/?tn=' + team + '\'"><a href="team/?tn=' + team + '">' + team + '</a></td>'
  // var t = '<td onclick="window.location.href = \'team/?tn=' + team + '\'">' + team + '</a></td>'
  var a = '<td>' + auto + '</td>'
  var sw = '<td>' + switchAve + '</td>'
  var sc = '<td>' + scaleAve + '</td>'
  var c = '<td>' + climb + '</td>'
  var w = '<td>' + win + '</td>'
  return '<tr>' + t + a + sw + sc + c + w + '</tr>'
}

function setupTable(table) {
  $('#statsTable').html(defaultTable)
  tableData = []

  for (var j = 0; j < table.length; j++) {
    row = table[j]
    var team = row[0]

    var auto;

    var autoScale = row[4];
    var autoSwitch = row[2];
    var autoLine = row[1];
    if (autoScale >= AUTO_DECISION_DEADBAND)
      auto = '<p data-score="a" style="color: ' + AUTO_SCALE_COLOR + '">SCALE<p>'
    else if (autoSwitch >= AUTO_DECISION_DEADBAND)
      auto = '<p data-score="b" style="color: ' + AUTO_SWITCH_COLOR + '">SWITCH<p>'
    else if (autoLine >= AUTO_DECISION_DEADBAND)
      auto = '<p data-score="c" style="color: ' + AUTO_LINE_COLOR + '">LINE<p>'
    else
      auto = '<p data-score="d" style="color: ' + AUTO_NONE_COLOR + '">NONE<p>'

    var switchAve = parseFloat(row[6]) + parseFloat(row[8])
    var scaleAve = row[7]

    var climb = row[10]
    var win = row[12]

    tableData.push([team, auto, switchAve, scaleAve, climb, win])

    document.getElementById('statsTable').innerHTML += createRow(team, auto, switchAve, scaleAve, climb, win)
  }
  $('#statsTable').show()
}

function sortDisplayTable(col) {
  $('#statsTable').html(defaultTable)
  sort(tableData, col)
  for (var j = 0; j < tableData.length; j++) {
    document.getElementById('statsTable').innerHTML += createRow(tableData[j][0], tableData[j][1], tableData[j][2], tableData[j][3], tableData[j][4], tableData[j][5])
  }
}