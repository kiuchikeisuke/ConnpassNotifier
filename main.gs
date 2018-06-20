Const = {
  webhookUrl: "https://hooks.slack.com/services/XXXXXXXXXXXXX",
  spreadSheetId: "XXXXXXXXXXXXX",
  sheetName: "data",
  lastcheckedTimestampIndex: 0
}

function timer() {
  doCheck();
}

function doCheck() {
  var timestamp = Moment.moment();
  searchMail();
  setLastCheckedTimestamp(timestamp);
}

function searchMail() {
  var threads = GmailApp.search("label:connpass", 0, 20);
  var lastCheckedTimestamp = Moment.moment(getLastCheckedTimestamp());
  for each(var thread in threads) {
    var recievedDate = thread.getLastMessageDate();
    var targetTimestamp = Moment.moment(recievedDate);
    if(targetTimestamp.isAfter(lastCheckedTimestamp)) {
      var messages = thread.getMessages();
      var message = messages[0];
      var subject = message.getSubject();
      var body = message.getBody();
     
      var url = body.match(/<a href="https:\/\/.+\.connpass\.com\/event\/.+\/.+utm_content=detail_btn"/);
      if(url != null) {
        url = url[0].substring('<a href="'.length, url[0].lastIndexOf('/') + 1);
         
        var msg = "*" + subject + "* \n" + url;
        postToSlack(msg);
      }
    }
  }
}

function getLastCheckedTimestamp() {
  var data = getSheet().getDataRange().getValues();
  return data[Const.lastcheckedTimestampIndex][0];
}

function setLastCheckedTimestamp(timestamp) {
  var sheet = getSheet();
  sheet.getRange(1, 1).setValue(timestamp.format('YYYY/MM/DD HH:mm'));
}

/***************************************
 * Slackに投稿させる内容を作る
 ***************************************/
function postToSlack(message) {
  sendHttpPostForSlack(message); // Post
}
/***************************************
 * Slackに投稿
 ***************************************/
function sendHttpPostForSlack(message)
{
  var jsonData =
  {
     "text" : message,
    "unfurl_links": true
  };
  var payload = JSON.stringify(jsonData);
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };
 
  UrlFetchApp.fetch(Const.webhookUrl, options);
}

function getSheet() {
  if (getSheet.instance) { return getSheet.instance; }
  var sheet = SpreadsheetApp.openById(Const.spreadSheetId).getSheetByName(Const.sheetName);
  return sheet;
}
