/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


let {
  Library
} = require("Library");
let {
  Common
} = require("Common");
let {
  clsUser,
  clsUserRecord
} = require("Object");

(function () {
  function RecordManager() {
    let recordList = [];
    let recordDump = new Common.DumpModule();

    let LoadData = function () {
      let tmpList = Common.read(Library.FileList["RecordList"]);
      for (let i = 0; i < tmpList.length; i++) recordList.push(clsUserRecord(tmpList[i]));
    }();

    let Find = function (id) {
      for (let i = 0; i < recordDump.dumpList.length; i++) { //recordDump에서 먼저 찾기
        if (recordDump.dumpList[i].name === id) {
          recordDump.resetTimeStemp(i);
          return recordDump.dumpList[i];
        }
      }
      for (let i = 0; i < recordList.length; i++) { //위에서 찾지 못했다면 recordList에서 찾기
        if (recordList[i].name === id) {
          recordDump.addDump(recordList[i]);
          return recordList[i];
        }
      }
      return null;
    }

    let Delete = function (id) {
      for (let i = 0; i < recordList.length; i++) {
        if (recordList[i].name === id) {
          recordList.splice(i, 1);
          break;
        }
      }
      Save();
    }

    let MakeJson = function () {
      let jsonArr = [];
      for (let i = 0; i < recordList.length; i++) jsonArr.push(JSON.stringify(recordList[i]));
      return jsonArr;
    }

    let CreateRecord = function (id) {
      let obj = {
        id: id,
        action: []
      }
      recordList.push(clsUserRecord(obj));
    }

    let Save = function () {
      Common.write(Library.DBFileList["RecordList"], MakeJson());
    }

    return {
      /**
       * 
       * @param {String} id 사용자의 id
       */
      Delete: function (id) {
        Delete(id);
      },

      /**
       * 
       * @param {String} id 사용자의 id
       * @param {String} name 사용자의 이름
       */
      newRecord: function (id) {
        CreateRecord(id);
      },

      /**
       * 
       * @param {String} id 사용자의 id
       * @param {String} type [user, bot]
       * @param {String} action [`~을(를) 시도함.`, `~을(를) ##함.`]
       */
      Record: function (id, type, record) {
        let date = new Date();
        let time = [
          [date.getFullYear(), date.getMonth(), date.getDate()],
          [date.getHours(), date.getMinutes(), date.getSeconds()]
        ];

        let record = Find(id);
        if (record === null) return;
        record.addRecord(type, time, record);
        Save();
      }
    }
  }


  module.exports = {
    RecordManager: RecordManager()
  };
})();