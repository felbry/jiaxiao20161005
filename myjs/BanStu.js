/**
 * Created by 方博 on 2016/5/4 0004.
 */
var banbtn = document.getElementById("ban");
var banid = document.getElementById("banid");
accessData();
//将该学生封停三天
banbtn.onclick = function(){
    var stuid = banid.value;
    var stubanflags = 1;
    var urlstr = "AdminHandler.ashx?flags=9&stuid=" + stuid + "&stubanflags=" + stubanflags;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "000") {
            //不存在该学生
            alert("不存在该学生");
        }
        else if (data.toString() == "-2") {
            //该学生已被封停,禁止在进行操作
            alert("该学生已被封停,请在封停日期结束后再进行操作!");
        }
        else if (data.toString() == "-1") {
            //封停失败
            alert("封停失败");
        }
        else if (data.toString() == "1") {
            //封停成功
            alert("封停成功");
            accessData();
            window.location.href = "banStu.html";
        } else {

        }
    })
};

//将该学生解禁
function cancleBan(ele){
    //alert(ele.value);
    var stuid = ele.value;
    var stubanflags = 2;
    var urlstr = "AdminHandler.ashx?flags=9&stuid=" + stuid + "&stubanflags=" + stubanflags;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "000") {
            //不存在该学生
            alert("不存在该学生");
        }
        else if (data.toString() == "-2") {
            //该学生已被解禁,禁止在进行操作
            alert("该学生尚未被封停");
        }
        else if (data.toString() == "-1") {
            //解禁失败
            alert("解禁失败");
        }
        else if (data.toString() == "1") {
            //解禁成功
            alert("解禁成功");
            accessData();
            window.location.href = "banStu.html";
        } else {

        }
    })
}

//请求访问数据
function accessData() {
    var stubanflags = 3;
    var urlstr = "AdminHandler.ashx?flags=9" + "&stubanflags=" + stubanflags;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "000") {
            //不存在封停学生信息
            //alert("不存在封停学生信息");
            var ph = document.getElementsByClassName("page-header")[0];
            ph.innerHTML = '<h1 style="color:white">暂无封停学员信息</h1>';
        } else {
            //alert(data.toString());
            var tab = document.getElementById("tab");
            var str = "<tr><th><h3><span class='label label-info'>手机号</span></h3></th><th><h3><span class='label label-info'>姓名</span></h3></th><th><h3><span class='label label-info'>状态</span></h3></th><th><h3><span class='label label-info'>封停日期</span></h3></th><th><h3><span class='label label-info'>截止日期</span></h3></th></tr>";
            var str1 = "<tr><td style='font-size: large' class='bg-success'>";
            var str2 = "</td><td style='font-size: large' class='bg-success'>";
            var str3 = "</td><td style='font-size: large'><button class='btn btn-danger' onclick='cancleBan(this)'  value='";
            var str4 = "'>手动取消封停</button></td></tr>";
            var status = "已封停";
            //date分组，一行信息为一组，以length判断
            var datas = data.split(".");
            for(var i = 0;i < datas.length;i++){
                //alert(datas[i]);
                str += str1 + datas[i].split(",")[0] + str2 + datas[i].split(",")[1] + str2 + status + str2 + datas[i].split(",")[2] + str2 + datas[i].split(",")[3] + str3 + datas[i].split(",")[0] + str4;
            }
            tab.innerHTML = str;
        }
    })
}

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