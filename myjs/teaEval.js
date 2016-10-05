
var btn = document.getElementById("btn");
btn.addEventListener("click", function () {
    alert("为被点击了");
    //前台学员评教页面，需要进行提示：教练评价标准：…此处留空白地方，可以将教练的要求和标准填写进去，方便学员对照进行评价。
    //学员进行评教，需要前台返回这些相关信息
    
    //预约唯一id(后台自动添加，无需前台传值),
    //服务态度，
    //教学技能，
    //纪律情况（有无无故迟到或缺勤情况，有无吃拿卡要情况，有无恶言恶语、中伤学员情况），
    //综合评价，
    //其他建议，
    //这次评教标志唯一id（后台自动获取，无需前台传值）,
    //学生唯一id（后台自动获取，无需前台传值）,
    //教练唯一id（后台自动获取，无需前台传值）,
    //评价结束时间（后台自动获取，无需前台传值），
    //评价开始时间（后台自动获取，无需前台传值），
    //评教时间（后台自动获取，无需前台传值）     

    //传值数据格式声明
    //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
    //优、良、中、合格、差 分别用阿拉伯数字1、2、3、4、5代替
    // 有\无 分别用阿拉伯数字0、1代替
    var fuwutaidu = 1; //服务态度
    var jiaxuejineng = 1; //教学技能
    var chidaoqueqin = 1; //有无无故迟到或缺勤情况
    var chinakayaodis = 1; //有无吃拿卡要情况
    var eyaneyuzhongshang = 1; //有无恶言恶语、中伤学员情况
    var zonghepingjia = 1; //综合评价
    var qitajianyi = "建议内容"; //其他建议
    var parames = "";
    var url = "TeaEvalHandler.ashx?flags=1&fuwutaidu=" + fuwutaidu + "&jiaxuejineng=" + jiaxuejineng + "&chidaoqueqin=" + chidaoqueqin + "&chinakayaodis=" + chinakayaodis
     + "&eyaneyuzhongshang=" + eyaneyuzhongshang + "&zonghepingjia=" + zonghepingjia + "&qitajianyi=" + qitajianyi
     + "&teaEvalId=" + teaEvalId;
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (str === "1") {
            alert("评教成功!");
        } else if (str === "-1") {
            alert("数据有误，请重新尝试！");
        } else if (str === "-2") {
            alert("输入存在空");
        } else if (str === "-3") {
            alert("已经进行过评价了");
        }
        else {
            alert('系统繁忙，请重新尝试！');
        }
    })
});
var btn2 = document.getElementById("Button1");
btn2.addEventListener("click", function () {
    //添加一个评教活动,
    
    //需要前台传这些数值
    var start_year=2016;//评教开始年份
    var start_month = 9; //评教开始月份
    var start_day = 29; //评教开始天数
    var end_year = 2016; //评教结束年份
    var end_month = 9; //评教结束月份
    var end_day = 30; //评教结束天数
    var parames = ""; 
    var url = "TeaEvalHandler.ashx?flags=2&start_year=" + start_year + "&start_month=" + start_month + "&start_day=" + start_day + "&end_year=" + end_year
     + "&end_month=" + end_month + "&end_day=" + end_day;
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (str === "1") {
            alert("评教系统添加一个新的评价成功");
        } else if (str === "-1") {
            alert("评教系统正在开放，请在当前系统评价进行完再进行下一次评教!");
        } else if (str === "-2") {
            alert("评教系统添加一个新的评价失败");
        } else if (str === "-3") {
            alert("时间段输入有误，请重新输入");
        } else if (str === "-4") {
            alert("当前评价开始时间有误，请输入从今天开始往后的时间作为开始时间");
        } else if (str === "-5") {
            alert("当前评价开始时间小于结束时间，请重新输入");
        }
        else {
            alert('系统繁忙，请重新尝试！');
        }
    })
});

//查看某个评教的详细信息
var btn3 = document.getElementById("Button2");
btn3.addEventListener("click", function () {
    //需要前台传入这个评教活动的唯一id
    var teaevaluationid = "2"; //评教活动的唯一id
    var parames = "";
    var url = "TeaEvalHandler.ashx?flags=3&teaevaluationid=" + teaevaluationid;
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else {
            //评教数据详细展示

            //一、服务态度
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //二、教学技能
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //三、纪律情况
            //有无无故迟到或缺勤情况   有  无
            //有无吃拿卡要情况         有  无
            //有无恶言恶语、中伤学员情况   有  无
            //四、综合评价
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //五、其他建议（选填）

            //格式说明：评教总人数（0：表示还没有进评价该教练，>0表示评价该教练的总人数），
            //教练名，教练id，服务态度百分比（优，良，中，合格，差），
            //教学技能百分比（优，良，中，合格，差），
            //有无无故迟到或缺勤情况百分比（有，无），
            //有无吃拿卡要情况百分比（有，无）,
            //有无恶言恶语,中伤百分比（有，无）,
            //综合评价百分比（优，良，中，合格，差），
            //对该教练的提出的建议的个数（0表示没有人对该教练提出建议，>0表示有提出建议的总数），
            //后面依次罗列若干的建议，;
            //2,于文翔,1,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,ni,mei,;

            //2,吴教练,2,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,la,yu,;

            //1,张教练,5,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,1,没有,;
            alert(str);
        }
    })
});

//查看所有的评教信息（总）
var btn4 = document.getElementById("Button3");
btn4.addEventListener("click", function () {
    var parames = "";
    var url = "TeaEvalHandler.ashx?flags=4";
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (str == "-1") {
            alert("还没有开始过一个评教");
            //需要在这个进行前台的处理，如果没有进行过评教，则显示这个信息，显示一个添加框
        } else {
            //动态加载评教详细数据

            //返回格式说明：每次评教的唯一id,
            //改次评教开始时间，
            //改次评教结束时间，
            //评教状态（1：正在进行评教，2：已经进行完的评教）;
            //7,2016/9/30,2016/10/30,1;
            //6,2016/9/29,2016/10/3,0;
            //5,2016/9/30,2016/10/3,0;
            //4,2016/9/30,2016/10/3,0;
            //3,2016/9/30,2016/10/3,0;
            //2,2016/9/1,2016/10/10,0;
            alert(str);
        }
    })
});
function myAjax(httpMethod, url, parames, callback) {
    var xhr;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open(httpMethod, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(parames);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText);
            }
        }
    };
}