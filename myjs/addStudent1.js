/**
 * Created by 方博 on 2016/4/27 0027.
 */
var btn = document.getElementById("sub");

var username = document.getElementById("username");
var password = document.getElementById("password");
var teacher = document.getElementById("teacher");
var stuname = document.getElementById("stuname");
var tel = document.getElementById("tel");
var ident = document.getElementById("ident");

var vu = document.getElementById("validateUsername");
var vp = document.getElementById("validatePassword");
var vt = document.getElementById("validateTeacher");
var vs = document.getElementById("validateStuname");
var vtel = document.getElementById("validateTel");
var vi = document.getElementById("validateIdent");

/*
username.onkeydown = function(){
    vu.innerHTML = "";
}
password.onkeydown = function(){
    vp.innerHTML = "";
}
teacher.onclick = function(){
    vt.innerHTML = "";
}
stuname.onkeydown = function(){
    vs.innerHTML = "";
}
tel.onkeydown = function(){
    vtel.innerHTML = "";
}
ident.onkeydown = function(){
    vi.innerHTML = "";
}
*/
btn.onclick = function () {
    if(username.value == ""){
        vu.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if(password.value == ""){
        vp.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if(teacher.checked == false){
        vt.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if(stuname.value == ""){
        vs.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if(tel.value == ""){
        vtel.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if(ident.value == ""){
        vi.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
};
window.onload = function () {
    //动态加载教练信息
    var urlstr = "AdminHandler.ashx?flags=3";
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            alert("没有教练的的相关信息，请联系管理员！");
        }
        else {
            alert(data.toString());
        }
    })
    //根据学员id返回学员对应的详细信息
    var stuid = "1";
    var urlstr = "AdminHandler.ashx?flags=2&stuid="+stuid;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            alert("没有该学员的相关信息！");
        }
        else {
            alert(data.toString());
        }
    })

    //添加学员信息
    // stuid, password, teaid, stuname, phonenum, sex?, address?, grade?, indentification
    /*
    var stuid="6";
    var password="3";
    var teaid="3";
    var stuname="3";
    var phonenum="3";
    var sex="3";
    var address="3";
    var grade="3";
    var indentification = "3";
    */
    var urlstr = "AdminHandler.ashx?flags=4&stuid=" + stuid + "&password=" + password + "&teaid=" + teaid + "&stuname=" + stuname + "&phonenum=" + phonenum + "&sex=" + sex + "&address=" + address + "&grade=" + grade + "&indentification=" + indentification;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            //输入有误，请检查后在提交
            alert("输入有误，请检查后在提交！");
        }
        else if (data.toString() == "-2") {
            //学员已经存在不能重复添加
            alert("学员已经存在不能重复添加！");
        }
        else if (data.toString() == "-3") {
            //学员添加失败
            alert("学员添加失败！");
        } else if (data.toString() == "1") {
            //学员添加成功
            alert("学员添加成功！");
        }
        else {
            
        }
    })

    //修改学员信息
    // stuid, password, teaid, stuname, phonenum, sex?, address?, grade?, indentification
    var stuid = "6";
    var password = "4";
    var teaid = "4";
    var stuname = "4";
    var phonenum = "4";
    var sex = "4";
    var address = "4";
    var grade = "4";
    var indentification = "4";
    var urlstr = "AdminHandler.ashx?flags=5&stuid=" + stuid + "&password=" + password + "&teaid=" + teaid + "&stuname=" + stuname + "&phonenum=" + phonenum + "&sex=" + sex + "&address=" + address + "&grade=" + grade + "&indentification=" + indentification;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            //输入有误，请检查后在提交
            alert("输入有误，请检查后在提交！");
        }
        else if (data.toString() == "-2") {
            //学员用户名不存在不能进行修改
            alert("学员用户名不存在不能进行修改");
        }
        else if (data.toString() == "-3") {
            //学员修改失败
            alert("学员修改失败！");
        } else if (data.toString() == "1") {
            //学员修改成功
            alert("学员修改成功！");
        }
        else {

        }
    })
    //删除学员信息
    var stuid = "5";
    var urlstr = "AdminHandler.ashx?flags=6&stuid=" + stuid;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            //该学生不存在，请检查后重新输入
            alert("该学生不存在，请检查后重新输入");
        }
        else if (data.toString() == "-2") {
            //学员id不存在不能进行删除
            alert("学员用户名不存在不能进行删除！");
        }else if (data.toString() == "-3") {
            //学员删除失败
            alert("学员删除失败！");
        }else if (data.toString() == "1") {
            //学员删除成功
            alert("学员删除成功！");
        }
        else {

        }
    })
};
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