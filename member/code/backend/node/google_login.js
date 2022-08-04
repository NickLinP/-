// google登入解析token
const jwt_decode = require('jwt-decode');
app.post('/login/token', function (req, res) {
    var token = req.body.token;
    var user_profile = jwt_decode(token);
    console.log(user_profile);
    console.log(user_profile.email);
    res.send(user_profile.given_name);
})