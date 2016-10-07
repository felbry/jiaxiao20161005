//------------------------------------------------
//获取系统开始时间和结束时间
var sysStartTime = 9;
var sysEndTime = 17;
var yuyueshijian = "管理员操作时间在早上在早上9点到下午5点之间";
var urlstr = "AdminHandler.ashx";
var flags = "flags=19";
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
        sysEndTime = arr[1];
        yuyueshijian = "管理员操作时间在早上" + sysStartTime + "点到下午" + sysEndTime + "点之间";
    }
})
//首次动态加载信息
var datetimeeditflags = 0;
var teaeditsflags = "";
var flags = "";
var urlstr = "";
var adminoperatetimeflag = "0";
var urlstr = "AdminHandler.ashx?flags=17";
myAjax("POST", urlstr, "", function (datas) {
    if (datas.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    }
    else {
        adminoperatetimeflag = datas.toString();
        if (datas.toString() == "-1") {
            //操作时间段不正确
            alert("对教练、车辆、时间进行新增、删除、修改操作的时间在上午" + sysStartTime + "点之前,下午" + sysEndTime + "点之后.而且只有最近一天有预订数据，其他未来几天不能有预订数据.不满足以上两个条件,系统默认禁止操作.");
        } else if (datas.toString() == "1") {

        }
    }
})

var teacherCollection = ""; //教练id与教练名字对照表，方便修改时候通过教练名字得到id。
flags = "14";
urlstr = "AdminHandler.ashx?flags=" + flags;
myAjax("POST", urlstr, "", function (data) {
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    }
    else {
        //alert(data.toString());
        var total = data.toString();
        var options = total.split(";");
        //获得当前管理员操作的时间时候在下午5点之后，上午9点之前
        //动态加载日期
        var dateArr = options[0].toString().split(".");
        var appointmentDays = document.getElementById("appointmentDays");
        var immediateDateInfo = document.getElementById("immediateDateInfo");
        appointmentDays.value = dateArr[0];
        immediateDateInfo.innerHTML = updateDateInfo(dateArr);
        //动态加载教练
        var teacherArr = options[1].toString().split(".");
        teacherCollection = teacherArr;     //全局变量
        var immediateTeaInfo = document.getElementById("immediateTeaInfo");
        immediateTeaInfo.innerHTML = updateTeaInfo(teacherArr);
        //动态加载系统开放时间-------------------------最后一个需要添加的
        //sysStartTime为系统开放时间（阿拉伯数字0-24），sysEndTime为系统结束时间为（阿拉伯数字0-24）
        $('#startTime').val(sysStartTime);
        $('#endTime').val(sysEndTime);
        //动态加载车辆可以预约的次数
        var carpeoplenum = options[4].toString();
        console.log(carpeoplenum);
        var carAppointmentTimes = document.getElementById("carAppointmentTimes");
        carAppointmentTimes.setAttribute("value", carpeoplenum);
        //动态加载车辆
        var carArr = options[2].toString().split(".");
        var immediateCarInfo = document.getElementById("immediateCarInfo");
        immediateCarInfo.innerHTML = updateCarInfo(carArr);
        //动态加载时间段,对应索引藏在了button的value中
        var timeArr = options[3].toString().split(".");
        var immediateTimeInfo = document.getElementById("immediateTimeInfo");
        immediateTimeInfo.innerHTML = updateTimeInfo(timeArr);

    }
})

//修改后台未来预约天数
var appointmentDaysBtn = document.getElementById("appointmentDaysBtn");
appointmentDaysBtn.onclick = function () {
    var appointmentDays = document.getElementById("appointmentDays");
    flags = "10";
    datetimeeditflags = 1;
    var datetimeday = appointmentDays.value;
    urlstr = "AdminHandler.ashx?flags=" + flags + "&datetimeeditflags=" + datetimeeditflags + "&datetimeday=" + datetimeday;
    myAjax("POST", urlstr, "", function (data) {
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-2") {
            alert("输入信息有误，请输入数字");
        } else if (data.toString() == "-3") {
            alert("输入数字小于0，请检查后输入");
        } else if (data.toString() == "-1") {
            alert("更改未来预约天数失败");
        } else if (data.toString() == "1") {
            alert("更改未来预约天数成功");
            window.location.href = "changeBookingInfo.html";
        } else {

        }
    })
};

