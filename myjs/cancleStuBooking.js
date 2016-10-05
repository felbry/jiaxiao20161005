seekBtn.onclick = function () {
    //参数data
    var deletestubookingflags = 1;
    var seekId = document.getElementById("seek").value;
    //var seekId = "1";
    var urlstr = "AdminHandler.ashx?flags=16" + "&deletestubookingflags=" + deletestubookingflags + "&seekId=" + seekId;
    myAjax("POST", urlstr, "", function (data) {
        //alert(data.toString());
        if (data.toString() == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (data.toString() === "0") {
            alert("输入为空，请检查后输入");
            return;
        } else if (data.toString() === "-1") {
            alert("该学员不存在，请检查后输入");
            return;
        } else if (data.toString() === "2") {
            alert("该学员还没有进行预约练车");
            return;
        } else {
            //alert(data.toString());
            var arr = data.toString().split(".");
            //手机号
            seekId = document.getElementById("seek").value;
            var seekBtn = document.getElementById("seekBtn");
            var div = document.getElementById("tab");
            var str1 = "<tr><th><h3><span class='label label-primary'>姓名</span></h3></th><th><h3><span class='label label-primary'>教练</span></h3></th><th><h3><span class='label label-primary'>车号</span></h3></th><th><h3><span class='label label-primary'>预约日期</span></h3></th><th><h3><span class='label label-primary'>具体时间</span></h3></th></tr>";
            var str2 = "<tr><td style='font-size: large' class='bg-success'>";
            var str3 = "</td><td style='font-size: large' class='bg-info'>";
            var str4 = "</td><td style='font-size: large' class='bg-warning'>";
            var str5 = "</td><td style='font-size: large' class='bg-danger'>";
            var str6 = "</td><td style='font-size: large' class='bg-success'>";
            var str_6 = "</td><td style='font-size: large'><button onClick='cancleInfo(this)' class='btn btn-danger btn-block' value='";
            var str_66 = "'>取消本条预约</button>";
            var str7 = "</td></tr></table>";
            if (typeof (arr[arr.length - 2]) != undefined && (arr.length - 1)) {
                var arr4 = arr[arr.length - 2].split(",");
                var str = str1 + str2 + arr4[1] + str3 + arr4[2] + str4 + arr4[3] + str5 + new Date(arr4[4]).toLocaleDateString() + str6 + arr4[5] + str_6 + arr4 + str_66 + str7;
                div.innerHTML = str;
            }
            if (typeof (arr[arr.length - 3]) != undefined && (arr.length - 2)) {
                var arr3 = arr[arr.length - 3].split(",");
                var arr4 = arr[arr.length - 2].split(",");
                var str = str1 +
                          str2 + arr4[1] + str3 + arr4[2] + str4 + arr4[3] + str5 + new Date(arr4[4]).toLocaleDateString() + str6 + arr4[5] + str_6 + arr4 + str_66 +
                          str2 + arr3[1] + str3 + arr3[2] + str4 + arr3[3] + str5 + new Date(arr3[4]).toLocaleDateString() + str6 + arr3[5] + str_6 + arr3 + str_66 +
                          str7;
                div.innerHTML = str;
            }
            if (typeof (arr[arr.length - 4]) != undefined && (arr.length - 3)) {
                var arr2 = arr[arr.length - 4].split(",");
                var arr3 = arr[arr.length - 3].split(",");
                var arr4 = arr[arr.length - 2].split(",");
                var str = str1 +
                            str2 + arr4[1] + str3 + arr4[2] + str4 + arr4[3] + str5 + new Date(arr4[4]).toLocaleDateString() + str6 + arr4[5] + str_6 + arr4 + str_66 +
                            str2 + arr3[1] + str3 + arr3[2] + str4 + arr3[3] + str5 + new Date(arr3[4]).toLocaleDateString() + str6 + arr3[5] + str_6 + arr3 + str_66 +
                            str2 + arr2[1] + str3 + arr2[2] + str4 + arr2[3] + str5 + new Date(arr2[4]).toLocaleDateString() + str6 + arr2[5] + str_6 + arr2 + str_66 +
                            str7;
                div.innerHTML = str;
            }
            //alert(typeof (arr[arr.length - 5]));
            //alert(typeof (arr[arr.length - 5]) != undefined);
            if (typeof (arr[arr.length - 5]) != undefined && (arr.length - 4)) {
                var arr1 = arr[arr.length - 5].split(",");
                var arr2 = arr[arr.length - 4].split(",");
                var arr3 = arr[arr.length - 3].split(",");
                var arr4 = arr[arr.length - 2].split(",");
                var str = str1 +
                        str2 + arr4[1] + str3 + arr4[2] + str4 + arr4[3] + str5 + new Date(arr4[4]).toLocaleDateString() + str6 + arr4[5] + str_6 + arr4 + str_66 +
                        str2 + arr3[1] + str3 + arr3[2] + str4 + arr3[3] + str5 + new Date(arr3[4]).toLocaleDateString() + str6 + arr3[5] + str_6 + arr3 + str_66 +
                        str2 + arr2[1] + str3 + arr2[2] + str4 + arr2[3] + str5 + new Date(arr2[4]).toLocaleDateString() + str6 + arr2[5] + str_6 + arr2 + str_66 +
                        str2 + arr1[1] + str3 + arr1[2] + str4 + arr1[3] + str5 + new Date(arr1[4]).toLocaleDateString() + str6 + arr1[5] + str_6 + arr1 + str_66 +
                        str7;
                div.innerHTML = str;
                //alert(str);
            }
        }
    })
};
//取消函数
function cancleInfo(event) {
    
    var arr = event.value.toString().split(",");
    var deletestubookingflags = 2;
    if (confirm("确定要删除数据吗？")) {
        var parames = "";
        var url = "AdminHandler.ashx?flags=16&id="+ arr[0] + "&deletestubookingflags=" + deletestubookingflags + "&datetime=" + new Date(arr[4]).toLocaleDateString();
        myAjax("POST", url, parames, function (data) {
            var str = data.toString();
            if (str == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (str === "1") {
                alert("取消预约需要在预约日期前一天12：00之前完成");
            } else if (str === "2") {
                alert("取消预约信息成功");
                window.location.href = "cancleStuBooking.html";
            } else if (str === "3") {
                alert("取消预约信息失败");
            }
            else {
                alert('系统繁忙，请重新尝试！');
            }
        })
    }
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