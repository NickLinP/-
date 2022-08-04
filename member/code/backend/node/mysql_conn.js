
// 建立SERVER
var express = require('express');
var app = express();

// 允許跨域使用本服務
var cors = require("cors");
app.use(cors());

// 使用session
var expressSessoin = require("express-session");

var sessionMiddleware = expressSessoin({
    secret: "P@ssword",
    resave: true,
    saveUninitialized: true
});

// 將外部傳入的資料轉換為JSON格式
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 啟動Server
app.listen(3000);

// 建立MySQL連線
var mysql = require("mysql");
var conn = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "def_space"
})

// 如果連線成功err會是null
conn.connect(function (err) {
    console.log(err);
});

app.use(sessionMiddleware);

// 伺服器指令測試
app.get('/test', function (req, res) {
    console.log('收到get命令');
    res.send('get成功');
})
app.post('/test', function (req, res) {
    storage.setItem('foo', 'bar');
    console.log(storage.getItem('foo'));
    res.send('ok');
})


// google登入解析token
const jwt_decode = require('jwt-decode');
app.post('/login/token', function (req, res) {
    var token = req.body.token;
    var user_profile = jwt_decode(token);
    console.log(user_profile);
    console.log(user_profile.email);
    console.log(user_profile.given_name);
    console.log(user_profile.sub);

    var firstName = user_profile.family_name;
    var lastName = user_profile.given_name;
    var email = user_profile.email;
    var password = user_profile.sub;

    // 帳號重複確認flag
    var duplicatedAccount = false;
    conn.query("SELECT email, id FROM `member`;", [],
        function (err, rows) {
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i]);
                console.log(rows[i].email);
                if (email == rows[i].email) {
                    duplicatedAccount = true;
                    console.log('帳號重複');
                    var userProfile = {
                        id: rows[i].id
                    }
                    res.send(userProfile);
                    // 當找到重複的帳號後就中斷迴圈
                    break;
                }
            }

            // // 新增資料的程式，如果重複的flag觸發則需要return，否則會二次出發.send，會有錯誤訊息
            if (duplicatedAccount == true) {
                return;
                // 資料庫沒有該筆帳號的紀錄，因此會執行註冊並且回傳該id到網頁
            } else {
                conn.query(
                    "INSERT INTO `member` (`firstname`, `lastname`, `email`, `password`) VALUES (?, ?, ?, ?);",
                    [firstName, lastName, email, password],
                    function (err, rows) {
                        var userProfile = {
                            id: rows.insertId
                        }
                        res.send(userProfile);
                    }
                )
            }
        }
    )
})

// 登入功能
app.post('/login', function (req, res) {
    // 收到帳號密碼後到資料庫內進行比對
    var inputEmail = req.body.email;
    var inputPassword = req.body.password;
    var userPassword = '';
    var userId = 0;

    // 比對帳號 (email)
    conn.query("SELECT email , password , id FROM `member`;", [],
        function (err, rows) {
            // console.log(JSON.stringify(rows[0].id));
            // console.log(`第1組 ${JSON.stringify(rows[1])}`);
            var arrIdx = 0;
            var emailErr = false;
            var emailCheck = false;
            var passwordCheck = false;

            // idx是從0開始，因此必須+1才是真正的id
            rows.forEach(function (item, idx) {
                // 如果item的內容轉換成JSON格式，會被加上雙引號
                // 但輸入的帳號進來伺服器並不會有雙引號
                // 因此如果傳換了item成JSON會發生比較永遠錯誤
                var serverEmail = item.email;
                emailErr = false;
                if (inputEmail == serverEmail) {
                    console.log('帳號正確');
                    emailCheck = true;
                    // 紀錄是第幾筆資料正確，驗證密碼時候會用到
                    arrIdx = idx;
                    // 紀錄在資料庫的id是多少，發送token會用到
                    // userId = idx + 1;
                    userId = rows[idx].id;
                    // 紀錄符合的email密碼
                    userPassword = rows[idx].password;
                }
            })
            if (emailCheck == false) {
                console.log('後端輸出帳號錯誤');
                res.send('email_error');
                return;
            }

            // 比對密碼
            if (inputPassword == userPassword) {
                passwordCheck = true;
                console.log('密碼正確');
            } else {
                console.log('密碼錯誤');
                res.send('password_error');
                return;
            }
            // 如果密碼也正確，回傳登入確認以及該帳號的id到前端
            if (emailCheck == true & passwordCheck == true) {
                // // 特別注意，原先id型態在資料庫定義為int
                // // 但是使用.send無法傳送數值，因此必須轉換成字串
                var data = {
                    confirmLogin: 'ok',
                    id: userId.toString()
                };
                console.log(data);
                res.send(data);
            }
        }
    )
})


