function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const requestId = Utilities.getUuid();
    const raw = e.postData.contents;
    const data = JSON.parse(raw);

    logRequest(requestId, raw);

    if (!validateKey(data.apiKey)) {
      return json({
        status: "error",
        code: 401,
        message: "Unauthorized"
      });
    }

    const sheet = getSheet();
    let result = routeRequest(sheet, data, requestId);

    return json(result);

  } catch (err) {
    logError(err);

    return json({
      status: "error",
      message: err.toString()
    });

  } finally {
    lock.releaseLock();
  }
}

function routeRequest(sheet, data, requestId) {
  switch (data.type) {
    case "UPSERT_RECORD":
      return upsert(sheet, data.payload, requestId);
    case "DELETE_RECORD":
      return remove(sheet, data.payload);
    case "GET_ALL":
      return getAll(sheet);
    default:
      return { status: "error", message: "Unknown type" };
  }
}

function upsert(sheet, p, requestId) {
  const id = Utilities.getUuid();
  sheet.appendRow([
    id,
    new Date(),
    p.name || "",
    p.phone || "",
    p.note || "",
    requestId
  ]);
  return { status: "success", id: id };
}

function getAll(sheet) {
  return {
    status: "success",
    data: sheet.getDataRange().getValues()
  };
}

function remove(sheet, payload) {
  return { status: "success", message: "delete not implemented" };
}

function getSheet() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  return SpreadsheetApp.openById(id).getSheetByName("Sheet1");
}

function validateKey(key) {
  const valid = PropertiesService.getScriptProperties().getProperty("API_KEY");
  return key === valid;
}

function logRequest(id, raw) {
  const sheet = getSheet();
  sheet.appendRow([new Date(), "REQ", id, raw]);
}

function logError(err) {
  const sheet = getSheet();
  sheet.appendRow([new Date(), "ERR", err.toString()]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}