////修改系统预约开放时间
$('#sysTimesBtn').on('click', function () {
    flags = "20";
    var sysStartTime = $('#startTime').val();
    var sysEndTime = $('#endTime').val();
    urlstr = "AdminHandler.ashx?flags= " + flags + "&sysStartTime=" + sysStartTime + "&sysEndTime=" + sysEndTime;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-1") {
            alert("系统开放开始时间比结束时间不早，不符合逻辑");
        } else if (data.toString() == "-2") {
            alert("输入的时间段不在0-24小时范围内");
        } else if (data.toString() == "-3") {
            alert("系统错误，系统预约开放时间修改失败！");
        } else if (data.toString() == "1") {
            alert("系统预约开放时间修改成功");
            window.location.href = "changeBookingInfo.html";
        }
        else {
            //alert(data.toString());
        }
    })
})

//添加新信息
//教练
function teacherNew() {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var teaInfos = document.getElementById("teacherNewInfo");
    var str = '<div class="row"> <div class="col-xs-3 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" class="form-control" placeholder="教练名"> </div> </form> </div> <div class="col-xs-4"> <button type="submit" class="btn btn-success" ' + disabled + ' onclick="identifyTeacherInfo(this)">确认信息提交</button> <button type="submit" class="btn btn-warning" onclick="cancleTeacherInfo(this)">取消此次添加</button> </div> </div> <div class="row"> <br /> </div>';
    teaInfos.innerHTML = str;
}
function identifyTeacherInfo(ele) {
    var mark = confirm("确认信息无误提交吗？");
    if (mark) {
        var teaName = getNewTeacher(ele);
        flags = "11";
        teaeditsflags = 1;
        var teaname = teaName;
        urlstr = "AdminHandler.ashx?flags= " + flags + " &teaeditsflags=" + teaeditsflags + "&teaname=" + teaname;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-4") {
                alert(yuyueshijian);
                //alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-3") {
                alert("未来几天已经有人预订了,禁止操作");
            } else if (data.toString() == "-2") {
                alert("输入信息为空");
            } else if (data.toString() == "-1") {
                alert("增加失败");
            } else if (data.toString() == "1") {
                alert("增加成功");
                window.location.href = "changeBookingInfo.html";
            } else {
                //alert(data.toString());
            }
        })
        //删除新增信息选项行
        cancleTeacherInfo(ele);
    }
}
function cancleTeacherInfo(ele) {
    var teaInfos = document.getElementById("teacherNewInfo");
    teaInfos.innerHTML = "";
}
//车辆
function carNew() {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var carInfos = document.getElementById("carNewInfo");
    var strs = "";
    for (var i = 1; i < teacherCollection.length; i++) {
        strs += '<option value="' + teacherCollection[i].split(",")[0] + '">' + teacherCollection[i].split(",")[1] + '</option>';
    }
    var str = '<div class="row"> <div class="col-xs-6 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" class="form-control" placeholder="车辆名"> </div> <div class="form-group"> <input type="text" class="form-control" placeholder="编号"> </div> <div class="form-group"> <select class="form-control" id="teaSelect">' + strs + '</select> </div> </form> </div> <div class="col-xs-4"> <button type="submit" class="btn btn-success"' + disabled + '  onclick="identifyCarInfo(this)">确认信息提交</button> <button type="submit" class="btn btn-warning" onclick="cancleCarInfo(this)">取消此次添加</button> </div> </div> <div class="row"> <br /> </div>';
    carInfos.innerHTML = str;
}
function identifyCarInfo(ele) {
    var mark = confirm("确认信息无误提交吗？");
    if (mark) {
        var carArr = getNewCar(ele);
        flags = "12";
        careditsflags = 1;
        var carid = carArr[1];
        var carname = carArr[0];
        var teaid = carArr[2];
        urlstr = "AdminHandler.ashx?flags= " + flags + " &careditsflags=" + careditsflags + "&carid=" + carid + "&carname=" + carname + "&teaid=" + teaid;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-4") {
                alert(yuyueshijian);
               // alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-3") {
                alert("未来几天已经有人预订了,禁止操作");
            } else if (data.toString() == "-2") {
                alert("输入为空，增加失败");
            } else if (data.toString() == "-1") {
                alert("增加失败");
            } else if (data.toString() == "1") {
                alert("增加成功");
                window.location.href = "changeBookingInfo.html";
            }
            else {
                //alert(data.toString());
            }
        })
        cancleCarInfo(ele);
    }
}
function cancleCarInfo(ele) {
    var carInfos = document.getElementById("carNewInfo");
    carInfos.innerHTML = "";
}
//时间段
function timeNew() {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var timeInfos = document.getElementById("timeNewInfo");
    var str = '<div class="row"> <div class="col-xs-5 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="time" class="form-control" placeholder="格式：08:30"> </div> 至 <div class="form-group"> <input type="time" class="form-control" placeholder="格式：09:30"> </div> </form> </div> <div class="col-xs-4"> <button type="submit" class="btn btn-success"' + disabled + ' onclick="identifyTimeInfo(this)">确认信息提交</button> <button type="submit" class="btn btn-warning" onclick="cancleTimeInfo(this)">取消此次添加</button> </div> </div> <div class="row"> <br /> </div>';
    timeInfos.innerHTML = str;
}
function identifyTimeInfo(ele) {
    var mark = confirm("确认信息无误提交吗？");
    if (mark) {
        var time = getNewTime(ele);
        flags = "13";
        timeeditsflags = 1;
        var timename = time;
        urlstr = "AdminHandler.ashx?flags= " + flags + " &timeeditsflags=" + timeeditsflags + "&timename=" + timename;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-4") {
                alert(yuyueshijian);
               // alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-3") {
                alert("未来几天已经有人预订了,禁止操作");
            } else if (data.toString() == "-2") {
                alert("输入为空，增加失败");
            } else if (data.toString() == "-1") {
                alert("增加失败");
            } else if (data.toString() == "1") {
                alert("增加成功");
                window.location.href = "changeBookingInfo.html";
            }
            else {
                //alert(data.toString());
            }
        })
        cancleTimeInfo(ele);
    }
}
function cancleTimeInfo(ele) {
    var timeInfos = document.getElementById("timeNewInfo");
    timeInfos.innerHTML = "";
}



