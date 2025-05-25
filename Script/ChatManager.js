/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 https://github.com/NyangBotLab/DBManager_deploy 의 DBManager 모듈을 사용하였습니다.
/////////////////

const DB = require("DBManager").DBManager;
let DBListener = DB.getInstance();

const bot = BotManager.getCurrentBot();

DBListener.on("message", (chat, channel) => {
  channel.send("TEST" + chat.text);
  Broadcast.send("Chat.message" + channel.id, {
    // {String} 메시지의 고유 id
    getId: () => chat.id,

    // {String} 메시지 내용
    getText: () => chat.text,

    // {Array} 멘션 멤버들
    getMentions: () => {
      let mentionList = []
      for (let i = 0; i < chat.mentions.length; i++) {
        mentionList.push(chat.mentions[i].name);
      }
      return mentionList;
    },

    // {Array} 메시지를 읽은 멤버들
    getReadMembers: () => {
      let readMemberList = []
      for (let i = 0; i < chat.readMembers.length; i++) {
        readMemberList.push(chat.readMembers[i].name);
      }
      return readMemberList;
    },

    // {Date} 메시지 전송 시간
    getSendTime: () => chat.sendTime,

    // {Object} 메시지 답장
    reply: (chat.isReply() ? {
      // {String} 이전 메시지
      getPrevChat: () => chat.source.getPrevChat().text,
      // {String} 다음 메시지
      getNextChat: () => chat.source.getNextChat().text,
    } : null),

    // {String | null} 삭제된 메시지
    getDeletedText: () => null,

    // {Object} 사진
    Image: (hasImage ? {
      // {Boolean} 사진 여부
      hasImage: isPhoto,
      // {String} 사진 Url
      getImage: chat.photo.url
    } : null),

    send: (message) => channel.send(message)
  });
});


DBListener.on("delete", function (chat, channel) {
  Broadcast.send("Chat.message.deleted", {
    // {String} 삭제된 메시지
    text: chat.deletedChat.text,
    // {String} 삭제된 메시지의 작성자
    user: chat.deletedChat.user.name
  });
});


DBListener.on("join", function (chat, channel) {
  Broadcast.send("Chat.join" + channel.id, {
    // {String} 유저 고유 id
    id: chat.joinUsers[0].userId,
    // {String} 유저 이름
    name: chat.joinUsers[0].nickName
  });
});


DBListener.on("leave", function (chat, channel) {
  Broadcast.send("Chat.leave" + channel.id, {
    // {String} 유저 고유 id
    id: chat.leaveUsers[0].userId,
    // {String} 유저 이름
    name: chat.leaveUsers[0].nickName
  });
});

DBListener.on("kick", function (chat, channel) {
  Broadcast.send("Chat.kick" + channel.id, {
    kicker: {
      // {String} 유저 고유 id
      id: chat.kicker.id,
      // {String} 유저 이름
      name: chat.kicker.name
    },
    kickedUser: {
      // {String} 유저 고유 id
      id: chat.kickedUser().userId,
      // {String} 유저 이름
      name: chat.kickedUser().nickname
    }
  });
});





DBListener.start();

// 알림바 함수
function onNotification(sbn, rm) {
  DBListener.addChannel(sbn);
}

// 알림바 왔을 때 채널리스트 추가하기
bot.addListener(Event.NOTIFICATION_POSTED, onNotification);

// 컴파일 시 자동 종료
bot.addListener(Event.START_COMPILE, () => {
  DBListener.stop();
});

// 봇이 꺼지면 자동 종료
if (!bot.getPower()) DBListener.stop();