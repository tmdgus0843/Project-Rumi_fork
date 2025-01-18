//TCApi.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 저작물로 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default.js의 변수 불러오기
Broadcast.send("userManager"); //User.js의 변수 불러오기


function funcTCApi() {
  return {
    canSend: (id) => {
      return Boolean(userManager.canRead(id))
    },
    sendId: (senId, tarId, msg) => {
      try {
        userManager.get(tarId)["Post"].push([senId, msg]);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
}

Broadcast.register("TCApi", () => {
  return eval(TCApi = funcTCApi())
});