//修改信息
//教练
function teacherChangeBtn(ele) {
    var teacherName = changeInfo(ele);
    //alert(teacherName);
    flags = "11";
    teaeditsflags = 3;
    var teaid = ele.value;
    var teaname = teacherName;
    urlstr = "AdminHandler.ashx?flags= " + flags + " &teaeditsflags=" + teaeditsflags + "&teaid=" + teaid + "&teaname=" + teaname;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-1") {
            alert("修改失败");
        } else if (data.toString() == "1") {
            alert("修改成功");
            window.location.href = "changeBookingInfo.html";
        }
        else {
            //alert(data.toString());
        }
    })
}
//更改车辆每天可以预约次数
function carAppointmentTimesBtn() {
    var mark = confirm("确认修改吗？");
    if (mark) {
        var carAppointmentTimes = document.getElementById("carAppointmentTimes");
        var carpeoplenum = carAppointmentTimes.value;
        flags = "18";
        urlstr = "AdminHandler.ashx?flags=" + flags + "&carpeoplenum=" + carpeoplenum;
        myAjax("POST", urlstr, "", function (data) {
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-2") {
                alert("输入信息有误，请输入数字");
            } else if (data.toString() == "-3") {
                alert("输入数字小于0，请检查后输入");
            } else if (data.toString() == "-1") {
                alert("更改车辆每天可以预约次数失败");
            } else if (data.toString() == "1") {
                alert("更改车辆每天可以预约次数成功");
                window.location.href = "changeBookingInfo.html";
            } else {

            }
        });
    }
}
//车辆
function carChangeBtn(ele) {
    var changeMark = confirm("确认修改吗？");
    if (changeMark) {
        var arr = getNewCar(ele);
        flags = "12";
        var careditsflags = 3;
        var carid = arr[1];
        var teaid = ele.value;
        var carname = arr[0];
        urlstr = "AdminHandler.ashx?flags= " + flags + " &careditsflags=" + careditsflags + "&carid=" + carid + "&teaid=" + teaid + "&carname=" + carname;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-1") {
                alert("修改失败");
            } else if (data.toString() == "1") {
                alert("修改成功");
                window.location.href = "changeBookingInfo.html";
            }
            else {
                //alert(data.toString());
            }
        })
    }
}
//时间段
function timeChangeBtn(ele) {
    var timeName = changeInfo(ele);
    //alert(timeName);
    flags = "13";
    timeeditsflags = 3;
    var timeid = ele.value;
    var timename = timeName;
    urlstr = "AdminHandler.ashx?flags= " + flags + " &timeeditsflags=" + timeeditsflags + "&timeid=" + timeid + "&timename=" + timename;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-1") {
            alert("修改失败");
        } else if (data.toString() == "1") {
            alert("修改成功");
            window.location.href = "changeBookingInfo.html";
        }
        else {
            //alert(data.toString());
        }
    })
}



