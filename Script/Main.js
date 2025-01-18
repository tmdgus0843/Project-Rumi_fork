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
  UserManager
} = require("UserManager");

let {
  SystemManager
} = require("SystemManager");
let {
  RecordManager
} = require("RecordManager");
let {
  DataBase
} = require("DataBase");

let getRandom = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let botCallCount = {};

let bot = BotManager.getCurrentBot();

function onMessage(msg) {
  let command = (commandText) => {
    return msg.content === `${Library.CommandPrefix} ${commandText}`;
  };
  let commandSW = (commandText) => {
    return msg.content.startsWith(`${Library.CommandPrefix} ${commandText}`);
  };

  let botMessage = Common.read(Library.DBFileList["Message"])["Message"];

  if (command(`기본정보`)) {
    msg.reply([
      `방이름: ${msg.room}`,
      `사람이름: ${msg.author.name}`
    ].join("\n"));
  } else {
    if (command(`도움말`)) msg.reply([
      `${msg.author.name}님! 아래 도움말을 참고해보세요!`,
      `https://www.team-cloud.kro.kr/manual`
    ].join("\n"));
    if (msg.room == Library.AdminRoom) {
      if (commandSW(`eval`)) {
        try {
          msg.reply(eval(msg.content.replace(`${Library.CommandPrefix} eval`, "")));
        } catch (e) {
          msg.reply([
            getRandom(botMessage["Bug"]),
            `[${e.name}: ${e.message}]`,
            `[${e.stack}]`
          ].join("\n"));
        }
      }
    } else {
      try {
        UserCommand(msg.room, msg.content, msg.author.name, msg.author.hash, msg.reply);
      } catch (e) {
        Common.logE([
          getRandom(botMessage["Error"]),
          `room: ${msg.room}`,
          `sender: ${msg.author.name} (${msg.author.hash})`,
          `errorTitle: ${e.name}`,
          `errorMessage: ${e.message}`,
          `errorStack: ${e.stack}`
        ].join("\n"));
        msg.reply([
          getRandom(botMessage["Bug"]),
          `[${e.name}: ${e.message}]`,
          `[${e.stack}]`
        ].join("\n"));
      }
    }
  }
}
bot.addListener(Event.MESSAGE, onMessage);


function UserCommand(roomName, message, authorName, authorHash, reply) {
  let command = (commandText) => {
    return message === `${Library.CommandPrefix} ${commandText}`;
  };
  let commandSW = (commandText) => {
    return message.startsWith(`${Library.CommandPrefix} ${commandText}`);
  };

  if (command(`등록`)) {
    let userID = '';
    let list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''); //배열로 변경
    do {
      for (let i = 0; i < 5; i++) {
        userID += list.getRandom();
      }
    } while ((UserManager.findUserById(userID) == null));

    if (UserManager.makeUser(authorName, userID, authorHash)) {
      RecordManager.Record(UserManager.findUserById(userID).hash, "user", "회원가입을 시도함.");
      bot.send(Library.AdminRoom, `[${authorName}]님이 회원 가입을 완료했어요`);
      RecordManager.Record(UserManager.findUserById(userID).hash, "bot", `회원가입을 완료함.`);
      reply(`회원가입을 완료했어요:)`);
      botCallCount[authorHash] = 0;
    } else {
      RecordManager.Record(authorHash, "user", `회원가입을 시도함.`)
      reply(`이미 회원가입을 완료했어요.`)
      RecordManager.Record(authorHash, "bot", `회원가입을 실패함.(이미 회원가입을 완료함.)`)
    }
  } else if (command(`계정정보`)) {
    reply(`${UserManager.UserInfo(authorHash)}`);
  } else {
    PlayCommand(roomName, message, authorName, authorHash, reply);
  }
}


