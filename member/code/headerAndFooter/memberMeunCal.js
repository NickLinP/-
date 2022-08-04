$(document).ready(function () {
    console.log(document.body.offsetHeight);
    console.log(document.getElementById("theHeader").offsetHeight);
    console.log(document.getElementById("theFooter").offsetHeight);
    var height = document.body.offsetHeight -
        document.getElementById("theHeader").offsetHeight -
        document.getElementById("theFooter").offsetHeight;
    console.log(height);
    $('#memberNav').attr('style', `height:${height}px;`);

    // window.onresize = () =>{

    //     　　// 只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
    //     console.log('aaa');
    //     }

    // function getHeight(val) {
    //     // this.processHeight = (window.innerHeight || document.documentElement.clientHeigh) - 210 + 'px';
    // console.log('aa')
    // }
    // getHeight(1);

    // //通過註冊resize監聽器，實現對窗口大小的監聽
    // window.addEventListener('resize', e => { this.getHeight(1); }, false)

    // window.addEventListener('resize', () => {
    //     // resize事件回撥
    //     console.log('window resize')
    // })

    // var x = 1;
    // $('#memberContainer').resize(function () {
    //     x += 1;
    //     console.log(x);
    // });
})
