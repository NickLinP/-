function ForgetEmail (targetEmail, userName, factoryPassword){
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'def.space.system@gmail.com', //申請API的信箱
                pass: 'ppsfigmwuunxihsp', //申請服務時得到的16位密碼
            },
        });

        transporter.sendMail({
            from: '', //目前測試這裡不輸入也沒有影響
            to: targetEmail, //收信者信箱
            subject: '定義空間密碼重置信件', //信件主旨
            html: `${userName}您好，您申請了密碼重置，目前已將您的密碼變更為 : ${factoryPassword} 請使用新的密碼登入並且盡速變更`, //信件內容
        }).then(info => {
            console.log({ info });
        }).catch(console.error);
    }

module.exports = ForgetEmail;