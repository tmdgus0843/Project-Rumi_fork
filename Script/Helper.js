//Helper.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////

Broadcast.send("Default", ""); //Default.js의 변수 불러오기
function funcDirections(room, msg) {
  if (msg == Default.prefix + "명령어") {
    return [`[명령어 목록]`,
      `\t정보: https://www.team-cloud.kro.kr/blog/rumi/rumi-guide/info`,
      `\t방 관리: https://www.team-cloud.kro.kr/blog/rumi/rumi-guide/room_manage`,
      `\t게임: https://www.team-cloud.kro.kr/blog/rumi/rumi-guide/game`,
      `\t검색: https://www.team-cloud.kro.kr/blog/rumi/rumi-guide/search`,
      `\t기타: https://www.team-cloud.kro.kr/blog/rumi/rumi-guide/etc`
    ].join("\n")
  }
}

Broadcast.register("Helper", () => {
  return eval(Helper = funcDirections())
});