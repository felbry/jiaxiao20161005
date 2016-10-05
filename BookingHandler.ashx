<%@ WebHandler Language="C#" Class="BookingHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using jiaxiao.dll;
using jiaxiao.sql;
using System.Data;

public class BookingHandler : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string username = "";
        string password = "";
        try
        {
            username = context.Session["username"].ToString();
            password = context.Session["password"].ToString();
        }
        catch
        {
            username = "";
            password = "";
        }
        //初始化将解禁过期的解封
        DataTable banstus = DLL.getAllBanStu();
        DateTime cancelbandatetime = new DateTime();
        if (banstus != null && banstus.Rows.Count > 0)
        {
            string stuid = "";
            DateTime bantime = new DateTime();
            int flag = 0;

            foreach (DataRow row in banstus.Rows)
            {
                //stuid,bantime,isban
                stuid = row["stuid"].ToString();
                bantime = Convert.ToDateTime(row["bantime"].ToString());
                if (DateTime.Compare(Convert.ToDateTime(DateTime.Now.ToShortDateString()), Convert.ToDateTime(bantime.AddDays(3).ToShortDateString())) < 0)
                {
                    //有禁止的学员还没有解禁出来
                    if (stuid == username)
                    {
                        cancelbandatetime = Convert.ToDateTime(bantime.AddDays(4).ToShortDateString());
                    }
                    flag = 1;
                }
                else
                {
                    //将已经超过三天的同学解禁出来
                    DLL.unblockedStuThreeDay(stuid);
                    continue;
                }
            }
        }
        else
        {
            //不存在封停学生信息
        }


        if (username != null && username != "" && DLL.stuIsExit(username, password))
        {

            //是否有评教活动，如果有评教活动
            if (DLL.IsOpenTeaEval())
            {
                //评教系统是否过期
                DateTime endtime = DLL.getOpenTeaEvalEndtime();
                if (DateTime.Compare(endtime, DateTime.Now) < 0)
                {
                    //该评教消息已经过期，及时更新数据
                    if (DLL.CloseAllTeaEval())
                    {
                        //评教系统关闭成功
                    }
                    else
                    {
                        //评教系统关闭失败
                        return;
                    }
                }
                else
                {
                    //继续判断评教学员是否已经进行过评教
                    if (!DLL.IsHaveTeaEval(DLL.getOpenTeaEvalId(), username))
                    {
                        //还没有进行评教，自动跳转评教页面
                        context.Response.Write("222");
                        return;
                    }
                }
            }



            string flags = context.Request.Params["flags"].ToString();
            //获得系统开放时间，获得系统结束时间
            if (flags == "9")
            {
                int startime = DLL.getSysStarttime();
                int endtime = DLL.getSysEndtime();
                string systimestr = startime + "," + endtime;
                context.Response.Write(systimestr);
            }
            if (flags == "8")
            {
                context.Response.Write(cancelbandatetime.ToShortDateString());
            }
            else if (DLL.stuHasBanned(username))
            {
                //该学员已经被禁止
                context.Response.Write("stuisbaned");
            }
            else
            {
                string typename = context.Session["typename"].ToString();
                //getNowDate.ashx
                if (flags == "1")
                {
                    int datetimedays = DLL.getDatetimeDays();
                    DateTime[] futuredays = new DateTime[datetimedays];
                    for (int i = 0; i < futuredays.Length; i++)
                    {
                        futuredays[i] = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(i + 1);
                    }
                    string futuredaysstr = "";
                    int flag = 0;
                    for (int j = 0; j < futuredays.Length; j++)
                    {
                        if (DLL.getDatetimeStatus(futuredays[j]) == 1)
                        {
                            //该日期是正常状态
                            futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",";
                            flag = 1;
                        }
                        else
                        {
                            //该日期已经被关闭
                            //futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",";
                        }
                    }
                    if (flag == 1)
                    {
                        //未来日期没有被关闭
                        context.Response.Write(futuredaysstr);

                    }
                    else
                    {
                        //有显示未来日期
                        context.Response.Write("000");
                    }
                    //DateTime firstday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(1);
                    //DateTime secondday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(2);
                    //DateTime thirdday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(3);
                    ////DateTime firstday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 1);
                    ////DateTime secondday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 2);
                    //string sanday = "";
                    //int j = 0;
                    //if (DLL.getDatetimeStatus(firstday) == 1)
                    //{
                    //    j = 1;
                    //    sanday = sanday + firstday + ",";
                    //}
                    //if (DLL.getDatetimeStatus(secondday) == 1)
                    //{
                    //    j = 1;
                    //    sanday = sanday + secondday + ",";
                    //}
                    //if (DLL.getDatetimeStatus(thirdday) == 1)
                    //{
                    //    j = 1;
                    //    sanday = sanday + thirdday + ",";
                    //}
                    //if (j == 0)
                    //{
                    //    context.Response.Write("000");
                    //}
                    //else
                    //{
                    //    context.Response.Write(sanday);
                    //}

                    //{"nowday":"nowday","secondday":"secondday","thirdday":"thirdday"}
                    //DataTable datetime_t = DLL.getDatetime();
                    //string sanday = "";
                    //int j = 0;
                    //if (datetime_t != null && datetime_t.Rows.Count > 0)
                    //{
                    //    foreach (DataRow row in datetime_t.Rows)
                    //    {
                    //        int i = -1;

                    //        foreach (DataColumn column in datetime_t.Columns)
                    //        {
                    //            i++;
                    //            if (i == 0)
                    //            {
                    //                continue;
                    //            }else if(i==1)
                    //            {
                    //                if (Convert.ToInt32(row[column].ToString()) == 1)
                    //                {
                    //                    j = 1;
                    //                    sanday =sanday+ firstday+","; 
                    //                }
                    //            }else if(i==2)
                    //            {
                    //                if (Convert.ToInt32(row[column].ToString()) == 1)
                    //                {
                    //                    j = 1;
                    //                    sanday = sanday + secondday + ","; 
                    //                }
                    //            }
                    //            else if (i == 3)
                    //            {
                    //                if (Convert.ToInt32(row[column].ToString()) == 1)
                    //                {
                    //                    j = 1;
                    //                    sanday = sanday + thirdday + ",";
                    //                }
                    //            }
                    //        }
                    //    }
                    //    if (j == 0)
                    //    {
                    //        context.Response.Write("000");
                    //    }
                    //    else
                    //    {
                    //        context.Response.Write(sanday);
                    //    }
                    //}
                    //else {
                    //    context.Response.Write("111");
                    //}
                    // string sanday = firstday + "," + secondday + "," + thirdday;
                    //context.Response.Write(sanday);
                }
                //GetTeaCarBookingStatus.ashx
                if (flags == "2")
                {
                    string teacherid = context.Request.Params["teacherid"].ToString();
                    string datetime = context.Request.Params["datetime"].ToString();
                    string teacarbookingstatus = "";
                    DataTable dt = DLL.getThisTeaCarBookingstatus(teacherid, Convert.ToDateTime(datetime));
                    DataTable car_t = DLL.getCar(teacherid);
                    if (car_t != null && car_t.Rows.Count > 0)
                    {
                        string[] car_id = new string[car_t.Rows.Count];
                        string[] car_name = new string[car_t.Rows.Count];
                        //string carstr = "";
                        int i = -1;
                        foreach (DataRow row in car_t.Rows)
                        {
                            car car = new car();
                            i++;
                            //foreach (DataColumn column in car_t.Columns)
                            //{

                            //id, carid, carname, teaid, isdelete, isban, peoplenum
                            //car.id = Convert.ToInt32(row["id"].ToString());
                            //car.carid = row["carid"].ToString();
                            car_id[i] = row["carid"].ToString();
                            car_name[i] = row["carname"].ToString();
                            //car.teaid = row["teaid"].ToString();
                            //car.carname = row["carname"].ToString();
                            //car.isdelete = Convert.ToInt32(row["isdelete"].ToString());
                            //car.isban = Convert.ToInt32(row["isban"].ToString());
                            //car.peoplenum = Convert.ToInt32(row["peoplenum"].ToString());
                            //}
                            // carstr = carstr + car.carid.ToString() + "," + car.carname + ".";
                        }
                        //context.Response.Write(carstr);
                        int[] x = new int[car_t.Rows.Count];
                        //if (dt == null | dt.Rows.Count <= 0)
                        //{
                        //    //还没有人预订该车次
                        //    context.Response.Write("-1");
                        //}
                        //else
                        //{
                        foreach (DataRow row in dt.Rows)
                        {
                            int m = 0;
                            foreach (DataColumn column in dt.Columns)
                            {
                                //id, stuid, teacherid, carid, datename, time, bookingtime
                                m++;
                                if (m != 4)
                                {
                                    continue;
                                }
                                else
                                {
                                    for (int k = 0; k < car_t.Rows.Count; k++)
                                    {
                                        //car_id[i] = row["carid"].ToString();
                                        if (row[column].ToString() == car_id[k])
                                        {
                                            x[k]++;
                                        }
                                    }
                                    //if (row[column].ToString() == "0506")
                                    //{
                                    //    x1++;
                                    //}
                                    //if (row[column].ToString() == "0526")
                                    //{
                                    //    x2++;
                                    //}
                                    //if (row[column].ToString() == "5876")
                                    //{
                                    //    x3++;
                                    //}
                                }
                            }
                        }
                        //teacarbookingstatus = x1.ToString() + "," + x2.ToString() + "," + x3.ToString();
                        for (int k = 0; k < car_t.Rows.Count; k++)
                        {
                            teacarbookingstatus = teacarbookingstatus + car_id[k] + "," + car_name[k] + "," + x[k] + "," + DLL.getTimeNum() * DLL.getCarpeopleNumber() + ".";
                        }
                        context.Response.Write(teacarbookingstatus);
                        //context.Response.Write("0506,奇瑞车,1.0526,奇瑞车,3.");
                        //}
                    }
                    else
                    {
                        context.Response.Write("000");
                    }
                    //int x1 = 0, x2 = 0, x3 = 0;]

                }
                if (flags == "3")
                {

                    //显示预订7个时间段的详细数据getCarBookingStatus.ashx
                    string carid = context.Request.Params["carid"].ToString();
                    string datetime = context.Request.Params["datetime"].ToString();
                    string teaid = context.Request.Params["teacherid"].ToString();
                    //string carid = "0506";
                    //string datetime = "2016/4/20";
                    string carbookingstatus = "";
                    DataTable dt = DLL.getThisCarBookingstatus(carid, Convert.ToDateTime(datetime));
                    //DataTable time_id = DLL.getTime(teaid);
                    DataTable time_id = DLL.getTime();
                    if (time_id == null | time_id.Rows.Count < 0)
                    {
                        context.Response.Write("000");
                    }
                    else
                    {
                        int i = -1;
                        int[] timeid = new int[time_id.Rows.Count];
                        string[] timename = new string[time_id.Rows.Count];
                        foreach (DataRow row in time_id.Rows)
                        {
                            i++;
                            timeid[i] = Convert.ToInt32(row["timeid"].ToString());
                            timename[i] = row["timename"].ToString();
                        }
                        int[] x = new int[time_id.Rows.Count];
                        //int x1 = 0, x2 = 0, x3 = 0, x4 = 0, x5 = 0, x6 = 0, x7 = 0;
                        //if (dt == null | dt.Rows.Count <= 0)
                        //{
                        //    //还没有人预订该车次
                        //    context.Response.Write("-1");
                        //}
                        //else
                        //{
                        foreach (DataRow row in dt.Rows)
                        {
                            int m = 0;
                            foreach (DataColumn column in dt.Columns)
                            {
                                //id, stuid, teacherid, carid, datename, time, bookingtime
                                m++;
                                if (m != 6)
                                {
                                    continue;
                                }
                                else
                                {
                                    for (int k = 0; k < time_id.Rows.Count; k++)
                                    {
                                        if (Convert.ToInt32(row[column].ToString()) == timeid[k])
                                        {
                                            x[k]++;
                                        }
                                    }
                                }
                            }
                        }
                        //carbookingstatus = x1.ToString() + "," + x2.ToString() + "," + x3.ToString() + "," + x4.ToString() + "," + x5.ToString() + "," + x6.ToString() + "," + x7.ToString();
                        for (int k = 0; k < time_id.Rows.Count; k++)
                        {
                            carbookingstatus = carbookingstatus + timeid[k] + "," + timename[k] + "," + x[k] + "," + DLL.getCarpeopleNumber() + ".";
                        }
                        context.Response.Write(carbookingstatus);
                        //}
                        // context.Response.Write("1,8:30-9:40,1.2,9:40-10:40,0.");
                    }
                }
                if (flags == "4")
                {
                    //subbookingsmsg.ashx
                    booking bookings = new booking();
                    bookings.stuid = context.Session["username"].ToString();
                    password = context.Session["password"].ToString();
                    bookings.datename = Convert.ToDateTime(context.Request.Params["datetime"].ToString());
                    bookings.teacherid = context.Request.Params["teacherid"].ToString();
                    bookings.carid = context.Request.Params["carid"].ToString();
                    bookings.timeid = Convert.ToInt32(context.Request.Params["time"].ToString());
                    bookings.bookingtime = DateTime.Now;
                    //!DLL.saveBookingMessage(bookings)
                    if (DLL.iHasChoiceRightTea(bookings))
                    {
                        //我是否已经选择正确的教练
                        context.Response.Write("3");
                    }
                    else if (!DLL.stuBookingCarIsRight(bookings.teacherid, bookings.carid))
                    {
                        //你预订的车辆有误
                        context.Response.Write("7");
                    }
                    else if (DLL.carTimeIsHasBooked(bookings, DLL.getCarpeopleNumber()))
                    {
                        //该场次已经被其他人预订
                        context.Response.Write("1");
                    }
                    else if (DLL.iHasBookedDaytime(bookings))
                    {
                        //我已经预订这天的其他场次
                        context.Response.Write("2");
                    }//DateTime.Now.Hour <9 || DateTime.Now.Hour > 16
                    else if (DateTime.Now.Hour < DLL.getSysStarttime() || DateTime.Now.Hour > (DLL.getSysEndtime() - 1))
                    {
                        //请在早上9点到下午5点之前进行预订
                        context.Response.Write("5");
                    }
                    else if (!DLL.saveBookingMessage(bookings))
                    {
                        //我的预订失败
                        context.Response.Write("4");
                    }
                    else
                    {
                        //该场次预订成功
                        context.Response.Write("6");
                    }
                }
                //获得教练名和其id号
                if (flags == "5")
                {
                    DataTable tea_t = DLL.getTea();
                    if (tea_t != null && tea_t.Rows.Count > 0)
                    {
                        string teastr = "";
                        foreach (DataRow row in tea_t.Rows)
                        {
                            tea tea = new tea();
                            foreach (DataColumn column in tea_t.Columns)
                            {
                                //id, teaid, password, teaname, isdelete, isban
                                //tea.id = Convert.ToInt32(row["id"].ToString());
                                tea.teaid = row["teaid"].ToString();
                                //tea.password = row["password"].ToString();
                                tea.teaname = row["teaname"].ToString();
                                //tea.isdelete = Convert.ToInt32(row["isdelete"].ToString());
                                //tea.isban = Convert.ToInt32(row["isban"].ToString());
                            }
                            //teastr = teastr + tea.id.ToString() + "," + tea.teaid + "," + tea.password + "," + tea.teaname + "," + tea.isdelete.ToString() + "," + tea.isban.ToString() + ","; 
                            teastr = teastr + tea.teaid.ToString() + "," + tea.teaname + ".";
                        }
                        context.Response.Write(teastr);
                    }
                    else
                    {
                        context.Response.Write("000");
                    }
                }
                //获得车号和其carid号
                if (flags == "6")
                {
                    //DataTable car_t = DLL.getCar(); ;
                    //if (car_t != null && car_t.Rows.Count > 0)
                    //{
                    //    string carstr = "";
                    //    foreach (DataRow row in car_t.Rows)
                    //    {
                    //        car car = new car();
                    //        foreach (DataColumn column in car_t.Columns)
                    //        {
                    //            //id, carid, carname, teaid, isdelete, isban, peoplenum
                    //            //car.id = Convert.ToInt32(row["id"].ToString());
                    //            car.carid = row["carid"].ToString();
                    //            //car.teaid = row["teaid"].ToString();
                    //            car.carname = row["carname"].ToString();
                    //            //car.isdelete = Convert.ToInt32(row["isdelete"].ToString());
                    //            //car.isban = Convert.ToInt32(row["isban"].ToString());
                    //            //car.peoplenum = Convert.ToInt32(row["peoplenum"].ToString());
                    //        }
                    //        carstr = carstr + car.carid.ToString() + "," + car.carname + ".";
                    //    }
                    //    context.Response.Write(carstr);
                    //}
                    //else
                    //{
                    //    context.Response.Write("000");
                    //}
                }
                //获得对应的时间段
                if (flags == "7")
                {
                    DataTable time_t = DLL.getTime(); ;
                    if (time_t != null && time_t.Rows.Count > 0)
                    {
                        string timestr = "";
                        foreach (DataRow row in time_t.Rows)
                        {
                            time time = new time();
                            foreach (DataColumn column in time_t.Columns)
                            {
                                //id, timeid, timename, isdelete, isban
                                //time.id = Convert.ToInt32(row["id"].ToString());
                                time.timeid = Convert.ToInt32(row["timeid"].ToString());
                                time.timename = row["timename"].ToString();
                                //car.isdelete = Convert.ToInt32(row["isdelete"].ToString());
                                //car.isban = Convert.ToInt32(row["isban"].ToString());
                                //car.peoplenum = Convert.ToInt32(row["peoplenum"].ToString());
                            }
                            timestr = timestr + time.timeid.ToString() + "," + time.timename + ".";
                        }
                        context.Response.Write(timestr);
                    }
                    else
                    {
                        context.Response.Write("000");
                    }
                }

            }

        }
        else
        {
            context.Response.Write("404");
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}