// 跳轉到會員頁面後將該會員資料從session的id讀取出來
app.post('/member/profile', function (req, res) {
    // 會員頁POST過來的資料是Objet的{ userId: '"2"' }
    // 特別注意到value是"2"，並非表象認為的單純字串2，而是帶雙引號的字串"2"
    // 透過JSON.parse轉換才可以得到單純的字串2，這樣子丟進.query執行才有效果
    // 可以把JSON.parser取消，並且觀察下面兩個console.log的結果仔細判斷
    var tokenId = JSON.parse(req.body.userId);
    // console.log(typeof (tokenId))
    // console.log(tokenId)
    conn.query("SELECT * FROM `member` WHERE id = ?;", [tokenId],
        function (err, rows) {
            // 必需要透過JSON.stringify讀取rows的內容，否則會出錯
            // rows必須要[0]，因為rows的內容是一個完整的陣列，如果不加上
            // [0]會訪問到的是最外層的陣列，非要讀取的單筆會員資料
            // 但如果是要訪問rows[0]內某一筆資料可以直接訪問，不需要再JSON轉換
            // 轉換後還會有""的出現，容易造成麻煩
            console.log(JSON.stringify(rows[0]));
            var userProfile = {
                id: rows[0].id,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                email: rows[0].email,
                phoneNumber: rows[0].phoneNumber,
                birthdate: rows[0].birthdate,
                country: rows[0].country,
                township: rows[0].township,
                address: rows[0].address
            }
            res.send(userProfile);
        })
})


// 會員註冊，必須優先比對email是否有重複，如果重複需拒絕註冊
app.post('/member/signUp', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var birthDate = req.body.birthDate;
    // 帳號重複確認flag
    var duplicatedAccount = false;
    conn.query("SELECT email FROM `member`;", [],
        function (err, rows) {
            // console.log(JSON.stringify(rows));
            console.log(rows);
            console.log(rows.length);
            for (var i = 0; i < rows.length; i++) {
                console.log(rows[i]);
                console.log(rows[i].email);
                if (email == rows[i].email) {
                    duplicatedAccount = true;
                    console.log('帳號重複');
                    res.send('duplicated_account');
                    // 當找到重複的帳號後就中斷迴圈
                    break;
                }
            }

            // 新增資料的程式，如果重複的flag觸發則需要return，否則會二次出發.send，會有錯誤訊息
            if (duplicatedAccount == true) {
                return;
                // 將資料寫入資料庫，完成註冊會員
            } else {
                conn.query(
                    "INSERT INTO `member` (`firstname`, `lastname`, `email`, `password`, `birthdate`) VALUES (?, ?, ?, ?, ?);",
                    [firstName, lastName, email, password, birthDate],
                    function (err, rows) {
                        // 發出註冊成功到網頁
                        res.send('signUp_success');
                    }
                )
            }
        }
    )
})


// 會員資料修改
// UPDATE `member` SET `firstname` = '許', `lastname` = '天富', `email` = 'rich@gmail.com', `password` = 'aaa123456', `birthdate` = '2015-06-11', `country` = '10', `township` = '11', `address` = '南區' WHERE `member`.`id` = 11;
app.put('/member/dataUpdate', function (req, res) {
    var userId = JSON.parse(req.body.userId);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    // password目前在表單上沒有，暫時不使用
    var password = req.body.password;
    var birthDate = req.body.birthDate;
    var country = req.body.country;
    var township = req.body.township;
    var address = req.body.address;
    conn.query("UPDATE `member` SET `firstname` = ?, `lastname` = ?, `email` = ? , `phoneNumber` = ? , `birthdate` = ? , `country` = ?, `township` = ?, `address` = ? WHERE `member`.`id` = ?;",
        [firstName, lastName, email, phoneNumber, birthDate, country, township, address, userId],
        function (err, rows) {
            console.log('修改成功');
        }
    )
})



// 咖啡廳訂位紀錄讀取
app.post('/member/coffee', function (req, res) {
    var userId = JSON.parse(req.body.userId);
    // 透過id尋找該會員的email
    conn.query("SELECT * FROM `member` WHERE id = ?;",
        [userId],
        function (err, rows) {
            var email = rows[0].email;
            // 透過email列出所有紀錄
            conn.query("SELECT * FROM `coffee_reserve` WHERE email = ? ORDER BY reserveDate DESC;",
                [email],
                function (err, rows) {
                    res.send(rows);
                })
        })
})


// 場地租借紀錄讀取
app.post('/member/rent', function (req, res) {
    var userId = JSON.parse(req.body.userId);
    conn.query("SELECT * FROM `member` WHERE id = ?;",
        [userId],
        function (err, rows) {
            var email = rows[0].email;
            console.log(email);
            // 透過email列出所有紀錄
            conn.query("SELECT * FROM `rent_site` WHERE email = ? ORDER BY reserveDate;",
                [email],
                function (err, rows) {
                    res.send(rows);
                })
        })

})


// 訂單紀錄
app.post('/member/order', function (req, res) {
    var userId = JSON.parse(req.body.userId);
    conn.query("SELECT * FROM `member` WHERE id = ?;",
        [userId],
        function (err, rows) {
            var email = rows[0].email;
            // 透過email列出所有紀錄
            conn.query("SELECT * FROM `order_history` WHERE email = ? ORDER BY orderDate;",
                [email],
                function (err, rows) {
                    res.send(rows);
                }
            )
        }
    )
})

// 訂單記錄詳細資料
app.post('/member/order/detail', function (req, res) {
    var orderNumber = req.body.orderNumber;
    conn.query("SELECT * FROM `order_detail` WHERE `orderNumber` = ?;",
        [orderNumber],
        function (err, rows) {
            res.send(rows);
        }
    )
})