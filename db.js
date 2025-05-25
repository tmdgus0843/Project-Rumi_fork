/**
 * 해당 스크립트는 DBManager와 RhinoKV를 사용하였습니다.
 */


const DB = require("DBManager").DBManager;
let DBListener = DB.getInstance();

const bot = BotManager.getCurrentBot();

const FilePath = "sdcard/TeamCloud/chat_database.db";

const kv = new(require("RhinoKV"))();



DBListener.on("message", (chat, channel) => {
  kv.open(FilePath);

  kv.setCollection("index");
  let roomId = kv.get("rooms") || [];
  if (!roomId.includes(channel.id)) {
    roomId.push(channel.id);
    kv.put("rooms", roomId);
  }

  kv.setCollection(channel.id);

  let mentionList = chat.mentions.map(mention => mention.name);

  let readMemberList = chat.readMembers.map(readMember => readMember.name);

  kv.put("message", {
    // {String} 메시지의 고유 id
    id: chat.id,

    // {String} 메시지 내용
    text: chat.text,

    // {Array} 멘션 멤버들
    mentions: mentionList,

    // {Array} 메시지를 읽은 멤버들
    readMembers: readMemberList,

    // {Date} 메시지 전송 시간
    sendTime: chat.sendTime,

    // {Object} 메시지 답장
    reply: (chat.isReply() ? {
      // {String} 이전 메시지
      PrevChat: {
        text: chat.source.getPrevChat().text,
        user: chat.source.getPrevChat().user.name
      },
      // {String} 다음 메시지
      NextChat: {
        text: chat.source.getNextChat().text,
        user: chat.source.getNextChat().user.name
      }
    } : null),

    // {Object} 사진
    Image: (chat.isPhoto() ? {
      // {Boolean} 사진 여부
      type: chat.photo.mt,
      // {String} 사진 Url
      url: chat.photo.url
    } : null)
  });

  kv.put("channel", {
    // {String} 채널 이름
    name: channel.name,

    // {String} 채널 id
    id: channel.id,

    // {String} 방장 이름
    host: channel.host.name,

    // {Number} 방 인원
    members: channel.members.length,

    // {String} 채널 링크
    url: channel.openLink.url,

    // {String} 채널 이미지
    image: channel.openLink.iamge_url

  });

  kv.put("user", {
    // {String} 사용자 id
    id: chat.user.id,

    // {String} 사용자 이름
    name: chat.user.name,

    // {String} 사용자 프로필 사진 Url
    profile: chat.user.profileImage.profile_url,

    // {String} 사용자 프로필 사진 Url
    memberType: chat.user.memberType,

    // {Boolean} 사용자 관리자 여부
    isManager: chat.user.isManager()
  });


  kv.close();

});


DBListener.on("delete", function (chat, channel) {
  kv.open(FilePath);

  kv.setCollection(channel.id);

  kv.put("delete", {
    // {String} 메시지 내용
    text: chat.deletedChat.text,

    // {String} 메시지 작성자
    user: chat.deletedChat.user.name
  });

  kv.close();
});


DBListener.on("join", function (chat, channel) {
  kv.open(FilePath);

  kv.setCollection(channel.id);

  kv.put("join", {
    // {String} 메시지의 고유 id
    getId: chat.joinUsers[0].id,

    // {String} 메시지 내용
    getName: chat.joinUsers[0].nickname
  });

  kv.close();
});


DBListener.on("leave", function (chat, channel) {
  kv.open(FilePath);

  kv.setCollection(channel.id);

  kv.put("leave", {
    // {String} 유저 고유 id
    id: chat.leaveUsers[0].userId,
  
    // {String} 유저 이름
    name: chat.leaveUsers[0].nickname
  });

  kv.close()
});

DBListener.on("kick", function (chat, channel) {
  kv.open(FilePath);

  kv.setCollection(channel.id);
  
  kv.put("kick", {
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

  kv.close();
});


DBListener.start()

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