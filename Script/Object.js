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
  DataBase
} = require("DataBase");

(function () {
  function clsUser(user) {
    let FindInventory = function (itemType, itemName) {
      return user.inventory.find(i => i.type === itemType && i.name === itemName);
    };

    return {
      getJson: function () {
        return {
          name: user.name,
          id: user.id,
          profileId: user.profileId,
          signUpDate: user.signUpDate,
          state: user.state,
          admin: user.admin,
          ban: user.ban,
          warn: user.warn,
          coin: user.coin
        };
      },

      getCoin: function () {
        return user.coin;
      },
      setCoin: function (coin) {
        user.coin = coin;
      },
      addCoin: function (coin) {
        user.coin += coin;
      },

      addItem: function (itemType, itemName, count) { //가방에 물건 추가
        let item = FindInventory(itemType, itemName); //물건 검색
        if (item) { //가지고 있다면
          item.count += count; //수량 추가
        } else { //가지고 있지 않다면
          user.inventory.push({ //물건 추가
            type: itemType,
            name: itemName,
            count: count
          });
        }
      },
      removeItem: function (itemType, itemName, count) { //가방에 물건 제거
        let item = FindInventory(itemType, itemName); //물건 검색
        if (item) { //가지고 있다면
          item.count -= count; //수량 감소
          if (item.count <= 0) { //수량이 0이하면
            user.inventory = user.inventory.filter(i => i !== item); //물건 제거
          }
          return true; //성공적으로 제거했다면 true 반환
        }
        return false; //가지고 있지 않다면 false 반환
      },
      getItemList: function (itemType) { //가방 목록 반환
        if (itemType === "all") return user.inventory; //모든 물건 반환
        return user.inventory.find(i => i.type === itemType); //해당 물건 반환
      },
      isItem: function (itemType, itemName) { //물건 존재 여부 반환
        return Boolean(FindInventory(itemType, itemName));
      },
      isItemCount: function (itemType, itemName, count) { //물건 수량 확인
        return FindInventory(itemType, itemName).count;
      },

      useItem: function (itemType, itemName) {
        let item = FindInventory(itemType, itemName);
        if (item) {
          user.inventory[itemType][itemName].count--;
          if (user.inventory[itemType][itemName].count <= 0) {
            delete user.inventory[itemType][itemName];
            //다시 구현
          }
        }
      },

      getLoan: function () {
        return user.loan;
      },
      setLoan: function (index, type, coin) {
        if (user.loan["index"] === "") {
          user.loan["index"] = index;
          user.loan["type"] = type;
          user.loan["coin"] = coin;
          user.loan["time"] = (new Date()).getTime();
          return true;
        }
        return false;
      },
      removeLoan: function () {
        user.loan = {
          index: "",
          type: "",
          coin: 0,
          time: 0
        };
      },
    }
  }

  function clsUserRecord(user) {
    return {
      getJson: function () {
        return {
          name: user.name,
          record: user.record
        };
      },
      addRecord: function (type, time, record) {
        let _type = "";
        switch (type) {
          case "user": {
            _type = "<"; //사용자
          }
          case "bot": {
            _type = ">"; //봇
          }
        }
        user.push(`${_type} [${time[0].join("-")} ${time[1].join(":")}] ${record}`); //< [YYYY-MM-DD hh:mm:sss] ~을(를) 시도함.
      },
      getRecord: function () {
        return user.record;
      }
    }
  }

  module.exports = {
    clsUser: clsUser,
    clsUserRecord: clsUserRecord,


  };
})();