//删除信息
//教练
function teacherDelBtn(ele) {
    //delInfo(ele);
    var delMark = confirm("确认删除此条信息吗？建议：非必要情况选择禁用功能");
    if (delMark) {
        flags = "11";
        teaeditsflags = 2;
        var teaid = ele.value;
        urlstr = "AdminHandler.ashx?flags= " + flags + " &teaeditsflags=" + teaeditsflags + "&teaid=" + teaid;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-3") {
                alert(yuyueshijian);
                //alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-2") {
                alert("未来几天已经有人预订了,禁止删除");
            } else if (data.toString() == "-1") {
                alert("删除失败");
            } else if (data.toString() == "1") {
                alert("删除成功");
                window.location.href = "changeBookingInfo.html";
            } else {
                alert(data.toString());
            }
        })
    }
}
//车辆
function carDelBtn(ele) {
    //delInfo(ele);
    var delMark = confirm("确认删除此条信息吗？建议：非必要情况选择禁用功能");
    if (delMark) {
        var arr = getNewCar(ele);
        flags = "12";
        var carid = arr[1];
        var teaid = ele.value;
        var careditsflags = "2";
        urlstr = "AdminHandler.ashx?flags= " + flags + " &careditsflags=" + careditsflags + "&carid=" + carid + "&teaid=" + teaid;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-3") {
                alert(yuyueshijian);
                //alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-2") {
                alert("未来几天已经有人预订了,禁止删除");
            } else if (data.toString() == "-1") {
                alert("删除失败");
            } else if (data.toString() == "1") {
                alert("删除成功");
                window.location.href = "changeBookingInfo.html";
            } else {
                //alert(data.toString());
            }
        })
    }
}
//时间段
function timeDelBtn(ele) {
    //delInfo(ele);
    var delMark = confirm("确认删除此条信息吗？建议：非必要情况选择禁用功能");
    if (delMark) {
        flags = "13";
        timeeditsflags = 2;
        var timeid = ele.value;
        urlstr = "AdminHandler.ashx?flags= " + flags + " &timeeditsflags=" + timeeditsflags + "&timeid=" + timeid;
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "-3") {
                alert(yuyueshijian);
                //alert("管理员操作时间在下午5点后，上午9点之前");
            } else if (data.toString() == "-2") {
                alert("未来几天已经有人预订了,禁止删除");
            } else if (data.toString() == "-1") {
                alert("删除失败");
            } else if (data.toString() == "1") {
                alert("删除成功");
                window.location.href = "changeBookingInfo.html";
            }
            else {
                //alert(data.toString());
            }
        })
    }
}


