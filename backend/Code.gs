
const SHEET_NAME = "Customers";

/**
 * Get sheet
 */
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

/**
 * LOG helper
 */
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

/**
 * MAIN POST (V4 PRO)
 */
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

      return ContentService
        .createTextOutput(JSON.stringify({status:"ok"}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.type === "DELETE_RECORD") {
      return ContentService.createTextOutput("delete ok");
    }

    if (data.type === "LINE_MESSAGE") {
      return ContentService.createTextOutput("line ok");
    }

    return ContentService.createTextOutput("unknown type");

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({status:"error", message: err.toString()})
    );
  }
}
