//Helper.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default", ""); //Default.js의 변수 불러오기
function funcDirections(room, msg) {
  switch (msg) {
    case "명령어":
      return [`[명령어 목록]`,
        ` └ 루미야 정보\t(루미의 정보 안내)`,
        ` └ 루미야 방관리\t(방의 관리 기능)`,
        ` └ 루미야 게임\t(게임 기능)`,
        ` └ 루미야 검색\t(검색 기능)`,
        ` └ 루미야 기타\t(내정보, 멘션감지 등)`
      ].join("\n");
    case "관리":
      return [].join("\n");
  }
}

Broadcast.register("Helper", () => {
  return eval(Helper = funcDirections())
});