//启用和禁用
//日期
function dateStateBtn(ele) {
    if (ele.getAttribute("class").split(" ")[1] === "btn-success") {
        changeToUnable(ele);
        dateIsBan(changeInfo(ele), 0);
    }
    else if (ele.getAttribute("class").split(" ")[1] === "btn-danger") {
        changeToEnable(ele);
        dateIsBan(changeInfo(ele), 1);
    }
}

//教练
function teacherStateBtn(ele) {
    if (ele.getAttribute("class").split(" ")[1] === "btn-success") {
        changeToUnable(ele);
        teacherIsBan(ele.value, 0);
    }
    //此处的else很必要，不然每次点击会执行两个if语句，前台看好像没有变化，实则是两条都执行了。
    else if (ele.getAttribute("class").split(" ")[1] === "btn-danger") {
        changeToEnable(ele);
        teacherIsBan(ele.value, 1);
    }
}

//车辆
function carStateBtn(ele) {
    if (ele.getAttribute("class").split(" ")[1] === "btn-success") {
        changeToUnable(ele);
        var arr = getNewCar(ele);
        carIsBan(arr[1], ele.value, 0);
    }
    else if (ele.getAttribute("class").split(" ")[1] === "btn-danger") {
        changeToEnable(ele);
        var arr = getNewCar(ele);
        carIsBan(arr[1], ele.value, 1);
    }
}


//时间段
function timeStateBtn(ele) {
    if (ele.getAttribute("class").split(" ")[1] === "btn-success") {
        changeToUnable(ele);
        timeIsBan(ele.value, 0);
    }
    else if (ele.getAttribute("class").split(" ")[1] === "btn-danger") {
        changeToEnable(ele);
        timeIsBan(ele.value, 1);
    }
}


/*     全局函数       */
//启用禁用函数
function changeToUnable(ele) {
    var str1 = "btn btn-danger";
    ele.setAttribute("class", str1);
    ele.lastChild.nodeValue = "禁用";
}
function changeToEnable(ele) {
    var str2 = "btn btn-success";
    ele.setAttribute("class", str2);
    ele.lastChild.nodeValue = "启用";
}
//开启禁用日期函数
function dateIsBan(bandatetime, isban) {
    datetimeeditflags = 3;
    flags = "10";
    //var bandatetime = "2016/5/9";
    //var isban = 0;
    urlstr = "AdminHandler.ashx?flags=" + flags + "&datetimeeditflags=" + datetimeeditflags + "&bandatetime=" + bandatetime + "&isban=" + isban;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-1") {
            alert("禁止或者开启失败");
        } else if (data.toString() == "1") {
            alert("禁止或者开启成功");
        }
        else {
            //alert(data.toString());
        }
    })
}
//开启禁用教练函数
function teacherIsBan(teaid, isban) {
    flags = "11";
    teaeditsflags = 4;
    //var teaid = "5";
    //var isban = 0;
    urlstr = "AdminHandler.ashx?flags= " + flags + " &teaeditsflags=" + teaeditsflags + "&teaid=" + teaid + "&isban=" + isban;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-3") {
            alert(yuyueshijian);
            //alert("管理员操作时间在下午5点后，上午9点之前");
        } else if (data.toString() == "-2") {
            alert("未来几天已经有人预订了,禁止操作");
        } else if (data.toString() == "-1") {
            alert("禁止或者开启失败");
        } else if (data.toString() == "1") {
            alert("禁止或者开启成功");
        }
        else {
            //alert(data.toString());
        }
    })
}
//开启禁用车辆函数
function carIsBan(carid, teaid, isban) {
    flags = "12";
    careditsflags = 4;
    //var carid = "0501";
    //var teaid = "2";
    //var isban = 0;
    urlstr = "AdminHandler.ashx?flags= " + flags + " &careditsflags=" + careditsflags + "&carid=" + carid + "&teaid=" + teaid + "&isban=" + isban;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-3") {
            alert(yuyueshijian);
            //alert("管理员操作时间在下午5点后，上午9点之前");
        } else if (data.toString() == "-2") {
            alert("未来几天已经有人预订了,禁止操作");
        } else if (data.toString() == "-1") {
            alert("禁止或者开启失败");
        } else if (data.toString() == "1") {
            alert("禁止或者开启成功");
        }
        else {
            //alert(data.toString());
        }
    })
}
//开启禁用时间段
function timeIsBan(timeid, isban) {
    flags = "13";
    var timeeditsflags = 4;
    //var timeid = 8;
    //var isban = 0;
    urlstr = "AdminHandler.ashx?flags=" + flags + "&timeeditsflags=" + timeeditsflags + "&timeid=" + timeid + "&isban=" + isban;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() == "-3") {
            alert(yuyueshijian);
            //alert("管理员操作时间在下午5点后，上午9点之前");
        } else if (data.toString() == "-2") {
            alert("未来几天已经有人预订了,禁止操作");
        } else if (data.toString() == "-1") {
            alert("禁止或者开始失败");
        } else if (data.toString() == "1") {
            alert("禁止或者开始成功");
        }
        else {
            //alert(data.toString());
        }
    })
}

