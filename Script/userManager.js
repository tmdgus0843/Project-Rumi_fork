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
       //랜덤 아이디 생성
      let id = function () {
        let id = "";
        for (let i = 0; i < 10; i++) {
          id += Common.RandomArray(["0", "1", "2", "3", "4", "5", ",6", "7", "8", "9"]);
        }
        return id;
      }
      let obj = {
        name: name,
        id: id(),
        profileId: profileId,
        signUpDate: [new Date().getFullYear(), new Date().getMonth(), new Date().getDay()],
        admin: false,
        ban: false,
        warn: 0,
        coin: 10000,
        hungry: 0,
        chatCount: 0,
        favorability: 0,
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
      let rtnStr = [];
      if (item !== undefined) {
        for (let i = 0; i < item.length; i++) {
          user.addItem(item[i].type, item[i].name, item[i].count);
          rtnStr.push(`${item[i].name}을(를) ${item[i].count}개 받았어요.`);
        }
      }
      if (coin !== undefined) {
        user.addCoin(Number(coin));
        if (Number(coin) > 0) rtnStr.push(`${coin}스타를 받았어요.`);
        if (Number(coin) < 0) rtnStr.push(`${coin}스타를 회수했어요.`);
      }
      Save();
      return rtnStr.join("\n");
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
          `\t- 채팅 수 : ${user.chatCount}회`,
          `\t- 주식 : ${Object.entries(user.stock).map(([key, value]) => value > 0 ? (`${key} : ${value}`): "").join(", ")}`,
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


      //날씨
      getWeather: function (id, location) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let weather = org.jsoup.Jsoup.connect(`https://search.naver.com/search.naver?&query=${location}+날씨`).ignoreHttpErrors(true).get();
        if (!weather.select("span.text").text().includes("기상청")) return `해당 지역의 날씨 정보를 찾을 수 없어요.(날씨 기능은 국내만 지원해요.)`;
        return [
          `${weather.select("div.title_area._area_panel").select("h2.title").text()}(${weather.select("div.title_area._area_panel").select("span.select_txt_sub").text()})의 날씨에 대해 알려드릴게요.`,
          `해당 지역은 날씨가 ${weather.select("span.weather.before_slash").text()}이에요.`,
          `온도: ${weather.select("div._today").select("div.temperature_text").text().replace("현재 온도", "")}`,
          `(${(weather.select("span.temperature.up").text() === undefined) ? "어제보다 " + weather.select("span.temperature.down").text() : "어제보다 " + weather.select("span.temperature.up").text()})`,
          `체감온도는 ${weather.select("dd.desc")[0].text()}에요.`,
          `습도는 ${weather.select("dd.desc")[1].text()}에요.`,
          `${weather.select("dt.term")[2].text()}은 ${weather.select("dd.desc")[2].text()}에요.`,
          `미세먼지는 ${weather.select("span.txt")[0].text()}이고, 초미세먼지는 ${weather.select("span.txt")[1].text()}이에요.`,
          `자외선은 ${weather.select("span.txt")[2].text()}이에요.`,
          `오늘의 ${weather.select("strong.title")[3].text()}은 ${weather.select("span.txt")[3].text()}이에요.`,
          `해당 정보는 대한민국 기상청에서 제공하는 정보에요.`
        ].join("\n");
      },


      //음악
      getMusicChart: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let music = org.jsoup.Jsoup.connect(`https://www.melon.com/chart/`).ignoreHttpErrors(true).get();
        let musicList = [];
        let date = music.select("span.year").text() + " " + music.select("span.hour").text();
        let title = music.select("tr.lst50")[0].select("div.ellipsis.rank01").text();
        let singer = music.select("tr.lst50")[0].select("div.ellipsis.rank02").text();
        for (let i = 0; i < 100; i++) {
          musicList.push(`${i + 1}위 : ${title} - ${singer}`);
        }
        return [
          `${date} 기준, 멜론 차트 100위까지 알려드릴게요.`,
          Library.More,
          musicList.join("\n")
        ].join("\n");
        // 기준 : music.select("span.year").text() + " " + music.select("span.hour").text()
        // title : music.select("tr.lst50")[0].select("div.ellipsis.rank01").text()
        // singer : music.select("tr.lst50")[0].select("div.ellipsis.rank02").text()
        // album : music.select("tr.lst50")[0].select("div.ellipsis.rank03").text()
        // image : music.select("tr.lst50")[0].select("a.image_typeAll img").first().attr("src").replace("/melon/resize/120/quality/80/optimize","")
      },
      getMusicSearch: function (id, song) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let music = org.jsoup.Jsoup.connect(`https://www.melon.com/search/keyword/index.json?j&query=${song}`)
          .ignoreHttpErrors(true)
          .ignoreContentType(true)
          .execute()
          .body()["SONGCONTENTS"][0];

        let musicLyrics = org.jsoup.Jsoup.connect(`https://www.melon.com/song/detail.htm?songId=${music["SONGID"]}`)
          .ignoreHttpErrors(true)
          .get()
          .select("div#d_video_summary")
          .html()
          .split("--> ")[1]
          .replace(/<br>/g, "");
        return [
          [
            `${music["ARTISTNAME"]}의 ${music["SONGNAME"]} 노래 가사에요.`,
            Library.More,
            `${musicLyrics}`
          ].join("\n"),
          music["ALBUMIMG"].replace("/melon/resize/40/quality/80/optimize", "") //jpg
        ];

        // title : music["SONGNAME"]
        // singer : music["ARTISTNAME"]
        // album : music["ALBUMNAME"]
        // image : music["ALBUMIMG"].replace("/melon/resize/40/quality/80/optimize", "")
        // songid : music["SONGID"]
      },
      getRandomMusic: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let music = org.jsoup.Jsoup.connect(`https://www.melon.com/chart/`).ignoreHttpErrors(true).get();
        let random = Common.Random(0, 100);
        let title = music.select("tr.lst50")[random].select("div.ellipsis.rank01").text();
        let singer = music.select("tr.lst50")[random].select("div.ellipsis.rank02").text();
        return [`${singer}의 ${title}은 어떠세요?`, `${singer}의 ${title}을(를) 추천해요.`];
      },



      /**
       * 
       * @param {String} id 사용자 아이디
       * @param {String} index 상품번호 
       * @returns 
       */
      UseItem: function (id, index) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let DBItem = DataBase.getItem(index);
        if (DBItem === null) return `존재하지 않는 아이템이에요.`;
        if (user.isItemCount(DBItem.type, DBItem.name, 1)) {
          let itemType = "";
          let result = "";
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
          result = user.useItem(DBItem.type, DBItem.name);
          Save();
          return [
            `${DBItem.name}을(를) 사용했어요.`,
            result
          ].join("\n");
        } else {
          return "해당 아이템을 보유하고 있지 않아요.";
        }
      },


      //포스트 코드
      RecivePost: function (id, item, coin) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        return RecivePost(user, item, coin);
      },
      ReciveAllPost: function (id, postList) {
        let user = Find(id);
        let rtnStr = [];
        if (user === null) return `생성된 계정이 없어요.`;
        for (let i = 0; i < postList.length; i++) {
          rtnStr.push(RecivePost(user, postList[i].item, postList[i].coin));
        }
        return rtnStr.join("\n");
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


      //로또 코드
      buyLotto: function (id, count) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        if (user.getItemList("lotto")) return "이미 로또를 구매하셨어요.";
        let lottoList = [];
        for (let i = 0; i < count; i++) {
          let lotto = [];
          for (let j = 0; j < 7; j++) {
            lotto.push(Common.Random(1, 45));
          }
          lottoList.push(lotto);
        }
        user.addCoin(-(1000 * count));
        user.addItem("lotto", lottoList);
        Save();
        let rtnArr = [];
        for (let i = 0; i < lottoList.length; i++) {
          rtnArr.push(`${i+1} : ${lottoList[i].join(", ")}`);
        }
        return [
          `로또를 구매했어요.`,
          `${rtnArr.join("\n")}`
        ].join("\n");
      },
      getLottoRecord: function (id, count) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        if (count > Common.read(Library.FileList.LottoList).length) return "존재하지 않는 회차에요.";
        let lottoList = Common.read(Library.FileList.LottoList);
        return [
          `제 ${count}회 구름로또 당첨 번호는 [${lottoList[count-1].lotto.join(", ")}]이에요.`,
          `보너스 번호는 [${lottoList[count-1].bonus}]이에요.`
        ]
      },
      lottoCheck: function (id, count) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let lotto = [];
        for (let j = 0; j < 7; j++) {
          lotto.push(Common.Random(1, 45));
        }
        let bonus = Common.Random(1, 45);
        let lottoList = Common.read(Library.FileList.LottoList);
        lottoList.push({
          lotto: lotto,
          bonus: bonus
        });
        Common.write(Library.FileList.LottoList, lottoList) //로또 번호 저장
        return [
          `제 ${count}회 구름로또 당첨 번호는 [${lotto.join(", ")}]이에요.`,
          `보너스 번호는 [${bonus}]이에요.`
        ].join("\n");
      },


      //은행 코드
      getLoanList: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        let DBLoan = DataBase.getLoanList();
        let rtnArr = [];
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";
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
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        if (Library.MaxLoan < coin) return `대출 한도를 초과했어요. 대출 한도는 ${Library.MaxLoan}스타에요.`;
        if (DBLoan === null) return "존재하지 않는 대출 상품이에요.";
        if (user.loan["index"] !== "") return "이미 대출을 받아서 더이상 은행 업무를 볼 수 없어요. 대출을 갚은 후 다시 시도해주세요.";
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
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        let remainTime = loan.time + (Number(DBLoan.period) * 24 * 60 * 60 * 1000) - (new Date()).getTime();
        if (remainTime > 0) return `아직 대출 기간이 남았어요. ${Math.floor(remainTime / (24 * 60 * 60 * 1000))}일 후에 정산해주세요.`;
        if (loan.index === "") return "대출을 받지 않았어요.";
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
        if (loan.index === "") return "대출을 받지 않았어요.";
        let DBLoan = DataBase.getLoan(loan.index);
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        let calcCoin = Math.floor(loan.coin * (1 + Number(DBLoan.rate)));
        if (calcCoin > user.coin) return "소지하고 있는 재화가 부족해요.";
        user.addCoin(-calcCoin);
        user.removeLoan();
        return [
          `현재 대출을 해지할게요. 중도해지라도 이자를 차감해요.`,
          `${calcCoin}스타를 갚았어요.`
        ].join('\n');
      },
      //송금
      Remittance: function (id, target, coin) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";
        let targetUser = Find(target);
        if (targetUser === null) return `존재하지 않는 계정이에요.`;
        if (coin > user.coin) return "소지하고 있는 재화가 부족해요.";
        if (coin > Library.MaxRemittance) return `송금 한도를 초과했어요. 송금 한도는 ${Library.MaxRemittance}스타에요.`;
        user.addCoin(-coin);
        targetUser.addCoin(coin);
        Save();
        return [
          `${targetUser.name}님에게 ${coin}스타를 송금했어요.`
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
      delay: undefined,
      getStockList: function () {
        return DataBase.getStockList();
      },
      buyStock: function (id, target, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let stockList = this.getStockList();
        if (!Object.keys(stockList).includes(target)) return "존재하지 않는 주식명이에요.";
        if (user.coin < (stockList[target] * number)) return "소지하고 있는 재화가 부족해요.";
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";

        user.coin -= (stockList[target] * number);
        user.stock[target] += number;
        return `${target} ${number}주를 구매했어요.`;
      },
      sellStock: function (id, target, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let stockList = this.getStockList();
        if (!Object.keys(stockList).includes(target)) return "존재하지 않는 주식명이에요.";
        if (user.stock[target] < number) return "소지하고 있는 주식이 부족해요.";
        if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return "은행 업무를 볼 수 있는 시간이 아니에요.";

        user.coin += (stockList[target] * number);
        user.stock[target] -= number;
        return `${target} ${number}주를 판매했어요.`;
      },
      startStock: function () {
        this.interval = setInterval(() => {
          if (new Date().getHours() <= Library.BankTime[0] || new Date().getHours() >= Library.BankTime[1]) return this.endStock();
          let stockList = this.getStockList();
          Common.write(Library.FileList["StockList"], Object.fromEntries(Object.entries(stockList).map(([key, value]) => [key, Math.random() > 0.5 ? value += (Math.random() * value * 0.4) : value -= (Math.random() * value * 0.4)])));
        }, 1000 * 60 * 10);
      },
      endStock: function () {
        clearInterval(this.interval);
        clearInterval(this.delay)
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        this.delay = setTimeout(() => {
          this.startStock();
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
          if ()
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



      //숫자 야구
      numberGame: {}, //게임 진행중인지 확인
      numberGameNum: {}, //게임 진행중인 숫자
      numberBaseballStart: function (id, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        if (numberGame[id] !== undefined) return [
          `이미 진행중이에요.`,
          `다시 시작하려면 "${Library.CommandPrefix} 숫자야구 종료"를 입력해주세요.`
        ].join("\n");

        while (numberGame[id].length !== Library.numberGameLength) {
          let num = Math.floor(Math.random() * 9) + 1;
          if (!numberGame[id].includes(num)) numberGame[id].push(num);
        };
        numberGameNum[id] = 0;
        return [
          `숫자야구를 시작할게요.`,
          `진행하려면 "${Library.CommandPrefix} 확인 (숫자)"를 입력해주세요.`,
          `숫자는 ${Library.numberGameLength}자리의 숫자로 이루어져야 하고, 1~9개의 숫자가 중복없이 이루어져 있어요.`
        ].join("\n");
      },

      numberGameEnd: function (id) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        if (numberGame[id] === undefined) return [
          `게임을 진행하고 있지 않아요.`,
          `게임을 시작하려면 "${Library.CommandPrefix} 숫자야구 시작"을 입력해주세요.`
        ].join("\n");
        delete numberGame[id];
        delete numberGameNum[id];
        return `숫자야구를 종료했어요.`;
      },

      numberGameCheck: function (id, number) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        if (numberGame[id] === undefined) return [
          `게임을 진행하고 있지 않아요.`,
          `게임을 시작하려면 "${Library.CommandPrefix} 숫자야구 시작"을 입력해주세요.`
        ].join("\n");
        if (number.length !== Library.numberGameLength) return [
          `게임 규칙을 다시 확인해주세요.`,
          `숫자는 ${Library.numberGameLength}자리의 숫자로 이루어져야 하고, 1~9개의 숫자가 중복없이 이루어져 있어요.`
        ]

        let scroe = [0, 0, 0];
        for (let i = 0; i <= Library.numberGameLength; i++) {
          if (number[i] === this.numberGame[id][i]) scroe[0]++;
          else if (this.numberGame[id].includes(number[i])) scroe[1]++;
          else scroe[2]++;
        }

        this.numberGameNum[id]++;
        if (score[0] === Library.numberGameLength) {
          this.numberGame[id] = undefined;
          this.numberGameNum[id] = 0;
          return `게임이 종료되었어요.`;
        }
        return [
          `결과는 [${score[0]}Strike ${score[1]}Ball ${score[2]}Out]이에요.`,
          `${this.numberGameNum[id]}번째 시도에요.`
        ].join("\n");
      },


      /**
       * 
       * @description 그래프 생성
       * @param {Array} labels ["1일", "2일", "3일", "4일"]
       * @param {Object} data [{label: "first", data: [23, 56,12, 95]}]
       * @param {String} title 그래프 제목
       * @returns 
       */
      graph: function (labels, data, title) {
        let datasets = [];
        for (let i = 0; i < data.length; i++) {
          datasets.push({
            "label": data[i].label,
            "backgroundColor": "rgb(255, 255, 255)",
            "borderColor": "rgb(255, 255, 255)",
            "fill": false,
            "data": data[i].data
          });
        }
        return JSON.parse(org.jsoup.Jsoup.connect("https://quickchart.io/chart/create")
          .header("Content-Type", "application/json")
          .requestBody(JSON.stringify({
            "chart": {
              "type": "line",
              "data": [{
                "labels": labels, //day
                "datasets": datasets,
              }],
              "options": {
                "title": {
                  "display": true,
                  "text": title,
                },
                "plugins": {
                  "backgroundImageUrl": "https://res.cloudinary.com/teamcloud/image/upload/v1740378340/v8vdboe9mzepol5d3mg5.png" //흰색 배경
                }
              }
            }
          }))
          .ignoreContentType(true)
          .ignoreHttpErrors(true)
          .post()
          .text())["url"];
      },



      /**
       * 
       * @description 이미지 가져오기
       * @param {String} id 사용자 아이디
       * @param {String} room 방이름
       * @returns {Object} 이미지 정보 객체
       */
      getImage: function (id, room) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let imageObj = Common.read(`${Library.FolderList["ChatFolder"]}${room}.json`)[id]; //{image}
        switch (imageObj.code) {
          case 200:
            return imageObj.image; //{url, mimeType}
          case 400:
            return "답장을 사용해주세요.";
          case 404:
            return "이미지를 가져올 수 없어요.";
          default:
            return "이미지를 가져올 수 없어요.";
        }
      },

      /**
       * 
       * @description 이미지 분석
       * @param {String} id 사용자 아이디
       * @param {Object} image 이미지 정보
       * @param {String} image.url 이미지 URL
       * @param {String} image.mimeType 이미지 MIME 타입
       * @param {String} addPrompt 추가 질문
       * @returns {String} 이미지 분석 결과
       */
      imageAnalyze: function (id, image, addPrompt) {
        let user = Find(id);
        if (user === null) return `생성된 계정이 없어요.`;

        let imageToBase64 = org.jsoup.Jsoup.connect(`https://itob.kro.kr/encord?url=${image.url}`).ignoreHttpErrors(true).get();

        let prompt = "해당 이미지를 설명 또는 분석하시오. 다른 말은 하지마시오.";
        prompt = addPrompt ? addPrompt + "\n" + prompt : prompt;
        let requestBody = {
          contents: [{
            role: "user",
            parts: [{
              text: ""
            }]
          }],
          tools: [{
            google_search: {}
          }],
          generationConfig: {
            response_modalities: ["TEXT"]
          },
          systemInstruction: {
            role: "user",
            parts: [{
              text: prompt
            }]
          }
        };

        if (image.mimeType) {
          requestBody.contents[0].parts.push({
            image: {
              mimeType: image.mimeType,
              data: imageToBase64
            }
          });
        }

        let analyze = JSON.parse(org.jsoup.Jsoup.connect(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Common.read(Library.FileList["KeyList"]).GeminiAPIKey}`)
          .ignoreContentType(true)
          .header("Content-Type", "application/json")
          .requestBody(JSON.stringify(requestBody))
          .post()
          .body());
        if (analyze.candidates[0].content.parts.length <= 0) return "제미나이 API 응답 오류: 응답 구조가 예상과 다릅니다.";

        return analyze.candidates[0].content.parts[0].text;
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