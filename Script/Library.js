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
      More: "\n200b".repeat(500),
      Time: function (type, time) {
        Time(type, time);
      },

      AdminRoom: "TeamCloud 개발방",
      CommandPrefix: "루미야",

      DumpTimeout: Time("m", 5),

      BettingLimit: 99999000,
      MaxRemittance: 999900,
      MaxLoan: 999900,
      BackupTime: Time("m", 20),
      FavorabilityMaxCount: 999,

      rootPath: "sdcard/TeamCloud/",
      FileList: {
        UserList: "RumiData/Users/UserList.json",
        AttenList: "RumiData/Games/AttenList.json",
        SetList: "RumiData/ETCs/SetList.json",
        StockList: "RumiData/Games/StockList.json",
        PostList: "RumiData/Users/UserList.json",
        RecordList: "RumiData/ETCs/RecordList.json"
      },

      DBFileList: {
        Message: "RumiData/DB/Message.json", //봇멘트
        BadgeItem: "RumiData/DB/BadgeItem.json", //배지
        MembershipItem: "RumiData/DB/Item.json", //멤버쉽
        FoodItem: "RumiData/DB/FoodItem.json", //음식
        TicketItem: "RumiData/DB/TicketItem.json", //교환권
        MandrelItem: "RumiData/DB/MandrelItem.json", //곡괭이
        MineralItem: "RumiData/DB/MineralItem.json", //광물
        LoanItem: "RumiData/DB/LoanItem.json", //대출
      },

      ItemType: {
        BadgeItem: "BadgeItem", //배지
        Membership: "Membership", //멤버쉽
        FoodItem: "FoodItem", //음식
        TicketItem: "TicketItem", //사용권
        MandrelItem: "MandrelItem", //곡괭이
        MineralItem: "MineralItem", //광석
        LoanItem: "LoanItem", //대출
      }
    }
  }

  module.exports = {
    Library: Library()
  }
})();