//删除信息函数
function delInfo(ele) {
    //alert(ele.parentNode.parentNode.className);
    //alert(ele.parentNode.className);
    //alert(ele.parentNode.parentNode.nextSibling.nextSibling.tagName);
    ele.parentNode.parentNode.nextSibling.nextSibling.innerHTML = "";
    ele.parentNode.parentNode.innerHTML = "";
    //与上述同理，都删除不掉节点，都是清空
    //var tea = document.getElementsByClassName("borderColorSet2")[0];
    //tea.removeChild(ele.parentNode.parentNode.nextSibling);
    //tea.removeChild(ele.parentNode.parentNode);
}
//清空“新增”表格函数


//修改信息函数
function changeInfo(ele) {
    return ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].childNodes[1].value;
}
/*
function changeCarInfo(ele) {
var arr = [];
arr[0] = ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].childNodes[1].value;
return  + ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[3].childNodes[1].value;
}
*/

//得到新教练名字函数
function getNewTeacher(ele) {
    return ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].childNodes[1].value;
}
//得到新车辆相关信息函数
function getNewCar(ele) {
    var arr = [];
    arr[0] = ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].childNodes[1].value;    //车辆名
    arr[1] = ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[3].childNodes[1].value;    //编号
    arr[2] = ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[5].childNodes[1].value;    //所属教练
    return arr;
}
//得到新时间段函数
function getNewTime(ele) {
    return ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].childNodes[1].value + "-" + ele.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[3].childNodes[1].value;
}

