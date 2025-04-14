const DB = require("DBManager").DBManager;

// 여기에 들어가는 인자는 https://nyangbotlab.github.io/dbdoc/v2/interfaces/types_manager.InstanceType.html 참고
let DBListener = DB.getInstance();

let More = "\u200b".repeat(500);
let FS = FileStream;

let adminRoom = "TeamCloud 개발방";
let prefix = "/";

const bot = BotManager.getCurrentBot();

DBListener.on("message", (chat, channel) => {
  if (!FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + channel.name + ".json")) {
    FS.write("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + channel.name + ".json", JSON.stringify({}, null, 2));
  }
  if (!FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Rooms/" + channel.name + ".json")) {
    FS.write("sdcard/TeamCloud/Project-Rumi/" + "Rooms/" + channel.name + ".json", JSON.stringify({}, null, 2));
  }
  if (!FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Authors/" + channel.name + ".json")) {
    FS.write("sdcard/TeamCloud/Project-Rumi/" + "Authors/" + channel.name + ".json", JSON.stringify({}, null, 2));
  }
  let DBFile = {
    Message: JSON.parse(FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + channel.name + ".json"))[chat.user.id],
    Room: JSON.parse(FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Rooms/" + channel.name + ".json"))[chat.user.id],
    Author: JSON.parse(FileStream.read("sdcard/TeamCloud/Project-Rumi/" + "Authors/" + channel.name + ".json"))[chat.user.id]
  };

  try {
    //채팅 유저 정보
    let user = chat.user;
    //채팅 내용
    let message = chat.text;


    //DB정보 저장
    DBFile.Message = {
      id: chat.id,
      mentions: chat.mentions,
      readMembers: chat.readMembers,
      sendTime: chat.sendTime,
      text: chat.text,
      nextChat: chat.getNextChat() ? chat.getNextChat().text : null,
      prevChat: chat.getPrevChat() ? chat.getPrevChat().text : null,
      isDeleted: chat.isDeleted,
      deletedChat: null,
      isImage: chat.isPhoto,
      photo: this.isImage ? chat.photo : null,
      isMultiPhoto: chat.isMultiPhoto,
      multiPhoto: this.isMultiPhoto ? chat.multiPhoto : null,
      isReply: chat.isReply,
      reply: {}
    }
    DBFile.Message.isReply ? DBFile.Message.reply = {
      id: chat.source.id,
      user: chat.source.user,
      mentions: chat.source.mentions,
      readMembers: chat.source.readMembers,
      sendTime: chat.source.sendTime,
      text: chat.source.text,
      originalChat: null,
      nextChat: chat.source.getNextChat() !== undefined ? {
        id: chat.source.getNextChat().id,
        user: chat.source.getNextChat().user,
        mentions: chat.source.getNextChat().mentions,
        readMembers: chat.source.getNextChat().readMembers,
        sendTime: chat.source.getNextChat().sendTime,
        text: chat.source.getNextChat().text
      } : null,
      prevChat: chat.source.getPrevChat() ? {
        id: chat.source.getPrevChat().id,
        user: chat.source.getPrevChat().user,
        mentions: chat.source.getPrevChat().mentions,
        readMembers: chat.source.getPrevChat().readMembers,
        sendTime: chat.source.getPrevChat().sendTime,
        text: chat.source.getPrevChat().text
      } : null,
      isPhoto: chat.source.isPhoto,
      photo: this.isPhoto ? chat.source.photo : null,
      isMultiPhoto: chat.source.isMultiPhoto,
      multiPhoto: this.isMultiPhoto ? chat.source.multiPhoto : null
    } : DBFile.Message.reply = null;
    FileStream.write("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + room + ".json", JSON.stringify(DBFile.Message, null, 2));




    //테스트
    if (message === prefix + "test") {
      Log.i("테스트 성공!");
      channel.send(user.name + "님 안녕하세요!");
    }


    if (message.startsWith(prefix + "eval")) {
      try {
        channel.send(eval(message.replace(prefix + "eval", "")));
      } catch (e) {
        channel.send(JSON.stringify(e, null, 2));
      }
    }

    //답장의 원본 원본 꼬리물기로 얻기
    if (chat.isReply() && message === prefix + "reply") {
      let tempChat = chat.source;
      while (tempChat.isReply()) {
        tempChat = tempChat.source;
      }
      channel.send(tempChat.user.name + "님이 " + tempChat.text + " 라고 말했습니다.");
      DBFile.Message.reply.originalChat = tempChat.text;
      FileStream.write("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + channel.name + ".json", JSON.stringify(DBFile.Message, null, 4));
    }

    //이전 채팅 구하기
    if (chat.isReply() && message === prefix + "prev") {
      channel.send(chat.source.getPrevChat().text);
    }
    //다음 채팅 구하기
    if (chat.isReply() && message === prefix + "next") {
      channel.send(chat.source.getNextChat().text);
    }

    if (chat.isPhoto()) {
      channel.send("사진을 보냈습니다.");
      channel.send(JSON.stringify(chat.photo, null, 4));
    }

  } catch (e) {
    Log.error(JSON.stringify(e, null, 2));
  }
});

//메시지 삭제
DBListener.on("delete", function (chat, channel) {
  let message = chat.deletedChat.text;
  channel.send(message + " 메시지를 삭제되었습니다.");
  DBFile.Message.deletedChat = chat.deletedChat.text;
  FileStream.write("sdcard/TeamCloud/Project-Rumi/" + "Messages/" + channel.name + ".json", JSON.stringify(DBFile.Message, null, 4));
});

/*
//오픈채팅방 입장
DBListener.on("join", function (user, channel) {
  let user = chat.joinUsers[0];
  channel.send(user.nickName + "님이 입장하셨습니다.");
});

//오픈채팅방 퇴장
DBListener.on("leave", function (user, channel) {
  let user = chat.leaveUsers;
  if (!chat.isKicked()) channel.send(user.nickName + "님이 퇴장하셨습니다.");
});

//오픈채팅방 강퇴
DBListener.on("kick", function (user, channel) {
  let user = chat.kickedUser;
  let kicker = chat.kickedBy;
  channel.send(kicker.name + "님이 " + user.nickName + "님을 강퇴하셨습니다.");
});

//권한 변경
DBListener.on("member_type_change", function (chat, channel) {
  if (chat.isDemote()) channel.send(chat.demoteUser.nickName + "님이 부방장에서 내려왔습니다.");
  if (chat.isPromote()) channel.send(chat.promoteUser.nickName + "님이 부방장이 되었습니다.");
  if (chat.isHandover()) channel.send(chat.newHost.nickName + "님이 방장이 되었습니다.");
});

//프로필 변경
DBListener.on("open_profile_change", function (beforeUser, afterUser, channel) {
  channel.send(beforeUser.name + "님의 프로필이 " + afterUser.name + "으로 변경되었습니다.");
});*/


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