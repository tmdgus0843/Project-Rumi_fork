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


let bot = BotManager.getCurrentBot();

function onMessage(msg) {
  if (msg.room !== Library.AdminRoom) return;

  if (msg.content.startsWith(Library.Prefix)) {
    switch (msg.content.replace(`${Library.Prefix} `, "")[0]) {
      case "컴파일":
        startComplie();
        break;
      case "시작":
        if (!BotManager.getPower("Main")) {
          BotManager.setPower("Main", true);
          msg.reply(`[ ${UserManager.findUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 시작할게요!`);
        } else {
          msg.reply(`[ ${UserManager.findUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템이 작동중이에요.`);
        }
        break;
      case "정지":
        if (BotManager.getPower("Main")) {
          BotManager.setPower("Main", false);
          msg.reply(`[ ${UserManager.findUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 정지할게요!`);
        } else {
          msg.reply(`[ ${UserManager.findUser(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 이미 시스템이 정지되어 있어요.`);
        }
        break;
    }
  }

  if (msg.content.startsWith(`${Library.Prefix} 공지`)) {
    let replaceMessage = msg.content.replace(`${Library.Prefix} 공지`, "");

    let roomList = {
      'TeamCloud 커뮤니티': false,
      '': false
    }

    for (let i = 0; i < Object.keys(roomList).length; i++) {
      bot.send(Object.keys(roomList)[i], `[ TeamCloud 공지 메시지 ]\n${replaceMessage}`);
      Object.keys(roomList)[i] = true
    }
    let t, f
    for (let i = 0; i < Object.keys(roomList).length; i++) {
      if (Object.keys(roomList)[i] == false) t++
      if (Object.keys(roomList)[i] == false) f++
    }
    bot.send(Library.AdminRoom, [
      `공지 메시지를 모두 전달했어요.`,
      `전달 성공 채팅방: ${t}개`,
      `전달 실패 채팅방: ${f}개`
    ].join("\n"));
  }


  let release = SystemManager.getRelease()[0];
  let updateList = Common.read(Library.FileList.UpdateList);
  if (Object.keys(updateList).includes(release.release_id)) return;
  if (release.id === 200) {
    updateList[release.release_id] = {
      "tag_name": release.tag_name,
      "body": release.body,
      "download": release.download
    };
    Common.write(Library.FileList.UpdateList, updateList);

    bot.send(Library.AdminRoom, [
      `새로운 릴리즈를 확인했어요!`,
      `코드 버전: ${release.tag_name}`,
      `업데이트 내용: ${release.body}`
    ].join("\n"));
    java.lang.Thread.sleep(500);
    bot.send(Library.AdminRoom, `봇 업데이트를 시작할게요.`);
    SystemManager.getFileDownload(release.download, `sdcard/TeamCloud/Project-Rumi/zips/`); //fileName === undefined
    java.lang.Thread.sleep(10000);
    unZip(java.io.File(`sdcard/TeamCloud/Project-Rumi/zips/`).list()[0], `sdcard/TeamCloud/Project-Rumi/codes/`);
    FileMove(java.io.File(`sdcard/TeamCloud/Project-Rumi/codes/`).list(), release.tag_name);
    bot.send(Library.AdminRoom, `봇 업데이트를 완료했어요.`);
  }
}
bot.addListener(Event.MESSAGE, onMessage);

let intervalBackup = setInterval(() => {
  SystemManager.BackUp();
}, Library.BackupTime);


function startComplie() {
  let success = true;
  try {
    BotManager.compileAll();
    clearInterval(intervalBackup);
  } catch (e) {
    bot.send(Library.AdminRoom, `컴파일 중 오류가 발생했어요.\n${e}`);
    success = false;
  }

  bot.send(Library.AdminRoom, "컴파일을 완료했어요.");
}