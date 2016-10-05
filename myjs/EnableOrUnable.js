/**
 * Created by 方博 on 2016/5/3 0003.
 */

function dateBtn(ele){
    if(ele.getAttribute("class").split(" ")[1] === "btn-success"){
        (ele.parentNode).innerHTML = '<button class="btn btn-danger" onclick="dateBtn(this)">禁用状态</button>';
    }
    if(ele.getAttribute("class").split(" ")[1] === "btn-danger"){
        (ele.parentNode).innerHTML = '<button class="btn btn-success" onclick="dateBtn(this)">启动状态</button>';
    }
}
