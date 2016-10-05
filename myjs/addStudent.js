/**
 * Created by 方博 on 2016/4/27 0027.
 */
//动态加载教练名字
var getTeacher = document.getElementsByClassName("active")[0];
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
        //alert(data.toString());
        //alert(data.toString().split(".")[0]);
        var sample = data.toString();
        var sam = sample.split(".");
        var str1 = '<label><input type="radio" name="teacher" class="ischecked" onClick="delVt()" value="';
        var str2 = '">';
        var str3 = "</label>";
        var str = "";
        //[2][3][4]索引的都是一个字符
        for (var i = 0; i < sam.length - 1; i++) {
            str += str1 + sam[i][4] + str2 + sam[i][0] + sam[i][1] + sam[i][2] + str3;
        }
        getTeacher.innerHTML = str;
    }
})


var btn = document.getElementById("sub");
var username = document.getElementById("username");
var passwords = document.getElementById("password");
var ischecked = document.getElementsByClassName("ischecked"); //teacher radio
var stunames = document.getElementById("stuname");
var tel = document.getElementById("tel");
var ident = document.getElementById("ident");
var addr = document.getElementById("address");
var grades = document.getElementById("grade");
var ischecked1 = document.getElementsByClassName("ischecked1"); //sex radio

var vu = document.getElementById("validateUsername");
var vp = document.getElementById("validatePassword");
var vt = document.getElementById("validateTeacher");
var vs = document.getElementById("validateStuname");
var vtel = document.getElementById("validateTel");
var vi = document.getElementById("validateIdent");
var vsex = document.getElementById("validateSex");

//清除提示信息
username.onkeydown = function () {
    vu.innerHTML = "";
};
passwords.onkeydown = function(){
    vp.innerHTML = "";
};
stunames.onkeydown = function(){
    vs.innerHTML = "";
};
tel.onkeydown = function(){
    vtel.innerHTML = "";
};
ident.onkeydown = function(){
    vi.innerHTML = "";
};
function delVt() {
    vt.innerHTML = "";
}
for (var i = 0; i <= ischecked1.length - 1; i++) {
    ischecked1[i].onclick = function () {
        vsex.innerHTML = "";
    };
}
//全部清空按钮
var clearAll = document.getElementById("clearAll");
clearAll.onclick = function () {
    clearStuInfo();
}

