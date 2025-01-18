//UserManager.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기
Broadcast.send("Object"); //Object 불러오기

Broadcast.send("DataBase"); //DataBase 불러오기
Broadcast.send("RecordManager"); //RecordManager 불러오기
Broadcast.send("SystemManager"); //SystemManager 불러오기

function UserManager() {
  let userList = [], userOptionList = [];
  let UserDump = new Common.DumpModule();
  let OptDump = new Common.DumpModule();
  
  let Load = function() {
    let UserList = Common.read(Default.fileNameList["UserList"]);
    for (let i = 0; i < tmpList.length; i++) {
      userList.push(funcObject.)
    }
  }
}