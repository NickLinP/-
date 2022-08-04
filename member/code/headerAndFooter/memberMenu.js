var memberMenu = `
<!-- 側欄 -->
                <!-- Font Awesome -->
                <link rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

                <style>

                
                    .memberNavBar {
                        color: white;
                        /* text-align: center; */
                    }

                    .memberNavBar a:hover {
                        color: gainsboro;
                    }

                    #memberNav {
                        background-color: black;
                        margin-top: 0;
                    }
                </style>

                <div class="col-2" id="memberNav">
                    <div style="max-width: 50%; margin: 10% auto; text-align:center;">
                        <img id='photoNav' src="../images/default_photo.png" alt=""
                            style="width:100px; height:100px; max-width: 100%; max-height: 100%; border-radius:50%; ">
                    </div>
                    <div id='nameNav' style="color: white; text-align: center;">王小明</div>

                    <div id='emailNav' style="color: white; text-align: center; margin-bottom:10%;">ming@gmail.com</div>

                    <div class="memberNavBar" style="display: block; margin: 0 25%;">
                       <div >
                        <i class="fa-regular fa-user"></i>
                        <a href="./profile.html" style='text-decoration:none;'>會員資料</a>
                    </div>
                    <div >
                        <i class="fa-solid fa-cart-shopping"></i>
                        <a href="./orderHistory.html" style='text-decoration:none;'>購物紀錄</a>
                    </div>
                    <div >
                        <i class="fa-solid fa-house"></i>
                        <a href="./rent.html" style='text-decoration:none;'>空間申請紀錄</a>
                    </div>
                    <div  style='margin-bottom:20%;'>
                        <i class="fa-regular fa-calendar-check"></i>
                        <a href="./coffee.html" style='text-decoration:none;'>餐飲訂位紀錄</a>
                    </div> 
                    </div>
                    

                    <div style="max-width: 50%; margin: 10% auto; text-align:center;">
                        <img src="../headerAndFooter/img/LOGO.png" alt=""
                            style="width:100px; height:100px; max-width: 100%; max-height: 100%;">
                    </div>

                </div>
`
document.write(memberMenu);


