//PostManager

/////////////////
// 제작자: TeamCloud - 개발팀
// 코드 버전: release 0.0.1
// 본 코드는 TeamCloud의 코드 라이선스(CCL BY-SA 2.0)를 따라야합니다.
/////////////////


Broadcast.send("Default"); //Default.js의 변수 불러오기
Broadcast.send("Common"); //Common.js의 변수 불러오기
Broadcast.send("User"); //User.js의 변수 불러오기

let MasterRoom = "TeamCloud 개발방"; //관리방
let threadQueue = [];
let CompileList = ["Defalt.js", "User.js", "TCApi.js", "Common.js", "DataBase.js", "Object.js", "Main.js"];
let BackupList = Defaulf.fileList;

let funcSystemManager = (function () {
    let PostFile = Defaulf.fileList.Post;
    let ItemType = Defaulf.ItemType;
    let DBFileList = Defaulf.DBFileList;

    let DB = {};
    let PostList = []; // {name, items[type, count, name...], coin, message}

    let file = function (path) {
        return Defaulf.rootPath + path;
    }

    let read = function (path) {
        try {
            return JSON.parse(Defaulf.FS.read(file(path)));
        } catch (e) {
            Log.e(`read() error --- ${e.message}`);
        }
    };
    let write = function (path) {
        try {
            Defaulf.FS.write(file(path), JSON.stringify(obj));
        } catch (e) {
            Log.e(`write() error --- ${e.message}`);
        }
    };

    let LoadData = function () {
        DB.NicknameItem = read(DBFileList["NicknameItem"]);
        DB.StarsItem = read(DBFileList["StarsItem"]);
        DB.FoodItem = read(DBFileList["FoodItem"]);
        DB.TicketItem = read(DBFileList["TicketItem"]);
        DB.MandrelItem = read(DBFileList["MandrelItem"]);
        DB.MineralItem = read(DBFileList["MineralItem"]);
        PostList = read(PostFile);
    }();

    //우편 저장 방식 회의 후 다시 결정
    let Find = function (id) {
        let rtnArr = [];
        let tmpPost = null;

        for (let i = 0; i < PostList.length; i++) {
            tmpPost = PostList[i];

            if (tmpPost.name == id) Arr.push(tmpPost);
        }
        return rtnArr;
    }

    let FindItem = function (itemname) {
        let Obj = {
            type: "",
            index: "",
            name: ""
        };
        let item = null;

        for (let i = 0; i < DB.NicknameItem.length; i++) {
            item = DB.NicknameItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.NicknameItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }
        for (let i = 0; i < DB.StarsItem.length; i++) {
            item = DB.StarsItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.StarsItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }
        for (let i = 0; i < DB.FoodItem.length; i++) {
            item = DB.FoodItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.FoodItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }
        for (let i = 0; i < DB.TicketItem.length; i++) {
            item = DB.TicketItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.TicketItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }
        for (let i = 0; i < DB.MandrelItem.length; i++) {
            item = DB.MandrelItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.MandrelItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }
        for (let i = 0; i < DB.MineralItem.length; i++) {
            item = DB.MineralItem[i];
            if (item.name == itemname) {
                Obj.type = ItemType.MineralItem;
                Obj.index = item.index;
                Obj.name = itemname;
                return Obj;
            }
        }

        return Obj;
    }

    let Remove = function (token) {
        let result = false;
        let post = null;

        for (let i = 0; i < PostList.length; i++) {
            post = PostList[i];

            if (post.token == token) {
                PostList.splice(i, 1);
                result = true;
            }
        }
        return result
    }

    //우편 저장 방식 회의 후 다시 결정
    let RemoveByID = function (id) {
        result = false;
        let post = null;

        for (let i = PostList.length - 1; i >= 0; i--) {
            post = PostList[i];

            if (post.name == id) {
                PostList.splice(i, 1);
                result = true;
            }
        }

        return result;
    }

    return {
        getPostList: function () {
            return PostList;
        },
        //우편 저장 방식 회의 후 다시 결정
        getPostListByID: function (id) {
            Find(id);
        },
        ItemObj: function (itemname, count) {
            let itemObj = FindItem(itemname);
            itemObj.count = Number(count);
            return itemObj;
        },
        postMsg: function (id, itemList, coin, message) {
            let date = new Date();
            PostList.push({
                name: id,
                items: itemList,
                coin: coin,
                message: message,
                token: date.getTime()
            });
            write(PostFile, PostList);
        },
        removeMsg: function (token) {
            let rtn = Remove(token);
            write(PostFile, PostList);
            return rtn
        },
        //우편 저장 방식 회의 후 다시 결정
        removeMsgAll: function (id) {
            let rtn = RemoveByID(id);
            write(PostFile, PostList);
            return rtn
        }
    };
})();

Broadcast.register("SystemManager", () => {
    return eval(SystemManager = funcSystemManager());
});

let bot = BotManager.getCurrentBot();

function onMessage(msg) {

    if (msg.room != Admin) return;

    if (msg.content == Defaulf.Prefix) {
        switch (msg.content.replace(`${Defaulf.Prefix} `, "")[0]) {
            case "컴파일":
                startComplie();
                break;
            case "시작":
                if (!BotManager.getPower("Main")) {
                    BotManager.setPower("Main", true);
                    msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 시작할게요!`);
                } else {
                    msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템이 작동중이에요.`)
                }
                break;
            case "정지":
                if (BotManager.getPower("Main")) {
                    BotManager.setPower("Main", false);
                    msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 시스템을 정지할게요!`);
                } else {
                    msg.reply(`[ ${User.get(msg.author.name)["nickname"][0]} ] ${msg.author.name}님, 이미 시스템이 정지되어 있어요.`)
                }
                break;
        }
        if (msg.content.replace(`${Defaulf.Prefix} 공지`, "")) {
            let replaceMsg = msg.content.replace(`${Defaulf.Prefix} 공지`, "");

            let userList = funcPostManager.getAllUser();

            for (let i = 0; i < userList.length; i++) {
                bot.send(userList[i], `[ TeamCloud 공지 메시지 ]\n${replaceMsg}`);
            }
        }
    }
}
bot.addListener(Event.MESSAGE, onMessage);

function MakeDir(path) {
    let folder = new File(path);
    folder.mkdirs();
}

function sendId(id, msg) {
    threadQueue.push({
        id: id,
        msg: msg
    });

    if (!isProcessing) {
        isProcessing = true;
        for (let i = 0; threadQueue.length < i; i++) {
            Default.delay(1000);
            if (TCApi.canSend(threadQueue[0]["id"])) {
                TCApi.sendId(threadQueue[0]["id"], threadQueue[0]["msg"])
            }
            threadQueue.splice(0, 1);
        }
    }
}

function startComplie() {
    let succ = true;
    try {
        for (let i = 0; i < CompileList.length; ++i) {
            succ = BotManager.compile(CompileList[i], true);
            if (!succ) bot.send(Admin, `${CompileList[i]} Fail`);
        }
    } catch (e) {
        bot.send(Admin, e.message);
        succ = false;
    }

    bot.send(Admin, "컴파일 종료");
}