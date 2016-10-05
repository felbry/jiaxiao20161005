$(function () {
    //加载所有评教信息
    var parames = "";
    var url = "TeaEvalHandler.ashx?flags=4";
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        } else if (str == "-1") {
            console.log("还没有开始过一个评教");
            //需要在这个进行前台的处理，如果没有进行过评教，则显示这个信息，显示一个添加框
        } else {
            //动态加载评教详细数据

            //返回格式说明：每次评教的唯一id,
            //改次评教开始时间，
            //改次评教结束时间，
            //评教状态（1：正在进行评教，0：已经进行完的评教）;
            //7,2016/9/30,2016/10/30,1;
            //6,2016/9/29,2016/10/3,0;
            //5,2016/9/30,2016/10/3,0;
            //4,2016/9/30,2016/10/3,0;
            //3,2016/9/30,2016/10/3,0;
            //2,2016/9/1,2016/10/10,0;
            //console.log(str);
            var teamArr = str.split(';');
            for (var i = 0; i < teamArr.length - 1; i++) {
                //console.log(teamArr[i]);
                var status = '';
                if (teamArr[i].split(',')[3] == 0)
                    status = '<td style="color:red">已结束</td>';
                else
                    status = '<td style="color:green">正在进行</td>';
                var tr = $('<tr>\
                                <td>' + teamArr[i].split(',')[0] + '</td>\
                                <td>' + teamArr[i].split(',')[1] + '</td>\
                                <td>' + teamArr[i].split(',')[2] + '</td>\
                                ' + status + '\
                                <td><a data-id="' + teamArr[i].split(',')[0] + '">查看详情 >></a></td>\
                            </tr>');
                $('table').append(tr);
            }
        }

        //链接到指定id的详细信息
        $('a').on('click', function () {
            var id = $(this).attr('data-id');
            //将id藏在一个隐藏dom元素中，为后续的window.open()访问父窗口做准备
            var ident = $('#detailId').text();
            if (ident) {
                $('#detailId').text(id);
            } else {
                var p = $('<p style="display:none" id="detailId">' + id + '</p>');
                $('body').append(p);
            }
            window.open('evalutionDetail.html');
        })
    })

    //添加一次新评教
    $('#addBtn').on('click', function () {
        var con = confirm("确认时间填写正确了吗？（请谨慎操作）");
        if (con) {
            var sY = $('input[name="s-y"]').val(),
                sM = $('input[name="s-m"]').val(),
                sD = $('input[name="s-d"]').val(),
                eY = $('input[name="e-y"]').val(),
                eM = $('input[name="e-m"]').val(),
                eD = $('input[name="e-d"]').val();
            $('input').val(''); //清空输入框
            var start_year = sY;//评教开始年份
            var start_month = sM; //评教开始月份
            var start_day = sD; //评教开始天数
            var end_year = eY; //评教结束年份
            var end_month = eM; //评教结束月份
            var end_day = eD; //评教结束天数
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
                    window.location.href = "evalutionSystem.html";
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
        }
    })
})

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