function PlayCommand(room, message, authorName, authorHash, reply) {

  let command = (commandText) => {
    return message === `${Library.CommandPrefix} ${commandText}`;
  }
  let commandSW = (commandText) => {
    return message.startsWith(`${Library.CommandPrefix} ${commandText}`);
  }

  let splitMessage = message.split(" ");

  let botMessage = Common.read(Library.FileList["Message"])["Message"];

  let msgReply = function (type) {
    let msg = botMessage["Normal"][type].getRandom();
    let replyStr;
    let replaceStr = {
      "\\bnickname\\b": authorName,
      "\\bY\\b": new Date().getFullYear(),
      "\\bM\\b": new Date().getMonth() + 1,
      "\\bD\\b": new Date().getDate(),
      "\\bh\\b": new Date().getHours(),
      "\\bm\\b": new Date().getMinutes(),
      "\\bLike\\b": UserManager.findUser(authorHash).like
    };
    for (let key in replaceStr) {
      if (replaceStr.hasOwnProperty(key)) {
        let regex = new RegExp(key, "g")
        replyStr = msg.replace(regex, replaceStr[key]);
      }
    }

    return replyStr;
  }
  let commands = {
    "안녕": () => reply(msgReply("Hello")),
    "너": () => reply(msgReply("You")),
    "나": () => reply(msgReply("Me")),
    "지금": () => reply(msgReply("Time")),
    "오늘": () => reply(msgReply("Today")),
    "새해": () => {
      let now = new Date();
      if (now.getMonth() + 1 === 1 && now.getDate() === 1) {
        reply(msgReply("New_Year"));
      } else {
        reply(msgReply("New_Year_Past"));
      }
    },
    "핑": () => reply(msgReply("Ping")),
    "노크": () => reply(msgReply("Knock")),
    "더워": () => reply(msgReply("Hot")),
    "추워": () => reply(msgReply("Cold")),
    "얌얌": () => reply(msgReply("Yam")),
    "배고파": () => reply(msgReply("Hungry")),
    "치킨": () => reply(msgReply("Chicken")),
    "당근": () => reply(msgReply("Carrot")),
    "게임추천": () => reply(msgReply("Game_ECT")),
    "게임하자": () => reply(msgReply("Game")),
    "동전던지기": () => reply(msgReply("Coin")),
    "자폭해": () => reply(msgReply("Boom")),
    "도와줘": () => reply(msgReply("Help")),
    "응애": () => reply(msgReply("응애")),
    "잘자": () => reply(msgReply("Seelp")),
    "구름": () => reply(msgReply("Cloud")),
    "뷁": () => reply(msgReply("Papering")),
    "뽀뽀": () => reply(msgReply("Kiss")),
    "사랑해": () => reply(msgReply("Love")),
    "왜": () => reply(msgReply("Why")),
    "미안해": () => reply(msgReply("Sorry")),
    "1+1": () => reply(msgReply("OPO")),
    "비트박스": () => reply(msgReply("Beatbox")),
    "노래": () => reply(msgReply("Sing")),
    "뭐해": () => reply(msgReply("Do")),
    "성별": () => reply(msgReply("Sex")),
    "응": () => reply(msgReply("Yes")),
    "아니": () => reply(msgReply("No")),
    "업데이트": () => reply(msgReply("Update")),

    "": () => reply(msgReply("Hey_Rumi")),
    "루미": () => reply(msgReply("Rumi")),
    "초대": () => reply(msgReply("Invite")),
    "저장공간": () => reply(msgReply("Mb")),
    "생일": () => reply(msgReply("HBD")),
    "오픈채팅봇": () => reply(msgReply("OCB")),
    "명령어": () => reply(msgReply("Command")),
    "호감도": () => reply(msgReply("Like")),

    "팀클라우드": () => reply(msgReply("TeamCloud")),
    "옐루": () => reply(msgReply("Yellu")),
    "hello": () => reply(msgReply("Hello")),
    "루미니떼": () => reply(msgReply("LuminiteK")),
    "에릭": () => reply(msgReply("Eric")),

    "ㅗ": () => {
      msgReply("F**k").forEach(function (item) {
        let match = item.match(/(.*?)(\d+)$/);
        if (match) {
          let str = match[1].trim();
          let num = Number(match[2]);
          UserManager.findUser(authorHash).coin -= num;
          reply(str);
        }
      });
    },
    "싫어": () => {
      msgReply("Hate").forEach(function (item) {
        let match = item.match(/(.*?)(\d+)$/);
        if (match) {
          let str = match[1].trim();
          let num = Number(match[2]);
          UserManager.findUser(authorHash).coin -= num;
          reply(str);
        }
      });
    },
    "바보": () => {
      msgReply("Stupid").forEach(function (item) {
        let match = item.match(/(.*?)(\d+)$/);
        if (match) {
          let str = match[1].trim();
          let num = Number(match[2]);
          UserManager.findUser(authorHash).coin -= num;
          reply(str);
        }
      });
    },
  };
  if (message.startsWith(Library.CommandPrefix)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let command = message.replace(`${Library.CommandPrefix} `, "");
    if (commands[command]) {
      commands[command]();
      botCallCount++;
      if (botCallCount == 5) {
        msgReply("Hey").forEach(function (item) {
          let match = item.match(/(.*?)(\d+)$/);
          if (match) {
            let str = match[1].trim();
            let num = Number(match[2]);
            UserManager.findUser(authorHash).coin -= num;
            reply(str);
          }
        });
      }
      if (botCallCount >= 10) {
        msgReply("Hey_Many").forEach(function (item) {
          let match = item.match(/(.*?)(\d+)$/);
          if (match) {
            let str = match[1].trim();
            let num = Number(match[2]);
            UserManager.findUser(authorHash).coin -= num;
            reply(str);
          }
        });
        botCallCount[authorHash] = 0;
      }
    }
  }


  if (command(`식사`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply(UserManager.eat(authorHash, message.seplice(`${Library.CommandPrefix} 식사 `, "")));
  }

  if (command(`대출하기`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply([
      `대출은 '루미야 대출 [대출명] [금액]'이라고 입력해주세요`,
      `예시를 보여줄게요. ex) 루미야 대출 스타대출 10000`,
      `위 명령어는 스타대출로 10000스타을 대출하는 명령어에요.`
    ].join("\n"));
    reply(UserManager.getLoanList(authorHash));
  }
  if (commandSW(`대출`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let itemName = splitMessage[2];
    let count = splitMessage[3];
    if (itemName === undefined || count === undefined) return reply(`명령어를 제대로 입력해주세요.`);
    reply(UserManager.Loan(authorHash, "loan", itemName, ChangeNumber(count)));
  }
  if (commandSW(`정산`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply(UserManager.calcLoan(authorHash));
  }
  if (commandSW(`해지`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply(UserManager.cancelLoan(authorHash));
  }

  if (command(`구매하기`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply([
      `구매를 하려면 '루미야 구매 [아이템명] [갯수]'이라고 입력해주세요.`,
      `예시를 보여 줄게요. ex) 루미야 구매 5 쿠키`,
      `위 명령어는 쿠키를 5개를 구매한다는 의미에요.`
    ].join("\n"));
    reply(UserManager.getSaleList(authorHash));
  }
  if (commandSW(`구매`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let itemName = splitMessage[2];
    let count = splitMessage[3];
    if (itemName === undefined || count === undefined) return reply(`명령어를 제대로 입력해주세요.`);
    reply(UserManager.Purchase(authorHash, itemName, ChangeNumber(count)));
  }

  if (command(`판매하기`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply([
      `구매를 하려면 '루미야 판매 [아이템명] [갯수]'이라고 입력해주세요.`,
      `예시를 보여 줄게요. ex) 루미야 판매 쿠키 3`,
      `위 명령어는 쿠키를 3개를 판매한다는 의미에요.`
    ].join("\n"));
    reply([
      `판매 가능한 아이템이에요!`,
      `${UserManager.OpenBag(authorHash)}`
    ].join("\n"));
  }
  if (commandSW(`판매`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let itemName = splitMessage[2];
    let count = splitMessage[3];
    if (itemName === undefined || count === undefined) return reply(`명령어를 제대로 입력해주세요.`);
    reply(UserManager.Purchase(authorHash, itemName, ChangeNumber(count)));
  }


  if (command(`사용`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply([
      `사용을 하려면 '루미야 사용 [품목번호]'이라고 입력해주세요.`,
      `예시를 보여 줄게요. ex) 루미야 사용 3`,
      `위 명령어는 3번 품목(ai 5회 이용권)를 사용한다는 의미에요.`
    ].join("\n"));
    let itemName = splitMessage[2];
    if (itemName === undefined) return reply(`명령어를 제대로 입력해주세요.`);
    reply(UserManager.UseItem(authorHash, itemName));
  }


  if (commandSW(`베팅`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let itemName = splitMessage[2];
    let count = splitMessage[3];
    if (itemName === undefined || !Number(count) === undefined) return reply(`명령어를 제대로 입력해주세요.`);
    reply(UserManager.Betting(authorHash, itemName, ChangeNumber(count)));
  }


  if (command(`출석`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply(UserManager.checkAtten(authorHash));
  }
  if (command(`출석 순위`)) {
    if (!UserManager.contain) return reply(`생성된 계정이 없어요.`);
    let rank = Object.keys(data["list"][room]).map(u =>
      `${Object.keys(data["list"][room]).indexOf(u) + 1}위ㅣ${UserManager.findUser(data["list"][room][u]).name}(${data["list"][room][u]})`
    ).join('\n\n');
    return [
      `${room}에서의 출석 순위를 알려드릴게요.`,
      Library.More, ,
      `${rank}`
    ].join('\n');
  }


  if (command(`우편`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let PostList = SystemManager.getPostList(authorHash);

    let rtnStr = [`[${authorName}]님의 우편함이에요.`];
    for (let i = 0; i < PostList.length; i++) {
      rtnStr.push(`${(i + 1)}. ${PostList[i].message}`);
      if (PostList[i].itemList.length <= 0) return;
      for (let j = 0; j < PostList[i].itemList.length; j++) {
        rtnStr.push(`\t- ${PostList[i].itemList[j].name} x ${PostList[i].itemList[j].count}`);
      }
      if (PostList[i].coin !== "0") rtnStr.push(`\t- ${PostList[i].coin}스타`);
      reply([
        rtnStr, ,
        `우편을 받으려면 '루미야 우편 받기 [우편번호]'라고 입력해주세요.`,
        `우편을 모두 받으려면 '루미야 우편 모두받기'라고 입력해주세요.`
      ].join("\n"));
    }
  }

  if (commandSW(`우편 받기`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let PostList = SystemManager.getPostList(authorHash);
    let postIndex = splitMessage[3];
    if (postIndex === undefined || postIndex !== NaN) return reply(`명령어를 제대로 입력해주세요.`);
    if (postIndex < 0) return reply(`해당 우편이 존재하지 않아요.`);

    if (PostList[postIndex].itemList.length <= 0) SystemManager.removePost(postIndex);
    reply(UserManager.RecivePost(authorHash, PostList[postIndex].itemList, PostList[postIndex].coin));
    SystemManager.removePost(postIndex);
  }

  if (commandSW(`우편 모두받기`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    let PostList = SystemManager.getPostList(authorHash);

    reply(UserManager.ReciveAllPost(authorHash, PostList));
    SystemManager.removePostAll(authorHash);
  }

  if (command(`스타랭크`)) {
    if (!UserManager.contain(authorHash)) return reply(`생성된 계정이 없어요.`);
    reply(UserManager.RankingInfo(authorHash));
  }

}

function checkNumberic(num) {
  // 숫자인지 확인, 양수인지 확인
  return !isNaN(num) && (Number(num) >= 1);
}

function ChangeNumber(num) {
  return (checkNumberic(num) ? Math.floor(Number(num)) : 1);
}