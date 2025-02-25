/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


let {
  Library
} = require("Library"); //Library.js 파일을 불러옵니다.
let {
  Common
} = require("Common"); //Common.js 파일을 불러옵니다.

(function () {
  function DataBase() {
    let DB = {}; //데이터베이스
    let DUMP = {}; //캐시

    let LoadData = function () { //데이터 로드
      DB.Message = Common.read(Library.DBFileList["Message"]); //메시지 데이터 로드
      DB.UserList = Common.read(Library.FileList["UserList"]); //유저 데이터 로드
      DB.AttenList = Common.read(Library.FileList["AttenList"]); //출석 데이터 로드
      DB.SetList = Common.read(Library.FileList["SetList"]); //설정 데이터 로드
      DB.StockList = Common.read(Library.FileList["StockList"]); //주식 데이터 로드
      DB.PostList = Common.read(Library.FileList["PostList"]); //우편 데이터 로드
      DB.RecordList = Common.read(Library.FileList["RecordList"]); //기록 데이터 로드
      //Item
      DB.BadgeItemList = Common.read(Library.FileList["BadgeItemList"]); //배지 데이터 로드
      DB.TicketItemList = Common.read(Library.FileList["TicketItemList"]); //사용권 데이터 로드
      DB.FoodItemList = Common.read(Library.FileList["FoodItemList"]); //음식 데이터 로드
      DB.MembershipItemList = Common.read(Library.FileList["MembershipItemList"]); //멤버쉽 데이터 로드
      DB.LoanItemList = Common.read(Library.FileList["LoanList"]); //대출 데이터 로드


      DUMP.Message = new Common.DumpModule(); //메시지 캐시 생성
      DUMP.UserList = new Common.DumpModule(); //유저 캐시 생성
      DUMP.AttenList = new Common.DumpModule(); //출석 캐시 생성
      DUMP.SetList = new Common.DumpModule(); //설정 캐시 생성
      DUMP.StockList = new Common.DumpModule(); //주식 캐시 생성
      DUMP.PostList = new Common.DumpModule(); //우편 캐시 생성
      DUMP.RecordList = new Common.DumpModule(); //기록 캐시 생성
      //Item
      DUMP.BadgeItemList = new Common.DumpModule(); //배지 캐시 생성
      DUMP.TicketItemList = new Common.DumpModule(); //사용권 캐시 생성
      DUMP.FoodItemList = new Common.DumpModule(); //음식 캐시 생성
      DUMP.MembershipItemList = new Common.DumpModule(); //멤버쉽 캐시 생성
      DUMP.LoanItemList = new Common.DumpModule(); //대출 캐시 생성
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

    /**
     * 
     * @description 아이템 정보 조회
     * @param {String} type 아이템 분류 [TicketItem, FoodItem]
     * @param {String} name 아이템명
     * @returns {String} 아이템 정보
     */
    let Dictionary = function (type, name) { //아이템 정보 조회
      let rtnStr = `${name}을(를) 찾아봤어요.${Library.More}\n\n`;
      // 아이템 분류에 따라 상품명, 가격, 설명 출력

      let itemType = "";
      switch (type) { //아이템 분류에 따라 itemType 설정
        case "TicketItem":
          itemType = "사용권";
          break;
        case "FoodItem":
          itemType = "음식";
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
        ].join("\n"); //아이템 정보 출력

        let tmpObj = Find(type, "name", obj["upItem"]); //상위 아이템 찾기
        if (tmpObj !== null) rtnStr += [
          `== 상위 상품 ==`,
          `\t- 아이템명 : ${tmpObj["name"]}`
        ].join("\n"); //상위 아이템 정보 출력
      } else {
        rtnStr += "해당 상품을 찾을 수 없어요."; //찾은 데이터가 없을 경우
      }
      return rtnStr;
    }

    /**
     * 
     * @description 판매 리스트 조회
     * @param {String} type 아이템 분류 [all, TicketItem, FoodItem]
     * @returns {String} 판매 리스트
     */
    let SaleList = function (type) { //판매 리스트 조회
      let list = FindList(type, "all"); //type에 해당하는 모든 데이터 찾기
      let rtnStr = `${type} 분류의 상품이에요.${Library.More}\n\n`;
      // 아이템 분류에 따라 상품명, 가격, 설명 출력
      let itemType = ""; //아이템 분류
      switch (type) { //아이템 분류에 따라 itemType 설정
        case "TicketItem":
          itemType = "사용권";
          break;
        case "FoodItem":
          itemType = "음식";
          break;
      }
      for (let i = 0; i < list.length; i++) { //list의 길이만큼 반복
        rtnStr += [ 
          `[${list[i]["name"]}]`,
          `\t- 상품분류 : ${itemType}`,
          `\t- 상품명 : ${list[i]["name"]}`,
          `\t- 가격 : ${list[i]["price"]}`,
          `\t- 설명 : ${list[i]["description"]}`
        ].join("\n"); //아이템 정보 출력
      }
      return rtnStr; //판매 리스트 반환
    }

    return {
      /**
       * 
       * @description 데이터베이스 조회
       * @param {String} type 아이템 분류
       * @param {String} key key값
       * @param {String} value value값
       * @returns {String} 데이터 조회
       */
      Search: function (type, key, value) {
        return Find(type, key, value);
      }, //데이터 조회

      /**
       * 
       * @description 데이터베이스 리스트 조회
       * @param {String} type 아이템 분류
       * @param {String} key key값
       * @returns {String} 데이터 리스트 조회
      */
      Dic: function (type, name) {
        return Dictionary(type, name);
      }, //아이템 정보 조회

      /**
       * @description 데이터베이스 리스트 조회
       * @param {String} type 아이템 분류
       * @param {Number} itemIndex 아이템 인덱스
       * @returns {String} 데이터 조회
       */
      getItem: function (type, itemIndex) { //itemIndex로 데이터 조회
        if (Library.ItemType.includes(type)) return Find(type, "index", itemIndex);
        return null;
      },
      /**
       * 
       * @description 아이템 존재 여부 확인
       * @param {String} type 아이템 분류
       * @param {String} value 아이템 값
       * @returns {Boolean} 아이템 존재 여부
       */
      isItem: function (type, value) { //아이템 존재 여부 확인
        return (this.getItem(type, value) !== null);
      },
      /**
       * 
       * @description 아이템명으로 데이터 조회
       * @param {String} type 아이템 분류
       * @param {String} itemName 아이템명
       * @returns {String} 데이터 조회
       */
      getItemByName: function (type, itemName) { //itemName으로 데이터 조회
        if (Library.ItemType.includes(type)) return Find(type, "name", itemName);
        return null;
      },

      getSaleList: function (type) {
        return SaleList(type);
      }, //판매 리스트 조회

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

      //멤버쉽
      getMembershipList: function () {
        return DB["MembershipItemList"];
      },
      getMembership: function (index) {
        return Find("MembershipItem", "index", index);
      },
      getMembershipByName: function (nameItem) {
        return Find("MembershipItem", "name", nameItem);
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