function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  switch (data.type) {

    case 'UPSERT_RECORD':
      return ContentService.createTextOutput('ok');

    case 'DELETE_RECORD':
      return ContentService.createTextOutput('ok');

    case 'LINE_MESSAGE':
      return ContentService.createTextOutput('ok');
  }
}
