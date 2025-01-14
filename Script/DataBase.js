//DataBase.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default", ""); //Default.js의 변수 불러오기
Broadcast.send("Common", ""); //Common.js의 변수 불러오기

function funcDBManager() {
  let DB = {};
  let DUMP = {};

  return {
    LoadData: function () {
      DB.Message = Common.read(Default.DBFileList["Message"]);
      DB.BasicItem = Common.read(Default.DBFileList["BasicItem"]);
      DB.NicknameItem = Common.read(Default.DBFileList["NicknameItem"]);
      DB.StarsItem = Common.read(Default.DBFileList["StarsItem"]);
      DB.FoodItem = Common.read(Default.DBFileList["FoodItem"]);
      DB.TicketItem = Common.read(Default.DBFileList["TicketItem"]);
      DB.MineralItem = Common.read(Default.DBFileList["MineralItem"]);

      DUMP.Message = new Common.DumpModule();
      DUMP.BasicItem = new Common.DumpModule();
      DUMP.NicknameItem = new Common.DumpModule();
      DUMP.StarsItem = new Common.DumpModule();
      DUMP.FoodItem = new Common.DumpModule();
      DUMP.TicketItem = new Common.DumpModule();
      DUMP.MineralItem = new Common.DumpModule();
    }(),

    Search: function (table, columu, compare) { //데이터 조회(성능 최적화)
      let infos = DUMP[table].dumpList;
      for (let i = 0; i < infos.length; i++) { //캐시에서 데이터 조회
        if (infos[i][columu] == compare) {
          DUMP[table].resetTimeStemp(i);
          return infos[i];
        }
      }
      infos = DB[table];
      for (i = 0; i < infos.length; i++) {
        if (infos[i][columu] == compare) { //캐시에 없음: 데이터베이스 조회, 캐시 업데이트
          DUMP[table].addDump(infos[i]);
          return infos[i]
        }
      }
      return null;
    },

    FindListForIndex: function (table, columu, compare) {
      let infos = DB[table];
      let list = [];
      for (let i = 0; i < infos.length; i++) {
        if (infos[i][columu] == compare) list.push(infos[i]);
      }
    },


    /**
     * @param {String} name 아이템 이름
     * @param {String} type 아이템 종류 ["NicknameItem","StarsItem","FoodItem","TicketItem","MandrelItem","MineralItem"]
     */
    Dictionary: function (name, type) {
      let obj = null;
      let i, tmpObj, tmp, tmpList;
      let rtnStr = `[${name}의 검색 결과]\n\n`;

      if (type == "TicketItem") {
        obj = Find("TicketItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[티켓]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("TicketItem", "itemName", obj["upItem"]);
          if (tmpObj !== null) rtnStr += [
            `== 상위 티켓 ==`,
            `  - 아이템명 : ${tmpObj}`
          ].join("\n")
        }
      }

      if (type == "NicknameItem") {
        obj = Find("NicknameItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[닉네임]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("NicknameItem", "itemName", obj["upItem"]);
          if (tmpObj !== null) rtnStr += [
            `== 상위 닉네임 ==`,
            `  - 아이템명 : ${tmpObj}`
          ].join("\n")
        }
      }

      if (type == "StarsItem") {
        obj = Find("StarsItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[멤버쉽]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")
        }
      }

      if (type == "FoodItem") {
        obj = Find("FoodItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[음식]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("FoodItem", "itemName", obj["upItem"]);
          if (tmpObj !== null) rtnStr += [
            `== 상위 음식 ==`,
            `  - 아이템명 : ${tmpObj}`
          ].join("\n")
        }
      }

      if (type == "MandrelItem") {
        obj = Find("MandrelItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[곡괭이]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MandrelItem", "itemName", obj["upItem"]);
          if (tmpObj !== null) rtnStr += [
            `== 상위 곡괭이 ==`,
            `  - 아이템명 : ${tmpObj}`
          ].join("\n")
        }
      }

      if (type == "MineralItem") {
        obj = Find("MineralItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[광물]`,
            `  - 아이템명 : ${obj["name"]}`,
            `  - 가격 : ${obj["price"]}`,
            `  - 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MineralItem", "itemName", obj["upItem"]);
          if (tmpObj !== null) rtnStr += [
            `== 상위 광물 ==`,
            `  - 아이템명 : ${tmpObj}`
          ].join("\n")
        }
      }

    },

    isNicknameItem: function (name) {
      return (this.Search("NicknameItem", "itemName", name) !== null ? true : false);
    },
    getNicknameItem: function (name) {
      return this.Search("NicknameItem", "itemName", name);
    },
    isStarsItem: function (name) {
      return (this.Search("StarsItem", "itemName", name) !== null ? true : false);
    },
    getStarsItem: function (name) {
      return this.Search("StarsItem", "itemName", name);
    },
    isTicketItem: function (name) {
      return (this.Search("TicketItem", "itemName", name) !== null ? true : false);
    },
    getTicketItem: function (name) {
      return this.Search("TicketItem", "itemName", name);
    },
    isFoodItem: function (name) {
      return (this.Search("FoodItem", "itemName", name) !== null ? true : false);
    },
    getFoodItem: function (name) {
      return this.Search("FoodItem", "itemName", name);
    },
    isMandrelItem: function (name) {
      return (this.Search("MandrelItem", "itemName", name) !== null ? true : false);
    },
    getMandrelItem: function (name) {
      return this.Search("MandrelItem", "itemName", name);
    },
    isMineralItem: function (name) {
      return (this.Search("MineralItem", "itemName", name) !== null ? true : false);
    },
    getMineralItem: function (name) {
      return this.Search("MineralItem", "itemName", name);
    }
  }
}

Broadcast.register("DataBase", () => {
  return eval(DataBase = funcDBManager())
});