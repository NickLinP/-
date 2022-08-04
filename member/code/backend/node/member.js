// 建立SERVER
var express = require('express');
var app = express();

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
app.post('/member/dataUpdate', function (req, res) {
    var userId = JSON.parse(req.body.userId);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    // password目前在表單上沒有，暫時不使用
    var password = req.body.password;
    var birthDate = req.body.birthDate;
    var country = req.body.country;
    var township = req.body.township;
    var address = req.body.address;

    conn.query("UPDATE `member` SET `firstname` = ?, `lastname` = ?, `email` = ? , `birthdate` = ? , `country` = ?, `township` = ?, `address` = ? WHERE `member`.`id` = ?;",
        [firstName, lastName, email, birthDate, country, township, address, userId],
        function (err, rows) {
            console.log('修改成功');
        }
    )
})