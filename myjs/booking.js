//var datecount = 0;
//var teacount = 0;
var count = 0;
//------------------------------------------------
//获取系统开始时间和结束时间
var sysStartTime=9;
var sysEndTime=17;
var yuyueshijian = "请在早上9点到下午5点之间进行预订";
var urlstr = "BookingHandler.ashx";
var flags = "flags=9";
myAjax("POST", urlstr, flags, function (data) {
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    } else if (data.toString() == "000") {
        alert("预约系统已经关闭,请联系驾校管理员！");
        window.location.href = "stu.htm";
    } else {
        var arr = data.toString().split(",");
        sysStartTime = arr[0];
        sysEndTime = arr[1]-12;
        yuyueshijian = "请在早上" + sysStartTime + "点到下午" + sysEndTime + "点之间进行预订";
    }
})
//var count1 = 0;
//------------------------------------------------
//请求后台服务器日期
var urlstr = "BookingHandler.ashx";
var flags = "flags=1";
myAjax("POST", urlstr, flags, function (data) {

    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    } else if (data.toString() == "stuisbaned") {
        flags = "flags=8";
        myAjax("POST", urlstr, flags, function (data) {
           // alert(sysStartTime);
            var str = "你的账号已被封号三天！在" + data.toString() + "早上" + sysStartTime + "点开始可以正常预订";
            //alert("s"+sysStartTime);
            alert(str);
            window.location.href = "stu.htm";
        })
    } else if (data.toString() == "000") {
        alert("预约系统已经关闭,请联系驾校管理员！");
        window.location.href = "stu.htm";
    } else if (data.toString() == "222") {
        alert("还没有进行评教，请先进行评教！");
        window.location.href = "teaEval.html";
    } else if (data.toString() == "111") {
        alert("请联系开发人员！");
        window.location.href = "stu.htm";
    } else {
        var arr = data.toString().split(",");
        //alert(arr);
        //alert(new Date(arr[0]).toLocaleDateString());
        //alert(arr[1]);
        //                    var dates = document.getElementsByClassName("date");
        //                    var updatetimes = document.getElementsByClassName("updatetime");
        //                    for (var i = 0; i < dates.length; i++) {
        //                        dates[i].lastChild.nodeValue = new Date(arr[i]).toLocaleDateString();
        //                        //dates[i].lastChild.setAttribute(value, new Date(arr[i]).toLocaleDateString());
        //                        updatetimes[i].value = new Date(arr[i]).toLocaleDateString();
        var date = document.getElementById("1");
        var str1 = "<div class='col-md-2 col-md-offset-1 btn btn-info'><label class='date'><input name='date' type='radio' class='updatetime' onclick='test()' required='required' value='";
        var str2 = "'>";
        var str3 = "</label></div>";
        var str = "";

        for (var i = 0; i < arr.length - 1; i++) {
            str += str1 + new Date(arr[i]).toLocaleDateString() + str2 + new Date(arr[i]).toLocaleDateString() + str3;
        }

        //str += str1 + new Date(arr[0]).toLocaleDateString() + str2 + new Date(arr[0]).toLocaleDateString() + str3;
        //alert(str);
        date.innerHTML = str;
    }
})
function test() {
    // alert(1);
    var chkObjs = document.getElementsByName("teacherName");
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            chkObjs[i].checked = false;
            break;
        }
    }
    var three = document.getElementById("3");
    three.innerHTML = "";
    var four = document.getElementById("4");
    four.innerHTML = "";
}
//日期状态改变
/*
count++;
if (count > 1) {
var updatetimes = document.getElementsByClassName("updatetime");
for (var i = 0; i < updatetimes.length; i++) {
updatetimes[i].onclick = function () {
//count++;
//是否勾选了日期
// alert("hahahahahahhahah");
ShutdownTeaRadio();
ShutdownCarRadio();
ShutdownTimeRadio();
var badges = document.getElementsByClassName("badge");
for (var i = 0; i < badges.length; i++) {
badges[i].lastChild.nodeValue = " ";
//alert(teacarstatus[i].lastChild.nodeValue);
//                            var three = document.getElementById("3");
//                            three.innerHTML = "";
//                            var four = document.getElementById("4");
//                            four.innerHTML = "";
}
}
}
}
*/
//获得教练名和其id号
var urlstr = "BookingHandler.ashx";
var flags = "flags=5";
myAjax("POST", urlstr, flags, function (data) {
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    } else if (data.toString() == "000") {
        alert("预约系统已经关闭,请联系驾校管理员！");
        window.location.href = "stu.htm";
    } else {
        var arr = data.toString().split(".");
        //老柴需要处理地方一
        var teacherName = document.getElementById("2");
        var str1 = "<div class='col-md-2 col-md-offset-1 btn btn-info'><label><input name='teacherName' class='teacher' type='radio' required='required' onClick='teacherClick(this)' value='";
        var str2 = "'>";
        var str3 = "</label></div>";
        var str = "";
        //在arr.length - 1为true的情况下
        for (var i = 0; i < arr.length - 1; i++) {
            str += str1 + arr[i].split(",")[0] + str2 + arr[i].split(",")[1] + str3;
        }
        teacherName.innerHTML = str;
    }
})

