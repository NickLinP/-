var header = `
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
<!-- Google Fonts Roboto -->
<link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" />

<link type="text/css" rel="stylesheet" href="../headerAndFooter/css/mmenu.css" />
<link type="text/css" rel="stylesheet" href="../headerAndFooter/css/HeaderAndFooter.css" />
<!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">

<!-- MDB -->
<link href="https://cdnjs.cloud../headerAndFooterflare.com/ajax/libs/mdb-ui-kit/4.2.0/mdb.min.css" rel="stylesheet" />

<!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ"
    crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>


<!-- 導覽列 body -->
<header id='theHeader'>

<div id="page">

    <br>
    <div id="search-menu">
        <div class="wrapper">
            <form id="form" action="#" method=""><input id="popup-search" type="text" name="u"
                    placeholder="Type here to search" /><button id="popup-search-button" type="submit"
                    name="search"><i class="fas fa-search"></i></button></form>
        </div>
    </div>

    <!-- 導覽列 -->
    <div id="header">

        <a href="#menu"><span></span></a>

        <img class="logo" src="../headerAndFooter/img/LOGO.png" alt="" width="100vh">

        <embed class="icon" src="../headerAndFooter/img/facebook.svg" width="40vh" />

        <i class="fas fa-search icontwo" id="search-icon"></i>

    </div>
</div>



<nav id="menu">
    <ul>
        <li><a href="#/">首頁</a></li>
        <li><a href="#/">展場介紹</a></li>
        <li><a href="#/">展場申請</a></li>
        <li><a href="#/">詳細展覽</a></li>
        <li><a href="#/">咖啡輕食</a></li>
        <li><a href="#/">網路商店</a></li>
        <li><a href="#/">交通資訊</a></li>
    </ul>
</nav>
</div>
<br> <br> <br> <br>
</header>

<!-- mmenu scripts -->
<script src="../headerAndFooter//js/mmenu.js"></script>
<script src="../headerAndFooter//js/HeaderAndFooter.js"></script>
<script>
    document.addEventListener(
        "DOMContentLoaded", () => {
            new Mmenu("#menu", {
                "offCanvas": {
                    "position": "right"
                },
                "theme": "light"
            });
        }
    );
</script>
`

document.write(header);


