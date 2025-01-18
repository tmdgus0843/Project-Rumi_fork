//DataBase.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default 불러오기
Broadcast.send("Common"); //Common 불러오기

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


    Find: function (type, key, value) { //데이터 조회(성능 최적화)
      let infos = DUMP[type].dumpList;
      for (let i = 0; i < infos.length; i++) { //캐시에서 데이터 조회
        if (infos[i][key] === value) {
          DUMP[type].resetTimeStemp(i);
          return infos[i];
        }
      }
      infos = DB[type];
      for (i = 0; i < infos.length; i++) {
        if (infos[i][key] === value) { //캐시에 없음: 데이터베이스 조회, 캐시 업데이트
          DUMP[type].addDump(infos[i]);
          return infos[i];
        }
      }
      return null;
    },


    FindList: function (type, key, value) {
      let infos = DB[type];
      let list = [];
      for (let i = 0; i < infos.length; i++) {
        if (infos[i][key] === value) list.push(infos[i]);
      }
      return list;
    },


    /**
     * @param {String} name 아이템 이름
     * @param {String} type 아이템 종류 ["NicknameItem","StarsItem","FoodItem","TicketItem","MandrelItem","MineralItem"]
     */
    Dictionary: function (name, type) {
      let rtnStr = `[${name}의 검색 결과]\n\n`;

      if (type == "TicketItem") {
        let obj = Find("TicketItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[티켓]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("TicketItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 티켓 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "NicknameItem") {
        let obj = Find("NicknameItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[닉네임]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("NicknameItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 닉네임 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "StarsItem") {
        let obj = Find("StarsItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[멤버쉽]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")
        }
      }

      if (type == "FoodItem") {
        let obj = Find("FoodItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[음식]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          let tmpObj = Find("FoodItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 음식 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "MandrelItem") {
        obj = Find("MandrelItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[곡괭이]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MandrelItem", "itemName", obj["upItem"]);
          if (tmpObj === null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 곡괭이 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      if (type == "MineralItem") {
        obj = Find("MineralItem", "itemName", name);
        if (obj !== null) {
          rtnStr += [
            `[광물]`,
            `\t- 아이템명 : ${obj["name"]}`,
            `\t- 가격 : ${obj["price"]}`,
            `\t- 설명 : ${obj["description"]}`
          ].join("\n")

          tmpObj = Find("MineralItem", "itemName", obj["upItem"]);
          if (tmpObj == null) tmpList = [];
          if (tmpObj !== null) rtnStr += [
            `== 상위 광물 ==`,
            `\t- 아이템명 : ${(tmpObj === "" ? "없음" : tmpObj["name"])}`
          ].join("\n")
        }
      }

      return rtnStr;
    },

    getItem: function (key, value) {
      if (key === "NicknameItem") return this.Find("NicknameItem", "itemName", value);
      if (key === "StarsItem") return this.Find("StarsItem", "itemName", value);
      if (key === "TicketItem") return this.Find("TicketItem", "itemName", value);
      if (key === "FoodItem") return this.Find("FoodItem", "itemName", value);
      if (key === "ManderlItem") return this.Find("MandrelItem", "itemName", value);
      if (key === "MineralItem") return this.Find("MineralItem", "itemName", value);
      return "";
    },
    isItem: function (key, value) {
      if (key === "NicknameItem") return (this.Find("NicknameItem", "itemName", value) !== null ? true : false);
      if (key === "StarsItem") return (this.Find("StarsItem", "itemName", value) !== null ? true : false);
      if (key === "TicketItem") return (this.Find("TicketItem", "itemName", value) !== null ? true : false);
      if (key === "FoodItem") return (this.Find("FoodItem", "itemName", value) !== null ? true : false);
      if (key === "ManderlItem") return (this.Find("ManderItem", "itemName", value) !== null ? true : false);
      if (key === "MineralItem") return (this.Find("MineralItem", "itemName", value) !== null ? true : false);
      return "";
    }
  }
}

Broadcast.register("DataBase", () => {
  return eval(DataBase = funcDBManager())
});