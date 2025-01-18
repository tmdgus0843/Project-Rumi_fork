//Main.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default"); //변수들 모음
Broadcast.send("Helper"); //도움말 객체
Broadcast.send("userManager"); //유저 담당 객체
Broadcast.send("TCApi"); //팀클라우드 Api 객체
Broadcast.send("Common"); //일반 function 모음

Broadcast.send("SystemManager"); //시스템 담당 객체
Broadcast.send("DataBase"); //데이터 담당 객체

let ActingList = []; //도배 감지 {room, flag:(Y or N)}

function onMessage(msg) {


  if (msg.content == `${Default.prefix} 기본정보`) {
    msg.reply([
      `방이름: ${msg.room.name}`,
      `사람이름: ${msg.author.name}`,
      `방 분류: ${msg.room.name == Default.MainRoomName ? "TRUE(1)" : "FALSE"}`
    ].join("\n"));
  } else {
    if (msg.content == Default.prefix + "도움말") msg.reply([
      `${msg.author.name}님! 아래 도움말을 참고해보세요!`,
      `https://www.team-cloud.kro.kr/manual`
    ].join("\n"));
    if (msg.room.name == Default.MainRoomName) {
      if (msg.content.includes(Default.prefix + "eval")) {
        if (Default.evalFlag) msg.send(eval(msg.content.replice(Default.prefix + "eval", "")));
      }
    } else {
      if (msg.isGroupChat) return;
      if (msg.startsWith(Default.prefix)) {
        if (checkCmdING(msg.room.name)) return msg.reply(`현재 명령어를 실행중이에요. 나중에 다시 시도해주세요!`);
        msg.reply(setCmdING(msg.room.name, true));
      }
      try {
        msg.reply(userCmd(msg.room.name, msg.content, msg.author.name, msg.author.hash))
      } catch (e) {
        Common.logE([
          `[Error]`,
          `room: ${msg.room.name}`,
          `sender: ${msg.author.name} (${msg.author.hash})`,
          `errorTitle: ${e.name}`,
          `errorMessage: ${e.message}`,
          `errorStack: ${e.stack}`
        ].join("\n"));
        msg.reply([
          `어라..? 머리가 어질어질...`,
          `[${e.name}: ${e.message}]`,
          `[${e.stack}]`
        ].join("\n"));
      } finally {
        if (msg.startsWith(Default.prefix)) {
          java.lang.Thread.sleep(200);
          msg.reply(setCmdING(msg.room.name, false));
        }
      }
    }



  }
}

function userCmd(roomName, message, authorName, authorHash) {
  if (message == `${Default.prefix} 등록`) {
    if (userManager.set()) {}
  }
}
//11/24 수정
function checkCmdING(roomName) {

}