//动态加载信息函数
function updateTimeInfo(timeArr) {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var immediateTimeInfoStr = "";
    var immediateTimeInfoStr1 = '<div class="row"> <div class="col-xs-3 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" disabled class="form-control" value="';
    var immediateTimeInfoStr2 = '"> </div> </form> </div> <div class="col-xs-3"> <button type="submit" class="btn btn-default" onclick="timeChangeBtn(this)" disabled value="';
    var immediateTimeInfoStr3 = '">修改</button> <button type="submit" class="btn btn-success" ' + disabled + ' onclick="timeStateBtn(this)" value="';
    var immediateTimeInfoStr3s = '">修改</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="timeStateBtn(this)" value="';
    var immediateTimeInfoStr4 = '">启用</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="timeDelBtn(this)" value="';
    var immediateTimeInfoStr4s = '">禁用</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="timeDelBtn(this)" value="';
    var immediateTimeInfoStr5 = '">删除</button> </div> </div> <div class="row"> <br /> </div>';
    for (var i = 1; i < timeArr.length; i++) {
        if (timeArr[i].split(",")[2] == 0)
            immediateTimeInfoStr += immediateTimeInfoStr1 + timeArr[i].split(",")[1] + immediateTimeInfoStr2 + timeArr[i].split(",")[0] + immediateTimeInfoStr3s + timeArr[i].split(",")[0] + immediateTimeInfoStr4s + timeArr[i].split(",")[0] + immediateTimeInfoStr5;
        else
            immediateTimeInfoStr += immediateTimeInfoStr1 + timeArr[i].split(",")[1] + immediateTimeInfoStr2 + timeArr[i].split(",")[0] + immediateTimeInfoStr3 + timeArr[i].split(",")[0] + immediateTimeInfoStr4 + timeArr[i].split(",")[0] + immediateTimeInfoStr5;
    }
    return immediateTimeInfoStr;
}

function updateCarInfo(carArr) {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var immediateCarInfoStr = "";
    var immediateCarInfoStr1 = '<div class="row"> <div class="col-xs-7 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" class="form-control" disabled value="';
    var immediateCarInfoStr1s = '"> </div> <div class="form-group"> <input disabled type="text" class="form-control" value="';
    var immediateCarInfoStr1ss = '"> </div> <div class="form-group"> <input disabled type="text" class="form-control" value="';
    var immediateCarInfoStr2 = '"> </div> </form> </div> <div class="col-xs-3"> <button type="submit" disabled class="btn btn-default" onclick="carChangeBtn(this)" value="';
    var immediateCarInfoStr3 = '">修改</button> <button type="submit" class="btn btn-success"' + disabled + ' onclick="carStateBtn(this)" value="';
    var immediateCarInfoStr4 = '">启用</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="carDelBtn(this)" value="';
    var immediateCarInfoStr3s = '">修改</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="carStateBtn(this)" value="';
    var immediateCarInfoStr4s = '">禁用</button> <button type="submit" class="btn btn-danger" ' + disabled + '  onclick="carDelBtn(this)" value="';
    var immediateCarInfoStr5 = '">删除</button> </div> <div class="col-xs-offset-1"> </div> </div> <div class="row"> <br /> </div>';
    for (var i = 1; i < carArr.length; i++) {
        if (carArr[i].split(",")[4] == 0)
            immediateCarInfoStr += immediateCarInfoStr1 + carArr[i].split(",")[1] + immediateCarInfoStr1s + carArr[i].split(",")[0] + immediateCarInfoStr1ss + carArr[i].split(",")[3] + immediateCarInfoStr2 + carArr[i].split(",")[2] + immediateCarInfoStr3s + carArr[i].split(",")[2] + immediateCarInfoStr4s + carArr[i].split(",")[2] + immediateCarInfoStr5;
        else
            immediateCarInfoStr += immediateCarInfoStr1 + carArr[i].split(",")[1] + immediateCarInfoStr1s + carArr[i].split(",")[0] + immediateCarInfoStr1ss + carArr[i].split(",")[3] + immediateCarInfoStr2 + carArr[i].split(",")[2] + immediateCarInfoStr3 + carArr[i].split(",")[2] + immediateCarInfoStr4 + carArr[i].split(",")[2] + immediateCarInfoStr5;
    }
    return immediateCarInfoStr;
}

