
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

function log_(msg) {
  try {
    const ssId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    const ss = SpreadsheetApp.openById(ssId);
    let logSheet = ss.getSheetByName("LOG");

    if (!logSheet) {
      logSheet = ss.insertSheet("LOG");
      logSheet.appendRow(["timestamp","raw"]);
    }

    logSheet.appendRow([new Date(), msg]);
  } catch (e) {}
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
  try {
    const raw = e.postData.contents;
    const data = JSON.parse(raw);

    log_(raw);

    const sheet = getSheet();

    if (data.type === "UPSERT_RECORD") {
      const p = data.payload || {};

      sheet.appendRow([
        new Date(),
        p.name || "",
        p.phone || "",
        p.note || ""
      ]);

      return ContentService.createTextOutput(JSON.stringify({status:"ok"}));
    }

    if (data.type === "DELETE_RECORD") {
      return ContentService.createTextOutput("delete ok");
    }

    if (data.type === "LINE_MESSAGE") {
      return ContentService.createTextOutput("line ok");
    }

    return ContentService.createTextOutput("unknown type");

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error", message: err.toString()}));
  }
}