//必填项判断
btn.onclick = function () {
    var requiredFlag = 1;
    if (username.value == "") {
        requiredFlag = 0;
        vu.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (username.value.length != 11) {
        //requiredFlag = 0;
        //vu.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;手机号位数错误</p>';
    }
    if (passwords.value == "") {
        requiredFlag = 0;
        vp.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    //判断teacher radio
    var teacherNull = document.getElementsByName("teacher");
    var teaValue;
    myChoice(teacherNull, 1, function (data) {
        teaValue = data.toString();
    });
    if (!teaValue) {
        requiredFlag = 0;
        vt.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }

    //判断sex radio
    var sexNull = document.getElementsByName("sex");
    var sexValue;
    myChoice(sexNull, 1, function (data) {
        sexValue = data.toString();
    });
    //alert(typeof sexValue);
    if (sexValue === undefined) {
        requiredFlag = 0;
        vsex.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }

    if (stunames.value == "") {
        requiredFlag = 0;
        vs.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (tel.value == "") {
        requiredFlag = 0;
        vtel.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (ident.value == "") {
        requiredFlag = 0;
        vi.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    //    if (username.value != "" && username.value.length == 11 && passwords.value != "" && k >= 1 && k1 >= 1 && stunames.value != "" && tel.value != "" && ident.value != "") {
    //        requiredFlag = 1;
    //    }
    if (requiredFlag == 0) {

    } else {
        var teaid;
        var teacher = document.getElementsByName("teacher");
        myChoice(teacher, 1, function (data) {
            teaid = data.toString();
        });
        var sex;
        var sexs = document.getElementsByName("sex");
        myChoice(sexs, 1, function (data) {
            sex = data.toString();
        });
        var stuid = username.value;
        var password = passwords.value;
        var stuname = stunames.value;
        var phonenum = tel.value;
        var address = addr.value;
        var grade = grades.value;
        var indentification = ident.value;

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
    }
};

//根据学员id返回学员对应的详细信息根据学员id返回学员对应的详细信息
var finduser = document.getElementById("finduser");
var findbutton = document.getElementById("find");
findbutton.onclick = function () {
    clearStuInfo();
    var stuid = finduser.value;
    var urlstr = "AdminHandler.ashx?flags=2&stuid=" + stuid;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else if (data.toString() == "-1") {
            alert("没有该学员的相关信息！");
            var blankuser = document.getElementById("blankuser");
            blankuser.innerHTML = "查询的用户不存在";

        }
        else {
            //alert(data.toString());
            var blankuser = document.getElementById("blankuser");
            blankuser.innerHTML = "";
            //ShutdownRadio(ischecked);
            //var ischecked1 = document.getElementsByClassName("ischecked1");
            //ShutdownRadio(ischecked1);
            var rs = data.split(",");
            // rs = stuid, password, teaid,teaname, stuname, phonenum, sex, address, grade, indentification
            username.value = rs[0];
            //username.setAttribute("disabled",true);
            passwords.value = rs[1];
            for (var i = 0; i <= ischecked.length - 1; i++) {
                if (rs[2] == ischecked[i].value)
                    ischecked[i].setAttribute("checked", "checked");
            }
            stunames.value = rs[4];
            tel.value = rs[5];
            var ischecked1 = document.getElementsByClassName("ischecked1");
            for (var i = 0; i <= ischecked1.length - 1; i++) {
                if (rs[6] === ischecked1[i].value)
                    ischecked1[i].setAttribute("checked", "checked");
            }
            addr.value = rs[7];
            grades.value = rs[8];
            ident.value = rs[9];
        }
    })
};

var changebutton = document.getElementById("change");
changebutton.onclick = function () {
    var requiredFlag = 1;
    if (username.value == "") {
        requiredFlag = 0;
        vu.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (username.value.length != 11) {
        //requiredFlag = 0;
        //vu.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;手机号位数错误</p>';
    }
    if (passwords.value == "") {
        requiredFlag = 0;
        vp.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    //判断teacher radio
    var teacherNull = document.getElementsByName("teacher");
    var teaValue;
    myChoice(teacherNull, 1, function (data) {
        teaValue = data.toString();
    });
    if (!teaValue) {
        requiredFlag = 0;
        vt.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }

    //判断sex radio
    var sexNull = document.getElementsByName("sex");
    var sexValue;
    myChoice(sexNull, 1, function (data) {
        sexValue = data.toString();
    });
    if (sexValue === undefined) {
        requiredFlag = 0;
        vsex.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }

    if (stunames.value == "") {
        requiredFlag = 0;
        vs.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (tel.value == "") {
        requiredFlag = 0;
        vtel.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }
    if (ident.value == "") {
        requiredFlag = 0;
        vi.innerHTML = '<p style="color: red">*&nbsp;&nbsp;&nbsp;必填</p>';
    }

    //    if (username.value != "" && /*username.value.length == 11 && */passwords.value != "" && stunames.value != "" && tel.value != "" && ident.value != "") {
    //        requiredFlag = 1;
    //    }

    var r = confirm("确认修改吗？");
    if (r == true) {
        if (requiredFlag == 0) {

        } else {
            var teaid;
            var teacher = document.getElementsByName("teacher");
            myChoice(teacher, 1, function (data) {
                teaid = data.toString();
            });
            var sex;
            var sexs = document.getElementsByName("sex");
            myChoice(sexs, 1, function (data) {
                sex = data.toString();
            });
            var stuid = username.value;
            var password = passwords.value;
            var stuname = stunames.value;
            var phonenum = tel.value;
            var address = addr.value;
            var grade = grades.value;
            var indentification = ident.value;
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
        }
    } else { }
};

var deletebutton = document.getElementById("delete");
deletebutton.onclick = function () {
    var r = confirm("确认删除吗？");
    if (r == true) {
        var stuid = finduser.value;
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
            } else if (data.toString() == "-3") {
                //学员删除失败
                alert("学员删除失败！");
            } else if (data.toString() == "1") {
                //学员删除成功
                alert("学员删除成功！");
            }
            else {

            }
        })
    }
    else {
       
    }
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
}
function ShutdownRadio(chkObjs) {
    for (var i = 0; i < chkObjs.length; i++) {
        if (chkObjs[i].checked) {
            chkObjs[i].removeAttribute("checked");
            return ;
        }
    }
}

function clearStuInfo() {
    username.value = "";
    passwords.value = "";
    ShutdownRadio(ischecked);
    stunames.value = "";
    tel.value = "";
    ident.value = "";
    addr.value = "";
    grade.value = "";
    ShutdownRadio(ischecked1);
}