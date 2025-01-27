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

let {
  DataBase
} = require("DataBase");
let {
  RecordManager
} = require("RecordManager");
let {
  SystemManager
} = require("SystemManager");


(function () {
  function UserManager() {
    let userList = [];
    let userDump = new Common.DumpModule();

    let loadData = function () {
      let tmpList = Common.read(Library.FileList["UserList"]);
      for (let i = 0; i < tmpList.length; i++) {
        userList.push(clsUser(tmpList[i]));
      }
    }();

    let Contain = function (id) { //userHash로 확인
      return userList.find(u => u.profileId === id);
    };

    let Find = function (id) { //userHash로 확인
      for (let i = 0; i < userDump.dumpList.length; i++) {
        if (userDump.dumpList[i].profileId === id) {
          userDump.resetTimeStemp(i);
          return userDump.dumpList[i];
        }
      }
      for (let i = 0; i < userList.length; i++) {
        if (userList[i].profileId === id) {
          userDump.addDump(userList[i]);
          return userList[i];
        }
      }
      return null;
    };
    let FindById = function (id) { //userId로 확인
      for (let i = 0; i < userDump.dumpList.length; i++) {
        if (userDump.dumpList[i].id === id) {
          userDump.resetTimeStemp(i);
          return userDump.dumpList[i];
        }
      }
      for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
          userDump.addDump(userList[i]);
          return userList[i];
        }
      }
      return null;
    };

    let MakeJson = function () {
      let list = [];
      for (let i = 0; i < userList.length; i++) {
        list.push(userList[i].getJson());
      }
      return list;
    }

    let CreateUser = function (name, profileId) {

      let obj = {
        name: name,
        id: Array.from({
          length: 8
        }, () =>
          "abcdefghijklmnopqrstuvwxyz123456789"[
          Math.floor(Math.random() * 35)
          ]
        ).join(""), //랜덤 아이디 생성
        profileId: profileId,
        signUpDate: [new Date().getFullYear(), new Date().getMonth(), new Date().getDay()],
        admin: false,
        ban: false,
        warn: 0,
        coin: 10000,
        mount: {
          food: 0,
          mandrel: 0
        },
        chatCount: 0,
        stock: Object.fromEntries(Object.entries(this.getStockList()).map(([key]) => [key, 0])),
        etc: {}
      };
      userList.push(clsUser(obj));
    }

    let DeleteUser = function (id) { //id로 삭제
      userList.filter(i => i !== id);
      Save();
    }

    let Save = function () {
      Common.write(Library.FileList["UserList"], MakeJson());
    }

    let RecivePost = function (user, item, coin) {
      let rtnStr = "",
        Item;
      for (let i = 0; i < item.length; i++) {
        Item = item[i];
        user.addItem(Item.type, Item.name, Item.count);
        rtnStr += `${Item.name}을(를) ${Item.count}개 받았어요.\n`;
      }
      if (Number(coin) > 0) {
        user.addCoin(Number(coin));
        rtnStr += `${coin}스타를 받았어요.`;
      }
      return rtnStr;
    }

    return {
      contain: function (id) {
        return Contain(id);
      },
      deleteUser: function (id) {
        DeleteUser(id);
      },
      makeUser: function (name, profileId) {
        let idx = Contain(profileId);
        if (!idx) {
          CreateUser(name, profileId);
          return true
        }
        return false;
      },
      UserInfo: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        return [
          `${user.name}님의 정보에요.`,
          `\t- 이름 : ${user.name}`,
          `\t- 아이디 : ${user.id}`,
          `\t- 가입일 : ${user.signUpDate.join("-")}`,
          `\t- 정지 : ${user.ban ? "정지됨" : "정지안됨"}`,
          `\t- 경고 : ${user.warn}`,
          `\t- 코인 : ${user.coin}스타`,
          // `\t- 주식 : ${Object.entries(user.stock).map(([key,value]) => value>0?(key + " : " + value):"").join("       \n")}`
        ].join("\n");
      },

      Purchase: function (id, type, name, count) { //구매
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let targetItem = DataBase.Search(type, "name", name);
        if (targetItem === null) return `존재하지 않는 아이템이에요.`;
        if (user.addCoin(-(Number(targetItem["price"]) * count))) {
          user.addItem(type, name, count);
          Save();
          return [`${targetItem["itemName"]}을(를) ${count}개 구매했어요.`,
          `${(Number(targetItem["coin"]) * count)}스타를 소모했어요.`
          ].join("\n");
        } else {
          return "소지하고 있는 재화가 부족해요.";
        }
      },
      Sell: function (id, type, name, count) { //판매
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let targetItem = DataBase.Search(type, "name", name);
        if (targetItem === null) return `존재하지 않는 아이템이에요.`;
        if (user.isItemCount(type, name, count)) {
          let sellPrice = Math.floor(Number(targetItem["price"]) * 2 / 3);
          if (sellPrice < 1) sellPrice = 1;
          user.addCoin(sellPrice * count);
          user.removeItem(type, name, count);
          Save();
          return `${targetItem["itemName"]}을(를) 원가의 ⅔의 가격인 ${sellPrice}스타에 판매했어요.`
        } else {
          return "해당 수량만큼의 아이템이 없어 판매할 수 없어요.";
        }
      },


      /**
       * 
       * @param {String} id 
       * @param {String} name 
       * @param {Array} funcCall [0] fuction, [1] String
       * @returns 
       */
      UseItem: function (id, name, funcCall) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let DBItem = DataBase.getItem(name);
        if (DBItem === null) return `존재하지 않는 아이템이에요.`;
        if (user.isItemCount(DBItem.type, DBItem.name, 1)) {
          let itemType = "";
          switch (DBItem.type) {
            case "TicketItem":
              itemType = "사용권";
              break;
            case "FoodItem":
              itemType = "음식";
              break;
            case "StarsItem":
              itemType = "멤버쉽";
              break;
          }
          funcCall[0];
          Save();
          return [
            `${DBItem.name}을(를) 사용했어요.`,
            funcCall[1]
          ].join("\n");
        } else {
          return "해당 아이템을 보유하고 있지 않아요.";
        }
      },


      //포스트 코드
      RecivePost: function (id, item, coin) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let rtnStr = RecivePost(user, item, coin);
        Save();
        return rtnStr;
      },
      ReciveAllPost: function (id, postlist) {
        let user = Find(id);
        let rtnStr = "",
          post;
        if (user === null)`생성된 계정이 없어요.`;
        for (let i = 0; i < postlist.length; i++) {
          post = postlist[i];
          rtnStr += RecivePost(user, post.item, post.coin)
        }
        Save();
        return rtnStr;
      },


      //코인 코드
      RankingInfo: function (id) {
        let user = Find(id)
        if (user === null) return `생성된 계정이 없어요`;

        let _user = []
        for (let i = 0; i < userList.length; i++) {
          _user.push({
            name: userList[i].name,
            coin: userList[i].coin
          });
        }
        _user.sort(function (a, b) {
          return b.coin - a.coin
        });
        let top = _user.slice(0, 10);
        top.map(function (entry, index) {
          return `${index + 1}위 : ${entry.name} - ${entry.coin}스타`
        }).join("\n");
        return [
          `스타를 가장 많이 가지고 계신 10분을 알려드릴게요.`,
          Library.More, ,
          top
        ].join('\n');
      },

      //상점 코드
      getSaleList: function (id, type) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let itemList = DataBase.getSaleList(type);
        let rtnArr = [];
        for (let i = 0; i < user.saleList.length; i++) {
          rtnArr.push(`  - ${itemList[i]["name"]} ------ ${itemList[i]["coin"]}스타`);
        }
        return [`상품 목록이에요.`, rtnArr].join("\n");
      },


      //은행 코드
      getLoanList: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let DBLoan = DataBase.getLoanList();
        let rtnArr = [];
        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        for (let i = 0; i < DBLoan.length; i++) {
          rtnArr.push([
            `[${DBLoan[i].name}]`,
            `\t- 기간: ${DBLoan[i].period}일`,
            `\t- 금리: ${Math.floor(Number(DBLoan[i].rate) * 100)}%)`
          ].join("\n"));
        }
        return [
          `은행 대출 목록이에요.`,
          `${rtnArr.join("\n")}`
        ].join("\n");
      },
      Loan: function (id, target, coin) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let DBLoan = DataBase.getLoanByName(target);
        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        if (Library.MaxLoan < coin) return `대출 한도를 초과했어요. 대출 한도는 ${Library.MaxLoan}스타에요.`;
        if (DBLoan === null) return "존재하지 않는 대출 상품이에요.";
        if (user.loan["index"] !== "") return "이미 대출을 받으셨으므로 더이상 은행 업무를 보실 수 없어요. 대출을 갚으신 후 다시 시도해주세요.";
        user.addCoin(coin);
        Save();
        return [
          `${DBLoan.name}을(를) 했어요`,
          ` - ${coin}스타를 얻었어요.`,
          ` - 대출 금리는 ${Math.floor(Number(DBLoan.rate) * 100)}%에요`,
          ` - ${DBLoan.period}일 후에 ${Math.floor(coin * (1 + Number(DBLoan.rate)))}스타를 정산해주세요.`
        ].join('\n');
      },
      calcLoan: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let loan = user.loan;
        let DBLoan = DataBase.getLoan(loan.index);
        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        let remainTime = loan.time + (Number(DBLoan.period) * 24 * 60 * 60 * 1000) - (new Date()).getTime();
        if (remainTime > 0) return `아직 대출 기간이 남았어요. ${Math.floor(remainTime / (24 * 60 * 60 * 1000))}일 후에 정산해주세요.`;
        if (loan.index === "") return "대출을 받지 않으셨어요.";
        let calcCoin = Math.floor(loan.coin * (1 + Number(DBLoan.rate)));
        if (calcCoin > user.coin) return "소지하고 있는 재화가 부족해요.";
        user.addCoin(-calcCoin);
        user.removeLoan();
        Save();
        return [
          `대출금을 정산했어요.`,
          ` - ${calcCoin}스타를 지불했어요.`
        ]
      },
      cancelLoan: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let loan = user.loan;
        if (loan.index === "") return "대출을 받지 않으셨어요.";
        let DBLoan = DataBase.getLoan(loan.index);
        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        let calcCoin = Math.floor(loan.coin * (1 + Number(DBLoan.rate)));
        if (calcCoin > user.coin) return "소지하고 있는 재화가 부족해요.";
        user.addCoin(-calcCoin);
        user.removeLoan();
        return [
          `현재 대출을 해지할게요. 중도해지라도 이자를 차감해요.`,
          `${calcCoin}스타를 갚았어요.`
        ].join('\n');
      },



      //출석 코드
      checkAtten: function (id, data, room, time) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        if (Object.keys(data["store"][room]).includes(user.profileId)) return `${time}에 이미 출석을 했어요.`;
        let rank = (Number(data["store"][room].length) + 1);
        if (!data["list"][room]) data["list"][room] = [];
        if (!data["store"][room][user.profileId]) data["store"][room][user.profileId] = {
          today: "",
          today_ranking: 0,
          first_count: 0,
          count: 0,
          achieve: [0, 0, 0, 0, 0]
        };
        data["list"][room].push(user.profileId);
        data["store"][room][user.profileId].today = time;
        data["store"][room][user.profileId].today_ranking = rank;
        data["store"][room][user.profileId].count++;
        if (rank > 0 && rank <= 5) data["store"][room][user.profileId].achieve[rank - 1]++;
        if (data["store"][room][user.profileId].count === 1) {
          data["store"][room][user.profileId].first_count++;
          return `${time}에 출석을 했어요. 오늘 ${room}에서 1등으로 출석했어요.`;
        };
        Common.write(Library.FileList.AttenList, data);
        return `${time}에 출석을 했어요. 오늘 ${room}에서 ${rank}등으로 출석했어요.`;
      },


      //주식 코드
      interval: undefined,
      dealy: undefined,
      getStockList: function () {
        let stockList = DataBase.getStockList();
        return stockList;
      },
      buyStock: function (id, target, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let stockList = this.getStockList();
        if (!Object.keys(stockList).incluses(target)) return `존재하지않는 주식명이에요.`;

        if (user.coin < (stockList[target] * number)) return `소지하고 있는 재화가 부족해요.`;

        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";

        user.coin -= (stockList[target] * number);
        user.stock[target] += number;
        return `${target} ${number}주 구매가 완료되었습니다.`;

      },
      sellStock: function (id, target, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let stockList = this.getStockList();
        if (!Object.keys(stockList).incluses(target)) return `존재하지않는 주식명이에요.`;

        if (user.stock[target] < number) return `소지하고 있는 재화가 부족해요.`;

        if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return "은행 업무를 볼 수 있는 시간이 아니에요.";

        user.coin += (stockList[target] * number);
        user.stock[target] -= number;
        return `${target} ${number}주 판매가 완료되었습니다.`;
      },
      startStock: function () {
        let interval = setInterval(() => {
          if (new Date().getHours() <= 9 || new Date().getHours() >= 21) return this.endStock()
          let stockList = this.getStockList();
          Object.fromEntries(Object.entries(stockList).map(([key,value]) => [key, Math.random() > 0.5?value+=(Math.random() * value * 0.4):value-=(Math.random() * value * 0.4)]))
        }, 1000 * 60 * 10);
      },
      endStock: function () {
        clearInterval(interval)
        clearInterval(dealy)
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        dealy = setTimeout(() => {
          UserManager.startStock()
        }, tomorrow - new Date());

      },



      //도박 코드
      Betting: function (id, target, coin) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let rate = Common.Random(0, 10) < 4 ? 1 : 2;
        let winFlag, random;
        if (user.loan > 0) return "대출 중에는 베팅을 할 수 없어요.";
        if (Number(coin) > Library.BettingLimit) return [
          `배팅 금액 한도를 넘었어요.`,
          `배팅 금액 한도는 ${Library.BettingLimit}스타 에요`
        ].join('\n');;
        if (Number(coin) > user.coin) return "소지하고 있는 재화가 부족해요.";
        if (target === "흑" || target === "백") { //글자
          random = Common.Random(0, 1) === 0 ? "흑" : "백";
          if (random === target) {
            rate *= 2;
            winFlag = true;
          } else {
            winFlag = false;
          }
        } else { //숫자
          random = Common.Random(1, 5);
          if (random === Number(target)) {
            rate *= 3;
            winFlag = true;
          } else {
            winFlag = false;
          }
        }
        if (winFlag) {
          user.addCoin(Number(coin) * rate);
          return [`룰렛을 돌릴게요.`,
            `당신은 ${target}에 배팅했어요.`, ,
            `룰렛 결과는 [${random}]이에요.`,
            `당첨이에요. 배팅 금액인 ${coin}스타의 ${rate}배의 재화인 ${Number(coin) * rate}스타를 받았어요.`
          ].join('\n');
        } else {
          user.addCoin(-Number(coin));
          return [`룰렛을 돌릴게요.`,
            `당신은 ${target}에 배팅했어요.`, ,
            `룰렛 결과는 [${random}]이에요.`,
            `낙첨이에요. 배팅 금액인 ${coin}스타를 잃었어요.`
          ].join('\n');
        }
      },




      findUser: function (id) {
        return Find(id);
      },
      findUserById: function (id) {
        FindById(id);
      },
    }
  }


  module.exports = {
    UserManager: UserManager()
  };
})();
