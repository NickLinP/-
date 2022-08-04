$(document).ready(function () {
    var userId = sessionStorage.getItem('userId');
    var dataToServer = { userId: userId };
    $.ajax({
        type: "post",
        url: "http://localhost:3000/member/profile",
        data: JSON.stringify(dataToServer),
        contentType: "application/json",
        success: function (e) {
            console.log('會員資料接收成功');
            $('#nameNav').text(e.firstname + e.lastname);
            $('#emailNav').text(e.email);
        }
    })
});