function updateTeaInfo(teacherArr) {
    var disabled = "";
    if (adminoperatetimeflag == "-1") {
        disabled = "disabled";
    }
    var immediateTeaInfoStr = "";
    var immediateTeaInfoStr1 = '<div class="row"> <div class="col-xs-3 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" class="form-control" disabled value="';
    var immediateTeaInfoStr2 = '"> </div> </form> </div> <div class="col-xs-3"> <button type="submit" class="btn btn-default" onclick="teacherChangeBtn(this)" disabled value="';
    var immediateTeaInfoStr3 = '">修改</button> <button type="submit" class="btn btn-success"' + disabled + '   onclick="teacherStateBtn(this)" value="';
    var immediateTeaInfoStr3s = '">修改</button> <button type="submit" class="btn btn-danger"' + disabled + ' onclick="teacherStateBtn(this)" value="';
    var immediateTeaInfoStr4 = '">启用</button> <button type="submit" class="btn btn-danger"' + disabled + '  onclick="teacherDelBtn(this)" value="';
    var immediateTeaInfoStr4s = '">禁用</button> <button type="submit" class="btn btn-danger" onclick="teacherDelBtn(this)" value="';
    var immediateTeaInfoStr5 = '">删除</button> </div> </div> <div class="row"> <br /> </div>';
    for (var i = 1; i < teacherArr.length; i++) {
        if (teacherArr[i].split(",")[2] == 0)
            immediateTeaInfoStr += immediateTeaInfoStr1 + teacherArr[i].split(",")[1] + immediateTeaInfoStr2 + teacherArr[i].split(",")[0] + immediateTeaInfoStr3s + teacherArr[i].split(",")[0] + immediateTeaInfoStr4s + teacherArr[i].split(",")[0] + immediateTeaInfoStr5;
        else
            immediateTeaInfoStr += immediateTeaInfoStr1 + teacherArr[i].split(",")[1] + immediateTeaInfoStr2 + teacherArr[i].split(",")[0] + immediateTeaInfoStr3 + teacherArr[i].split(",")[0] + immediateTeaInfoStr4 + teacherArr[i].split(",")[0] + immediateTeaInfoStr5;
    }
    return immediateTeaInfoStr;
}

function updateDateInfo(dateArr) {
    var immediateDateInfoStr = "";
    var immediateDateInfoStr1 = '<div class="row"> <div class="col-xs-3 col-xs-offset-1"> <form class="form-inline"> <div class="form-group"> <input type="text" class="form-control" disabled value="';
    var immediateDateInfoStr2 = '"> </div> </form> </div> <div class="col-xs-1"> <button type="submit" class="btn btn-success" disabled onclick="dateStateBtn(this)">启用</button> </div> </div> <div class="row"> <br /> </div>';
    var immediateDateInfoStr2s = '"> </div> </form> </div> <div class="col-xs-1"> <button type="submit" class="btn btn-success" onclick="dateStateBtn(this)">启用</button> </div> </div> <div class="row"> <br /> </div>';
    var immediateDateInfoStr3 = '"> </div> </form> </div> <div class="col-xs-1"> <button type="submit" class="btn btn-danger" disabled onclick="dateStateBtn(this)">禁用</button> </div> </div> <div class="row"> <br /> </div>';
    var immediateDateInfoStr3s = '"> </div> </form> </div> <div class="col-xs-1"> <button type="submit" class="btn btn-danger"  onclick="dateStateBtn(this)">禁用</button> </div> </div> <div class="row"> <br /> </div>';
    for (var i = 1; i < dateArr.length; i++) {
        if (i <= dateArr[0]) {
            if (dateArr[i].split(",")[1] == 0)
                immediateDateInfoStr += immediateDateInfoStr1 + dateArr[i].split(",")[0] + immediateDateInfoStr3;
            else
                immediateDateInfoStr += immediateDateInfoStr1 + dateArr[i].split(",")[0] + immediateDateInfoStr2;
        } else {
            if (dateArr[i].split(",")[1] == 0)
                immediateDateInfoStr += immediateDateInfoStr1 + dateArr[i].split(",")[0] + immediateDateInfoStr3s;
            else
                immediateDateInfoStr += immediateDateInfoStr1 + dateArr[i].split(",")[0] + immediateDateInfoStr2s;
        }
    }
    return immediateDateInfoStr;
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


