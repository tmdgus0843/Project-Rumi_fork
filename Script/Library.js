/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

/////////////////
// (string) msg.content: 메시지의 내용
// (string) msg.room: 메시지를 받은 방 이름
// (User) msg.author: 메시지 전송자
// (string) msg.author.name: 메시지 전송자 이름
// (Image) msg.author.avatar: 메시지 전송자 프로필 사진
// (string) msg.author.avatar.getBase64()
// (string | null) msg.author.userHash: 사용자의 고유 id
// (boolean) msg.isGroupChat: 단체/오픈채팅 여부
// (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
// (string) msg.packageName: 메시지를 받은 메신저의 패키지명
// (void) msg.reply(string): 답장하기
// (boolean) msg.isMention: 메세지 맨션 포함 여부
// (bigint) msg.logId: 각 메세지의 고유 id
// (bigint) msg.channelId: 각 방의 고유 id
/////////////////

/**
 * = [ DevLog ] =
 * === [ release 0.0.1 ] ===
 * 1차 검토 완료
 */


(function () {
  function Library() {
    let Time = function (type, time) {
      switch (type) {
        case "h":
          return (time * 60 * 60 * 1000)
        case "m":
          return (time * 60 * 1000)
        case "s":
          return (time * 1000)
      }
    }
    return {
      More: "\u200b".repeat(500), //더 보기 변수
      /**
       * 
       * @param {String} type ms를 변환할 단위 [h, m, s]
       * @param {Number} time ms를 변환할 시간
       * @returns {Number} 변환된 시간
       */
      Time: function (type, time) {
        Time(type, time);
      }, //ms를 각 타입에 맞게 변환하는 함수

      AdminRoom: "TeamCloud 개발방", //관리자방
      CommandPrefix: "루미야", //접두사

      DumpTimeout: Time("m", 5), //덤프 타임아웃

      BettingLimit: 99999000, //배팅 제한                           //적용됨
      MaxRemittance: 999900, //송금 제한                            //적용됨
      MaxLoan: 999900, //대출 제한                                  //적용됨
      BackupTime: Time("m", 20), //백업 주기                        //적용됨
      FavorabilityMaxCount: [-999, 999], //호감도 최대치            //적용됨
      BankTime: [7, 22], //은행 시간                                //적용됨
      numberGameLength: 5, //숫자 게임 길이                         //적용됨
      numberGameLimit: 10, //숫자 게임 제한                         //적용됨

      rootPath: "sdcard/TeamCloud/Project-Rumi/", //루트 경로
      FileList: { //파일 리스트
        UserList: "Data/Users/UserList.json",
        AttenList: "Data/Games/AttenList.json",
        StockList: "Data/Games/StockList.json",
        PostList: "Data/Users/UserList.json",
        SetList: "Data/ETCs/SetList.json",
        UpdateList: "Data/ETCs/UpdateList.json",
        MagicAnswerList: "Data/ETCs/MagicAnswerList.json",

        KeyList: "Data/ETCs/KeyList.json",
      },

      FolderList: {
        RecordFolder: "Records/",
        BackupFolder: "Backup/",
        MusicAlbumFolder: "Data/ETCs/MusicAlbum/",

        MessageFolder: "Messages/",
        RoomFolder: "Rooms/",
        AuthorFolder: "Authors/",
      },

      DBFileList: {
        Message: "Data/DB/Message.json", //봇멘트
        BadgeItem: "Data/DB/BadgeItem.json", //배지
        MembershipItem: "Data/DB/MembershipItem.json", //멤버쉽
        FoodItem: "Data/DB/FoodItem.json", //음식
        TicketItem: "Data/DB/TicketItem.json", //교환권
        LoanItem: "Data/DB/LoanItem.json", //대출
      },

      ItemType: {
        BadgeItem: "BadgeItem", //배지
        Membership: "Membership", //멤버쉽
        FoodItem: "FoodItem", //음식
        TicketItem: "TicketItem", //사용권
        LoanItem: "LoanItem", //대출
      }
    }
  }

  module.exports = {
    Library: Library()
  }
})();