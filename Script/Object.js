//Object.js

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default.js의 변수 불러오기
Broadcast.send("Common"); //Common.js의 변수 불러오기
Broadcast.send("DataBase"); //DataBase.js의 변수 불러오기

function clsUserOption(info) {
    let userName = info.name,
        eatOpt = info.eatopt;

    return {
        name: userName,
        getJson: function () {
            return {
                name: userName,
                eatopt: eatOpt
            }
        },
        setEatOpt: function (type, itemName, fullness) {
            eatOpt[type][itemName] = fullness
        },
        getEatOpt: function () {
            return eatOpt;
        }
    }
}

function clsUserRecord(info) {
    let userName = info.name,
        action = info.action, //{eating, sleeping}
        maxCoin = info.maxcoin;

    return {
        EATING: "eatfood",
        SLEEPING: "sleep",
        name: userName,
        getJson: function () {
            return {
                name: userName,
                action: action,
                maxCoin: maxCoin
            };
        },
        addMaxCoin: function (cnt) {
            maxCoin += cnt;
        },
        getMaxCoin: function () {
            return maxCoin;
        },
        addAction: function (act) {
            action[act]++;
        },
        getAction: function (act) {
            return action[act]
        }
    }
}

function clsCoinInfo(info) {
    let name = info.name,
        coin = info.coin;

    return {
        name: name,
        getJson: function () {
            return {
                name: name,
                coin: coin
            }
        },
        addCoin: function (_coin) {
            let remain = coin + _coin;
            if (remain >= 0) {
                coin = remain;
                return true;
            }
            return false;
        },
        getCoin: function () {
            return coin;
        }
    }
}

function clsAttendance(info) {
    let day = info.day,
        month = info.month,
        year = info.year,
        pushList = info.pushlist;

    return {
        day: day,
        month: month,
        year: year,
        getJson: function () {
            return {
                day: day,
                month: month,
                year: year,
                pushList: pushList
            };
        },
        Push: function (id) {
            pushList.push(id);
        },
        isUser: function(id) {
            return (pushList.includes(id))
        }
    }
}

Broadcast.register("clsUserOption", () => {
    return eval(userOpt = clsUserOption())
});
Broadcast.register("clsCoinInfo", () => {
    return eval(coinOpt = clsCoinInfo())
});
Broadcast.register("clsAttendance", () => {
    return eval(attendanceOpt = clsAttendance())
});