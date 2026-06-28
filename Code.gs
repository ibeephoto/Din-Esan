
const SHEET_NAME = "Customers";

function getSheet() {
  const ssId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!ssId) throw new Error("Missing SPREADSHEET_ID");

  const ss = SpreadsheetApp.openById(ssId);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp","name","phone","note"]);
  }
  return sheet;
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "list") {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();

    const records = data.slice(1).map(r => ({
      timestamp: r[0],
      name: r[1],
      phone: r[2],
      note: r[3]
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ok:true, records}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("OK");
}

function doPost(e) {
  const sheet = getSheet();
  const body = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    body.name || "",
    body.phone || "",
    body.note || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
