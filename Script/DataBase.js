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

(function () {
  function DataBase() {
    let DB = {};
    let DUMP = {};

    let LoadData = function () {
      DB.Message = Common.read(Library.DBFileList["Message"]);
      DB.UserList = Common.read(Library.FileList["UserList"]);
      DB.AttenList = Common.read(Library.FileList["AttenList"]);
      DB.SetList = Common.read(Library.FileList["SetList"]);
      DB.StockList = Common.read(Library.FileList["StockList"]);
      DB.PostList = Common.read(Library.FileList["PostList"]);
      DB.RecordList = Common.read(Library.FileList["RecordList"]);
      //Item
      DB.BadgeItemList = Common.read(Library.FileList["BadgeItemList"]);
      DB.TicketItemList = Common.read(Library.FileList["TicketItemList"]);
      DB.FoodItemList = Common.read(Library.FileList["FoodItemList"]);
      DB.MandrelItemList = Common.read(Library.FileList["MandrelItemList"]);
      DB.MineralItemList = Common.read(Library.FileList["MineralItemList"]);
      DB.StarsItemList = Common.read(Library.FileList["StarsItemList"]);
      DB.LoanItemList = Common.read(Library.FileList["LoanList"]);


      DUMP.Message = new Common.DumpModule();
      DUMP.UserList = new Common.DumpModule();
      DUMP.AttenList = new Common.DumpModule();
      DUMP.SetList = new Common.DumpModule();
      DUMP.StockList = new Common.DumpModule();
      DUMP.PostList = new Common.DumpModule();
      DUMP.RecordList = new Common.DumpModule();
      //Item
      DUMP.BadgeItemList = new Common.DumpModule();
      DUMP.TicketItemList = new Common.DumpModule();
      DUMP.FoodItemList = new Common.DumpModule();
      DUMP.MandrelItemList = new Common.DumpModule();
      DUMP.MineralItemList = new Common.DumpModule();
      DUMP.StarsItemList = new Common.DumpModule();
      DUMP.LoanItemList = new Common.DumpModule();
    }();

    /**
     * 
     * @param {String} type 파일 ex) Message
     * @param {String} key json 배열의 key값 ex) index
     * @param {String} value json 배열의 value값 ex) 1
     * @returns 
     */
    let Find = function (type, key, value) { //데이터 조회(성능 최적화)
      //캐시에서 데이터 조회
      let infos = DUMP[type].dumpList; //DUMP에 저장된 데이터 저장
      for (let i = 0; i < infos.length; i++) { //infos.length: DUMP에 저장된 데이터 개수
        if (infos[i][key] === value) { //key값이 value인 데이터가 존재할 경우
          DUMP[type].resetTimeStemp(i); //해당 데이터의 시간 기록을 초기화
          return infos[i]; //찾은 데이터 반환
        }
      }
      //캐시에 없음: 데이터베이스 조회, 캐시 업데이트
      infos = DB[type]; //DB에 저장된 데이터 저장
      for (let i = 0; i < infos.length; i++) { //infos.length: DB에 저장된 데이터 개수
        if (infos[i][key] === value) { //key값이 value인 데이터가 존재할 경우
          DUMP[type].add(infos[i]); //DUMP에 데이터 추가
          return infos[i]; //찾은 데이터 반환
        }
      }
      return null; //찾지 못한 경우 null 반환
    }
    /**
     * 
     * @param {String} type Library.ItemType ex) BadgeItem
     * @param {String} key json 배열의 key값 ex) index
     * @param {String} value json 배열의 value값 ex) 1
     * @returns 
     */
    let FindList = function (type, key, value) { //데이터 리스트 조회(성능 최적화)
      let infos = DUMP[type].dumpList; //DUMP에서 해당 type를 찾고 그 데이터 저장
      let list = [];
      if (key === "all") return infos; //key값이 "all"일 경우 DUMP[type]에 저장된 모든 데이터 반환
      for (let i = 0; i < infos.length; i++) { //DUMP[type]에 저장된 데이터 개수만큼 반복
        if (infos[i][key] === value) list.push(infos[i]); //key값이 value인 데이터가 존재할 경우 list에 데이터 추가
      }
      return list; //찾은 데이터 반환
    }

    let Dictionary = function (type, name) {
      let rtnStr = `${name}을(를) 찾아봤어요.${Library.More}\n\n`;

      let itemType = "";
      switch (type) {
        case "BadgeItem":
          itemType = "배지";
          break;
        case "TicketItem":
          itemType = "사용권";
          break;
        case "FoodItem":
          itemType = "음식";
          break;
        case "MandrelItem":
          itemType = "곡괭이";
          break;
        case "MineralItem":
          itemType = "광석";
          break;
        case "StarsItem":
          itemType = "멤버쉽";
          break;
      }

      let obj = Find(type, "name", name); //type에서 name이 name인 데이터 찾기
      if (obj) { //찾은 데이터가 존재할 경우
        rtnStr += [
          `[${obj["name"]}]`,
          `\t- 상품분류 : ${itemType}`,
          `\t- 상품명 : ${obj["name"]}`,
          `\t- 가격 : ${obj["price"]}`,
          `\t- 설명 : ${obj["description"]}`
        ].join("\n");

        let tmpObj = Find(type, "name", obj["upItem"]);
        if (tmpObj !== null) rtnStr += [
          `== 상위 상품 ==`,
          `\t- 아이템명 : ${tmpObj["name"]}`
        ].join("\n");
      } else {
        rtnStr += "해당 상품을 찾을 수 없어요.";
      }
      return rtnStr;
    }

    let SaleList = function (type) {
      let list = FindList(type, "all");
      let rtnStr = `${type} 분류의 상품이에요.${Library.More}\n\n`;
      let itemType = "";
      switch (type) {
        case "BadgeItem":
          itemType = "배지";
          break;
        case "TicketItem":
          itemType = "사용권";
          break;
        case "FoodItem":
          itemType = "음식";
          break;
        case "MandrelItem":
          itemType = "곡괭이";
          break;
        case "MineralItem":
          itemType = "광석";
          break;
        case "StarsItem":
          itemType = "멤버쉽";
          break;
      }
      for (let i = 0; i < list.length; i++) {
        rtnStr += [
          `[${list[i]["name"]}]`,
          `\t- 상품분류 : ${itemType}`,
          `\t- 상품명 : ${list[i]["name"]}`,
          `\t- 가격 : ${list[i]["price"]}`,
          `\t- 설명 : ${list[i]["description"]}`
        ].join("\n");
      }
      return rtnStr;
    }

    return {
      Search: function (type, key, value) {
        return Find(type, key, value);
      }, //데이터 조회

      Dic: function (type, name) {
        return Dictionary(type, name);
      }, //아이템 정보 조회

      getItem: function (type, itemIndex) { //itemIndex로 데이터 조회
        if (Library.ItemType.includes(type)) return Find(type, "index", itemIndex);
        return null;
      },
      isItem: function (type, value) { //아이템 존재 여부 확인
        return (this.getItem(type, value) !== null);
      },
      getItemByName: function (type, itemName) { //itemName으로 데이터 조회
        if (Library.ItemType.includes(type)) return Find(type, "name", itemName);
        return null;
      },

      getSaleList: function (type) {
        return SaleList(type);
      },

      //배지
      getBadgeList: function () {
        return DB["BadgeItemList"];
      },
      getBadge: function (index) {
        return Find("BadgeItem", "index", index);
      },
      getBadgeByName: function (nameItem) {
        return Find("BadgeItem", "name", nameItem);
      },

      //사용권
      getTicketList: function () {
        return DB["TicketItemList"];
      },
      getTicket: function (index) {
        return Find("TicketItem", "index", index);
      },
      getTicketByName: function (nameItem) {
        return Find("TicketItem", "name", nameItem);
      },

      //음식
      getFoodList: function () {
        return DB["FoodItemList"];
      },
      getFood: function (index) {
        return Find("FoodItem", "index", index);
      },
      getFoodByName: function (nameItem) {
        return Find("FoodItem", "name", nameItem);
      },

      //곡괭이
      getMandrelList: function () {
        return DB["MandrelItemList"];
      },
      getMandrel: function (index) {
        return Find("MandrelItem", "index", index);
      },
      getMandrelByName: function (nameItem) {
        return Find("MandrelItem", "name", nameItem);
      },

      //광물
      getMineralList: function () {
        return DB["MineralItemList"];
      },
      getMineral: function (index) {
        return Find("MineralItem", "index", index);
      },
      getMineralByName: function (nameItem) {
        return Find("MineralItem", "name", nameItem);
      },

      //멤버쉽
      getStarsList: function () {
        return DB["StarsItemList"];
      },
      getStars: function (index) {
        return Find("StarsItem", "index", index);
      },
      getStarsByName: function (nameItem) {
        return Find("StarsItem", "name", nameItem);
      },

      //주식
      getStockList: function () {
        return DB["StockList"];
      },
      getStock: function (index) {
        return Find("StockList", "index", index);
      },
      getStockByName: function (nameItem) {
        return Find("StockList", "name", nameItem);
      },

      //대출
      getLoanList: function () {
        return DB["LoanList"];
      },
      getLoan: function (index) {
        return Find("LoanItem", "index", index);
      },
      getLoanByName: function (nameItem) {
        return Find("LoanItem", "name", nameItem);
      }
    }
  }

  module.exports = {
    DataBase: DataBase()
  }
})();