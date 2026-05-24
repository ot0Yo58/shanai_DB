const SHEET_NAME = 'employees';
const HEADERS = ['id','employeeCode','name','nameKana','birthday','address','joinDate','commuteMethod','futureVision','memo','createdAt','updatedAt'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('社員DB同期')
    .addItem('API→シート', 'pullEmployeesFromApi')
    .addItem('シート→API', 'pushEmployeesToApi')
    .addToUi();
}
