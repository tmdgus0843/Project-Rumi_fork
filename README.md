**Project-Rumi**
======
**모두를 행복하게 하는 카톡 봇 '루미'**
------



## 1. 개요
- 프로젝트 이름: Project-Rumi
- 개발 언어: Rhino JavaScript
- 멤버: 팀클라우드 디벨로퍼(Yellu, hello)



## 2. 팀원(데브로퍼) 소개
| ![Yellu](./yellu.png) | ![hello](./hello.png) |
| ---------------------- | ---------------------- |
| [Yellu](https://github.com/id) | [hello](https://github.com/id) |
| 팀클라우드 대표 옐루예요! 잘 부탁드려요! | 아무튼 하는것이 많은 팀클라우드 소속 개발자 입니다. |



## 3. 프로젝트 설명
Notion: [프로젝트 상세 링크](https://)
본 프로젝트는 팀클라우드의 카카오톡 봇 'Project-Rumi'를 개발하는 프로젝트입니다.



## 4. 기술 스택

### Integrated Development Environment(IDE)
![VS Code](https://code.visualstudio.com/)

### Development
![JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)

### Project Management
[![GitHub Issues](./GitHub%20Issues.png)](https://github.com/TeamCloud-Office/Project-Rumi/issues) [![GitHub Pull Requests](./GitHub%20Pull%20Request.png)](https://github.com/TeamCloud-Office/Project-Rumi/pulls)




## 5. 디렉토리 구조

```
📂 Project-Rumi
├── 📂 Script
│ ├── 📄 Library.js           # 기본 변수 파일
│ ├── 📄 Common.js            # 기본 함수 파일
│ ├── 📄 DataBase.js          # DB관련 파일
│ ├── 📄 Object.js            # 유저 함수 파일
│ ├── 📄 RecordManager.js     # 기록 담당 파일
│ ├── 📄 SystemManager.js     # 시스템 담당 파일
│ ├── 📄 System.js            # 시스템 관리 파일
│ ├── 📄 UserManager.js       # 유저 담당 파일
│ └── 📄 Main.js              # 메인 파일
│
├── 📂 RDB                    ## Rumi DataBase
│ ├── 📄
│ └── 📄
└── 🖼️ Rumi_ProfileImage.png          # 루미 메인 일러스트(2025년 기준)

📂 Project-Rumi(Rooting)
└── 🖼️ Rumi_ProfileImage.png          # 루미 메인 일러스트(2025년 기준)
```



## 6. 주요 코드

### Libray
기본적인 변수들을 담고있어요.





## 7. 개발하기

### 7-1 개발 전

**1. 프로그램 설치**
* [Git 설치하기](https://git-scm.com/downloads)
* [GitHub Desktop 설치하기](https://central.github.com/deployments/desktop/desktop/latest/win32)

**2. Repository Fork하기**
* [Project-Rumi(GitHub)](https://github.com/TeamCloud-Office/Project-Rumi)에서 우측 상단의 `Fork`클릭하여 사본 만들기
* **주의: 사본 만들때 Project-Rumi_fork로 이름 정하기**

**3. GItHub Desktop 로그인하기**
* File > Options...
* GitHub 계정으로 로그인하기

**4. Fork한 repository 가져오기**
* `File` > `Clone repository` > `URL` > `https://github.com/(자신의_GitHub_Name)/Project-Rumi_fork.git` | `Local
path(Repository가
복제될 폴더)` > `Clone`
* `To contribute to the parent project` > `Continue`

**5. Local path에서 작업할 파일 편집하기.**



### 7-2. 개발 후
1. GitHub Desktop에 개발한 파일 확인하기.
2. 개발한 파일 밑의 Summary에 버전을, Description에 개발 내용 작성하기.
3. Commit to **main** 클릭하기.
---잘못 작성하였을 경우 Un do 클릭하기.---
4. 우측 상단에 Pull origin 클릭하기.
5. 전에 만든 사본에 들어가 `Contribute`클릭하여 `Pull Requests(PR)`보내기
6. PR 본문(Description)에 [변동사항](#7-3-commit-메시지-형식) 작성하고 `Create pull requests`클릭하기
6. PR을 보냈다면 카카오워크 `TEAMCLOUD`방에 알리기


#### 7-3. Commit 메시지 형식
| **타입** | **설명** | **예시** |
| ------ | ------ | ------ |
| plus | 새로운 기능 추가 | [plus] - 출석 기능 추가 |
| rename | 변수 이름 변경 또는 파일 이름 변경 | [rename] - `a`스크립트의 `ABC` 변수 이름을 `CBA`로 변경 |
| fix | 버그 수정 | [fix] - `a`스크립트의 오탈자 수정 |
| refactor | 코드 리팩토링 | [refactor] - `a`스크립트의 불필요한 함수 제거 및 코드 정리 |
| style | 코드의 스타일 변경 | [style] - `a`스크립트의 들여쓰기 및 주석 수정 |
| test | 테스트 코드 추가 | [test] - 로그인 테스트 기능 추가 |
| etc | 기타 | [etc] - 코드 사본 추가 |




## 8. 개발시 유의해야 할 점

### 8-1. 코드 스타일
```javascript
// 주석을 달때에는 주석을 달고자 하는 코드의 위에 달아주세요.
// 주석을 달때에는 한 칸 띄고 작성해주세요.

// 들여쓰기는 2칸으로 해주세요.

function onMessage(msg) {
  // 여는 블록을 if와 같은 행에 배치해주세요.
  if (msg.content.startsWith("에베벱")) {

    // 한줄코드를 지향해요.
    // 만약 한줄코드로 작성할 수 있다면 한줄코드로 작성해주세요.
    // 세미콜론을 꼭 달아주세요.
    if (msg.content[1] == "에베벱") return msg.reply("반가워요");
  }

  // 새로운 코드 작성시 한 줄 띄우고 작성해주세요.
  if (msg.content === "안녕하세요") return msg.reply("그래요");

  // 변수 선언시 자료형을 let으로 선언해주세요,
  // 여러 단어를 연달아 사용할 경우 각 단어의 첫 글자를 대문자로 적되, 맨 앞에 오는 글자는 소문자로 표기해주세요.
  // 할당 연산자 = 사이에 공백을 삽입해주세요.

  let camelCase = "T_T";

  // for문 작성시 선언할때 자료형을 작성해주세요.
  // 비교 연산자 <=> 사이에 공백을 삽입해주세요.
  for (let i = 0; i < arr.length; i++) {
    // Code...
  }
  //변수의 이름이 복수형일 경우 s, es가 아닌 List를 붙여주세요.
  let userList = [];

  // 매개변수 사이에 공백을 삽입해주세요.
  ABC(1, 3);

  //만약 문자열과 변수를 함께 사용하려면 템플릿리터널을 사용해주세요.
  msg.reply(`반가워요, ${msg.author.name}님!`);
}
// 함수는 밑에 작성해주세요.
// 매개변수 사이에 공백을 삽입해주세요.
function ABC(x, y) {
  //Code...
}
```

### 8-2.