//获得车号和其carid号
var urlstr = "BookingHandler.ashx";
var flags = "flags=6";
myAjax("POST", urlstr, flags, function (data) {
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    } else if (data.toString() == "000") {
        alert("预约系统已经关闭,请联系驾校管理员！");
        window.location.href = "stu.htm";
    } else {
        //alert(data.toString());
        var arr = data.toString().split(".");
        //alert(arr);
        //老柴需要处理地方二
    }
})


//获得时间段和其timeid号
var urlstr = "BookingHandler.ashx";
var flags = "flags=7";
myAjax("POST", urlstr, flags, function (data) {
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    } else if (data.toString() == "000") {
        alert("预约系统已经关闭,请联系驾校管理员！");
        window.location.href = "stu.htm";
    } else {
        //alert(data.toString());
        var arr = data.toString().split(".");
        //老柴需要处理地方三
    }
})
//-------------------------------------------------
//处理预约车辆点击事件动态加载该日期下车次预约情况
function teacherClick(ele) {
    //alert(ele.value);
    var datetime;
    var teacherid;
    //日期选择情况
    var chkObjs1 = document.getElementsByName("date");
    myChoice(chkObjs1, 1, function (data) {
        datetime = data.toString();
    })
    //教练选择情况
    if (datetime == null || datetime == undefined || datetime == "") {
        ShutdownTeaRadio();
        return;
    }
    var chkObjs2 = document.getElementsByName("teacherName");
    myChoice(chkObjs2, 2, function (data) {
        teacherid = data.toString();
    })
    if (teacherid == null || teacherid == undefined || teacherid == "") {
        ShutdownTeaRadio();
        return;
    }
    var parames = "datetime=" + datetime + "&teacherid=" + teacherid + "&flags=2";
    urlstr = "BookingHandler.ashx";
    myAjax("POST", urlstr, parames, function (data) {
        var statusstr = data;
        if (statusstr === "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (statusstr === "000") {
            //alert(statusstr);
            //                            var teacarstatus = document.getElementsByClassName("carbadge");
            //                            for (var i = 0; i < teacarstatus.length; i++) {
            //                                teacarstatus[i].lastChild.nodeValue = "0/7";
            //                            }
            alert("预约系统已经关闭,请联系驾校管理员！");
        } else {
            //alert(statusstr.toString());
            var times = document.getElementById("4");
            times.innerHTML = "";
            var arr = statusstr.toString().split(".");
            //alert(arr[0]);
            var carId = document.getElementById("3");
            var str1 = "<div class='col-md-2 col-md-offset-1 btn btn-info'><label><input name='carId' type='radio' class='car' required='required' onClick='carClick(this)' value='";
            var str2 = "'>";
            var str3 = "&nbsp;&nbsp;&nbsp;<span class='badge carbadge'>"
            var str4 = "/";
            var str5 = "</span></label></div>";
            var str = "";
            for (var i = 0; i < arr.length - 1; i++) {
                var arrDivision = arr[i].split(",");
                str += str1 + arrDivision[0] + str2 + arrDivision[0] + arrDivision[1] + str3 + arrDivision[2] + str4 + arrDivision[3] + str5;
            }
            carId.innerHTML = str;
            // var teacarsobj = statusstr.split(",");
            //alert(teacarsobj);
            // var teacarstatus = document.getElementsByClassName("carbadge");
            // for (var i = 0; i < teacarsobj.length; i++) {
            //     teacarstatus[i].lastChild.nodeValue = teacarsobj[i] + "/7";
            //alert(teacarstatus[i].lastChild.nodeValue);
            // }
        }
    })
}
//-------------------------------------------------
//处理预约车辆点击事件动态加载该日期下车次预约情况
function carClick(ele) {
    var datetime;
    var teacherid;
    var carid;
    var time;
    //日期选择情况
    var chkObjs1 = document.getElementsByName("date");
    myChoice(chkObjs1, 1, function (data) {
        datetime = data.toString();
    })
    //教练选择情况
    if (datetime == null || datetime == undefined || datetime == "") {
        ShutdownCarRadio();
        return;
    }
    var chkObjs2 = document.getElementsByName("teacherName");
    myChoice(chkObjs2, 2, function (data) {
        teacherid = data.toString();
    })
    if (teacherid == null || teacherid == undefined || teacherid == "") {
        ShutdownCarRadio();
        return;
    }
    //车次选择情况
    var chkObjs3 = document.getElementsByName("carId");
    myChoice(chkObjs3, 3, function (data) {
        carid = data.toString();
    })
    if (carid == null || carid == undefined || carid == "") {
        ShutdownCarRadio();
        return;
    }
    var parames = "datetime=" + datetime + "&carid=" + carid + "&flags=3" + "&teacherid=" + teacherid;
    urlstr = "BookingHandler.ashx";
    myAjax("POST", urlstr, parames, function (data) {
        var statusstr = data;
        //alert(typeof (statusstr));
        if (statusstr === "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (statusstr === "-1") {
            //alert(statusstr);
            var timestatus = document.getElementsByClassName("timebadge");
            for (var i = 0; i < timestatus.length; i++) {
                timestatus[i].lastChild.nodeValue = "0/1";
            }
        }
        else {
            //alert(statusstr);
            var arr = statusstr.toString().split(".");
            //alert(arr[0]);
            var Time = document.getElementById("4");
            /*
            var str1 = "<div class='col-md-2 col-md-offset-1 btn btn-info'><label><input name='carId' type='radio' class='car' required='required' onClick='carClick(this)' value='";
            var str2 = "'>";
            var str3 = "&nbsp;&nbsp;&nbsp;<span class='badge carbadge'>"
            var str4 = "/7</span></label></div>";
            var str = "";
            for (var i = 0; i < arr.length - 1; i++) {
            var arrDivision = arr[i].split(",");
            str += str1 + arrDivision[0] + str2 + arrDivision[0] + arrDivision[1] + str3 + arrDivision[2] + str4;
            }
            */
            var str1 = '<div class="col-md-2 col-md-offset-1 btn btn-info"><label><input name="Time" type="radio" required="required" value="';
            var str2 = '">';
            var str3 = '&nbsp;&nbsp;&nbsp;<span class="badge timebadge">';
            var str4 = "/";
            var str5 = "</span></label></div>";
            var str = "";
            for (var i = 0; i < arr.length - 1; i++) {
                var arrDivision = arr[i].split(",");
                str += str1 + arrDivision[0] + str2 + arrDivision[1] + str3 + arrDivision[2] + str4 + arrDivision[3] + str5;
            }
            Time.innerHTML = str;
        }
    })
}
//------------------------------------------------
//判断选择情况
var btn = document.getElementById("btnsubmit");
btn.onclick = function () {
    var datetime;
    var teacherid;
    var carid;
    var time;
    //日期选择情况
    var chkObjs1 = document.getElementsByName("date");
    myChoice(chkObjs1, 1, function (data) {
        datetime = data.toString();
    })
    //教练选择情况
    if (datetime == null || datetime == undefined || datetime == "")
        return;
    var chkObjs2 = document.getElementsByName("teacherName");
    myChoice(chkObjs2, 2, function (data) {
        teacherid = data.toString();

    })
    if (teacherid == null || teacherid == undefined || teacherid == "")
        return;
    //车次选择情况
    var chkObjs3 = document.getElementsByName("carId");
    myChoice(chkObjs3, 3, function (data) {
        carid = data.toString();
    })
    if (carid == null || carid == undefined || carid == "") {
        return;
    }
    //场次选择情况
    var chkObjs4 = document.getElementsByName("Time");
    myChoice(chkObjs4, 4, function (data) {
        time = data.toString();
    })
    if (time == null || time == undefined || time == "") {
        return;
    }
    else {
        //将数据传到后台"datetime=datetime&teacherid=teacherid&carid=carid&time=time"
        var parames = "datetime=" + datetime + "&teacherid=" + teacherid + "&carid=" + carid + "&time=" + time + "&flags=4";
        urlstr = "BookingHandler.ashx";
        myAjax("POST", urlstr, parames, function (data) {
            var statusstr = data.toString();
            if (statusstr === "404") {
                alert("你还没有登录！");
                window.location.href("index.htm");
            } else if (statusstr === "1") {
                alert("该场次已经被其他人预订");
            } else if (statusstr === "2") {
                alert("你已经预订这天的其他场次");
            } else if (statusstr === "3") {
                alert("没有选择正确的教练");
                var three = document.getElementById("3");
                three.innerHTML = "";
                var four = document.getElementById("4");
                four.innerHTML = "";
            } else if (statusstr === "4") {
                alert("你的预订失败，请重新尝试");
            } else if (statusstr === "5") {
                alert(yuyueshijian);
                //alert("请在早上9点到下午5点之间进行预订");
            } else if (statusstr === "7") {
                alert("你预订的车辆有误！");
            }
            else if (statusstr === "6") {
                alert("已预订成功！");
                window.location.href = "stu.htm";
            } else {

            }

        })
    }
};
function ShutdownTeaRadio() {
    var chkObjs = document.getElementsByName("teacherName");
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            chkObjs[i].checked = false;
            break;
        }
    }
}
function ShutdownCarRadio() {
    var chkObjs = document.getElementsByName("carId");
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            chkObjs[i].checked = false;
            break;
        }
    }
}
function ShutdownTimeRadio() {
    var chkObjs = document.getElementsByName("Time");
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            chkObjs[i].checked = false;
            break;
        }
    }
}
//------------------------------------------------
function myChoice(chkObjs, choicenum, callback) {
    var bool = 0;
    var k = 0;
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            k = i;
            bool = 1;
            break;
        }
    }
    if (bool == 1) {
        callback(chkObjs[k].value);
    }
    else {
        if (choicenum == 1) {
            alert("还没有输入日期");
        }
        else if (choicenum == 2) {
            alert("还没有选择教练");
        }
        else if (choicenum == 3) {
            alert("还没有选择车辆");
        }
        else if (choicenum == 4) {
            alert("还没有选择练车时间段");
        }

    }
}
//------------------------------------------------
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