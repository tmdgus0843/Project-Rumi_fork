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

(function () {
  function Message(author) {
    let message = Common.read(Library.FolderList["MessageFolder"])[author];

    return {
      //getId: message.id, // {String} 메시지의 고유 id
      getAuthor: message.user, // {Object} 메시지 작성자
      //getMentions: message.mentions, // {Array} 메시지 맨션 멤버들
      //getRead: message.readMembers; // {Array} 메시지를 읽은 멤버들
      //getTime: message.sendTime; // {Date} 메시지 전송 시간
      getMessage: message.text, // {String} 메시지 내용

      getNext: message.nextChat, // {String} 보낸 메시지의 다음 메시지
      getPrev: message.prevChat, // {String} 보낸 메시지의 이전 메시지
      isDeleted: message.isDeleted, // {Boolean} 삭제 여부
      getDeletedMessage: this.isDeleted ? message.deletedChat : null, // {String} 삭제된 메시지
      isImage: message.isPhoto, // {Boolean} 사진 여부
      getImage: this.isImage ? message.photo : null, // {String} 사진Url
      isMultiImage: message.isMultiPhoto, // {Boolean} 다중 사진 여부
      getMultiImage: this.isMultiImage ? message.multiphoto : null, // {String} 다중 사진Url

      isReply: message.isReply, // {Boolean} 답장 여부
      reply: function () {
        if (!this.isReply) return null;
        return {
          //getId: message.reply.id, // {String} 메시지의 고유 id
          getAuthor: message.reply.user, // {Object} 메시지 작성자
          //getMentions: message.reply.mentions, // {Array} 메시지 맨션 멤버들
          //getRead: message.reply.readMembers, // {Array} 메시지를 읽은 멤버들
          //getTime: message.reply.sendTime, // {Date} 메시지 전송 시간
          getMessage: message.reply.text, // {String} 메시지 내용
          getOriginalMessage: message.reply.originalChat, // {String} 원본 메시지 내용
          nextMessage: function () {
            return {
              getId: message.reply.nextChat.id, // {String} 메시지의 고유 id
              getAuthor: message.reply.nextChat.user, // {Object} 메시지 작성자
              getMentions: message.reply.nextChat.mentions, // {Array} 메시지 맨션 멤버들
              getRead: message.reply.nextChat.readMembers, // {Array} 메시지를 읽은 멤버들
              getTime: message.reply.nextChat.sendTime, // {Date} 메시지 전송 시간
              getMessage: message.reply.nextChat.text // {String} 메시지 내용
            };
          },
          prevMessage: function () {
            return {
              getId: message.reply.nextChat.id, // {String} 메시지의 고유 id
              getAuthor: message.reply.nextChat.user, // {Object} 메시지 작성자
              getMentions: message.reply.nextChat.mentions, // {Array} 메시지 맨션 멤버들
              getRead: message.reply.nextChat.readMembers, // {Array} 메시지를 읽은 멤버들
              getTime: message.reply.nextChat.sendTime, // {Date} 메시지 전송 시간
              getMessage: message.reply.nextChat.text // {String} 메시지 내용
            };
          },
          isImage: message.reply.isPhoto, // {Boolean} 사진 여부
          getImage: function () {
            if (message.reply.isPhoto && message.isReply) {
              return {
                code: 200, // {Number} 상태 코드
                message: "Success", // {String} 상태 메시지
                url: message.reply.photo.url, // {String} 사진Url
                mineType: message.reply.photo.mineType, // {String} 사진 타입
              }
            } else if (message.reply.isPhoto && !message.isReply) {
              return {
                code: 400,
                message: "답장이 아닙니다.",
                url: null,
                mineType: null
              }
            } else {
              return {
                code: 404,
                message: "사진이 없거나 불러올 수 없습니다.",
                url: null,
                mineType: null
              }
            }
          },
          isMultiImage: message.reply.isMultiPhoto, // {Boolean} 다중 사진 여부
          getMultiImage: function () {
            if (message.reply.isMultiPhoto && message.isReply) {
              return {
                code: 200, // {Number} 상태 코드
                message: "Success", // {String} 상태 메시지
                url: message.reply.multiPhoto.url, // {Array} 사진Url
                mineType: message.reply.multiPhoto.mineType, // {Array} 사진 타입
              }
            } else if (message.reply.isMultiPhoto && !message.isReply) {
              return {
                code: 400,
                message: "답장이 아닙니다.",
                url: null,
                mineType: null
              }
            } else {
              return {
                code: 404,
                message: "사진이 없거나 불러올 수 없습니다.",
                url: null,
                mineType: null
              }
            }
          }
        }
      }
    }
  }

  module.exports = {
    Message: Message()
  };
})();