<%@ WebHandler Language="C#" Class="GetBookingsMsg" %>

using System;
using System.Web;
using jiaxiao.dll;
using jiaxiao.sql;
using System.Web.SessionState;
using System.Data;

public class GetBookingsMsg : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string username = "";
        string password = "";
        string noticeflags = "";
        int SysStarttime = DLL.getSysStarttime();
        int SysEndtime = DLL.getSysEndtime();
        try
        {
            noticeflags = context.Request.Params["noticeflags"].ToString();
        }
        catch
        {
            noticeflags = "";
        }
        if (noticeflags == "1")
        {
            DataTable notice_dt = DLL.getNotice();
            string noticestr = "0,";
            if (notice_dt == null || notice_dt.Rows.Count <= 0)
            {
                context.Response.Write(noticestr);
            }
            else
            {
                noticestr = "1,";
                foreach (DataRow row in notice_dt.Rows)
                {
                    noticestr = noticestr + row["msg"] + ",";
                }
                noticestr = noticestr.Remove(noticestr.Length - 1, 1);
                context.Response.Write(noticestr);
            }
            noticeflags = "";
        }
        else
        {
            int flags = -1;
            try
            {
                username = context.Session["username"].ToString();
                password = context.Session["password"].ToString();
                flags = Convert.ToInt32(context.Request.Params["flags"].ToString());
            }
            catch
            {
                username = "";
                password = "";
                flags = -1;
            }
            if (username != "" && username != null && DLL.adminIsExit(username, password))
            {

                //���ϵͳ����ʱ�䣬���ϵͳ����ʱ��
                if (flags == 19)
                {
                    int startime = SysStarttime;
                    int endtime = SysEndtime;
                    string systimestr = startime + "," + endtime;
                    context.Response.Write(systimestr);
                }
                if (flags == 17)
                {
                    DateTime now = DateTime.Now;
                    int timeflag = -1;
                    if (now.Hour >= DLL.getSysEndtime())
                    {
                        timeflag = 1;
                    }
                    else if (now.Hour <= DLL.getSysStarttime())
                    {
                        timeflag = 1;
                    }
                    else
                    {
                        timeflag = -1;
                        //����Ա����ʱ�䲻������5�������9��֮ǰ
                    }
                    int tempflags = 0;
                    if (now.Hour >= DLL.getSysEndtime())
                    {
                        if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                        {
                            //δ���ڶ��졢��������û�и�ʱ��ε�����
                            //�и�����,�����и����ݣ���ֹɾ��
                        }
                        else
                        {
                            tempflags = 1;
                        }
                    }
                    else if (now.Hour < DLL.getSysStarttime())
                    {
                        if (DLL.deleteBookingStructureIsResonable(now) == true)
                        {
                            //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                            //�и�����,�����и����ݣ���ֹɾ��
                        }
                        else
                        {
                            tempflags = 1;
                        }
                    }
                    if (tempflags == 0)
                    {
                        timeflag = -1;
                    }
                    context.Response.Write(timeflag);
                }
                if (flags == 1)
                {
                    string typename = context.Session["typename"].ToString();
                    int count = 0;
                    if (username != null || username != "")
                    {
                        //string username = "1";
                        booking bookings = new booking();
                        DataTable dt = DLL.getStuBookingMessageTop5();
                        if (dt == null && dt.Rows.Count <= 0)
                        {
                            context.Response.Write("��û����ԤԼ������");
                        }
                        else
                        {
                            #region ƴ���ַ���

                            string bookingsmsg =
                                "<div class='container'><div class='panel panel-info'><div class='panel-heading'><strong>��ԤԼ����</strong></div> <table class='table'> <tr><th>����</th><th>����</th><th>����</th><th>����</th><th>ʱ���</th></tr>";
                            foreach (DataRow row in dt.Rows)
                            {
                                //class="active">...</tr>
                                //  <tr class="success">...</tr>
                                //   <tr class="warning">...</tr>
                                //   <tr class="danger">...</tr>
                                //   <tr class="info">...</tr>

                                string[] colors =
                                    {
                                        "class='active'", "class='success'", "class='warning'",
                                        "class='danger'", "class='info'"
                                    };
                                int i = 0;
                                int[] flag = { 0, 0, 0, 0, 0 };
                                foreach (DataColumn column in dt.Columns)
                                {
                                    i++;
                                    //DLL.getStuName(username);
                                    //id, stuid, teacherid, carid, datename, time   
                                    if (i == 1)
                                    {
                                        bookings.id = Convert.ToInt32(row[column].ToString());
                                    }
                                    else if (i == 2)
                                    {
                                        bookings.stuid = row[column].ToString();
                                    }
                                    else if (i == 3)
                                    {
                                        bookings.teacherid = row[column].ToString();
                                    }
                                    else if (i == 4)
                                    {
                                        bookings.carid = row[column].ToString();
                                    }
                                    else if (i == 5)
                                    {
                                        int k = -1;
                                        bookings.datename = Convert.ToDateTime(row[column].ToString());
                                        for (int j = -1; j <= 3; j++)
                                        {
                                            k++;
                                            if (bookings.datename.CompareTo(DateTime.Now.Date.AddDays(j)) == 0)
                                            {
                                                flag[k] = 1;
                                            }
                                        }
                                    }
                                    else if (i == 6)
                                    {
                                        bookings.timeid = Convert.ToInt32(row[column].ToString());
                                    }

                                    //<th>����</th> <th>����</th><th>����</th><th>����</th><th>ʱ���</th>
                                    //<tr><td>2</td> <td>2</td><td>2</td><td>2</td><td>2</td></tr>  
                                }
                                if (dt == null && dt.Rows.Count <= 0)
                                {
                                    break;
                                }
                                int days = DLL.getDaysGroupByBookingTimeid(bookings.datename, bookings.teacherid, bookings.timeid);
                                int carscount = DLL.getCarsNumByTeaid(bookings.teacherid);
                                if (days == carscount)
                                {
                                    for (int k = 0; k <= 4; k++)
                                    {
                                        if (flag[k] == 1)
                                        {
                                            bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                                          DLL.getStuName(bookings.stuid) + "</td> <td>" +
                                                          bookings.datename.ToShortDateString() + "</td> <td>" +
                                                          DLL.getTeaName(bookings.teacherid) + "</td> <td>" + bookings.carid +
                                                          "</td> <td>" + DLL.getTimeName(bookings.timeid) + "</td></tr>";
                                        }
                                    }
                                }
                                else if (days != 0)
                                {
                                    count++;
                                    if (count <= days)
                                    {
                                        for (int k = 0; k <= 4; k++)
                                        {
                                            if (flag[k] == 1)
                                            {
                                                bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                                              DLL.getStuName(bookings.stuid) + "</td> <td>" +
                                                              bookings.datename.ToShortDateString() + "</td> <td>" +
                                                              DLL.getTeaName(bookings.teacherid) + "</td> <td>" +
                                                              bookings.carid +
                                                              "</td> <td>" + DLL.getTimeName(bookings.timeid) +
                                                              "</td></tr>";
                                            }
                                        }
                                    }
                                    if (count == days)
                                    {
                                        for (int n = 1; n <= carscount - days; n++)
                                        {
                                            for (int k = 0; k <= 4; k++)
                                            {
                                                if (flag[k] == 1)
                                                {
                                                    bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                                                  "" + "</td> <td>" +
                                                                  "" + "</td> <td>" +
                                                                  "" + "</td> <td>" + "" +
                                                                  "</td> <td>" + "" + "</td></tr>";
                                                }
                                            }
                                        }
                                        count = 0;
                                    }
                                }
                                //if (days == 2)
                                //{

                                //}
                                //else if (days == 1)
                                //{
                                //    for (int k = 0; k <= 4; k++)
                                //    {
                                //        if (flag[k] == 1)
                                //        {
                                //            bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                //                          DLL.getStuName(bookings.stuid) + "</td> <td>" +
                                //                          bookings.datename.ToShortDateString() + "</td> <td>" +
                                //                          DLL.getTeaName(bookings.teacherid) + "</td> <td>" + bookings.carid +
                                //                          "</td> <td>" + DLL.getTimeName(bookings.timeid) + "</td></tr>";
                                //            bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                //                     "" + "</td> <td>" +
                                //                     "" + "</td> <td>" +
                                //                     "" + "</td> <td>" + "" +
                                //                     "</td> <td>" + "" + "</td></tr>";
                                //            bookingsmsg = bookingsmsg + "<tr " + colors[k] + "><td>" +
                                //                     "" + "</td> <td>" +
                                //                     "" + "</td> <td>" +
                                //                     "" + "</td> <td>" + "" +
                                //                     "</td> <td>" + "" + "</td></tr>";
                                //        }
                                //    }
                                //}
                                //else if (days == 0)
                                //{

                                //}



                            }
                            bookingsmsg = bookingsmsg + "</table></div></div>";

                            #endregion

                            context.Response.Write(bookingsmsg);
                        }
                    }
                    else
                    {
                        context.Response.Write("505");
                    }
                }
                else if (flags == 2)
                {
                    string stuid = context.Request.Params["stuid"].ToString();
                    //string stuid = "15515735821";
                    DataTable stu_dt = new DataTable();
                    stu_dt = DLL.getStuById(stuid);
                    stu stu = new stu();
                    //id, stuid, password, teaid, stuname, phonenum, sex, address, grade, indentification, isdelete
                    if (stu_dt == null | stu_dt.Rows.Count <= 0)
                    {
                        //��û�и�ѧԱ��Ϣ
                        context.Response.Write("-1");
                    }
                    else
                    {
                        foreach (DataRow row in stu_dt.Rows)
                        {
                            stu.stuid = row["stuid"].ToString();
                            stu.password = row["password"].ToString();
                            stu.teaid = row["teaid"].ToString().ToString();
                            stu.stuname = row["stuname"].ToString();
                            stu.phonenum = row["phonenum"].ToString();
                            stu.sex = row["sex"] == DBNull.Value ? "" : row["sex"].ToString();
                            stu.address = row["address"] == DBNull.Value ? "" : row["address"].ToString();
                            stu.grade = row["grade"] == DBNull.Value ? "" : row["grade"].ToString();
                            stu.indentification = row["indentification"].ToString();
                        }
                        string stustr = stu.stuid + "," + stu.password + "," + stu.teaid.ToString() + "," +
                                        DLL.getTeaName(stu.teaid.ToString()) + "," + stu.stuname + "," + stu.phonenum +
                                        "," + stu.sex + "," + stu.address + "," + stu.grade + "," + stu.indentification;
                        context.Response.Write(stustr);
                    }
                }
                else if (flags == 3)
                {
                    //�������еĽ�����Ϣ
                    DataTable tea_dt = DLL.getTea();
                    string teaname = "";
                    string teaid = "";
                    string teastr = "";
                    if (tea_dt == null && tea_dt.Rows.Count <= 0)
                    {
                        //û����صĽ�����Ϣ
                        context.Response.Write("-1");
                    }
                    else
                    {
                        foreach (DataRow row in tea_dt.Rows)
                        {
                            teaname = row["teaname"].ToString();
                            teaid = row["teaid"].ToString();
                            teastr = teastr + teaname + "," + teaid + ".";
                        }
                    }
                    context.Response.Write(teastr);
                }
                else if (flags == 4)
                {
                    // stuid, password, teaid, stuname, phonenum, sex?, address?, grade?, indentification
                    //���һ��ѧԱ
                    stu stu = new stu();
                    stu.stuid = context.Request.Params["stuid"].ToString().Trim();
                    stu.password = context.Request.Params["password"].ToString().Trim();
                    stu.teaid = context.Request.Params["teaid"].ToString();
                    stu.stuname = context.Request.Params["stuname"].ToString().Trim();
                    stu.phonenum = context.Request.Params["phonenum"].ToString().Trim();
                    stu.sex = context.Request.Params["sex"].ToString().Trim();
                    stu.address = context.Request.Params["address"].ToString().Trim();
                    stu.grade = context.Request.Params["grade"].ToString().Trim();
                    stu.indentification = context.Request.Params["indentification"].ToString().Trim();
                    //stu.stuid ="5";
                    //stu.password ="3";
                    //stu.teaid ="3";
                    //stu.stuname ="3";
                    //stu.phonenum ="3";
                    //stu.sex ="" ;
                    //stu.address ="3";
                    //stu.grade ="3" ;
                    //stu.indentification ="3";
                    if (stu.stuid == "" | stu.password == "" | stu.teaid.ToString() == "" | stu.stuname == "" |
                        stu.stuname == "" | stu.phonenum == "" | stu.indentification == "")
                    {
                        //����������������ύ
                        context.Response.Write("-1");
                    }
                    else if (DLL.stuIsExit(stu.stuid))
                    {
                        //ѧԱ�Ѿ����ڲ����ظ����
                        context.Response.Write("-2");
                    }
                    else if (DLL.addNewStu(stu))
                    {
                        //ѧԱ��ӳɹ�
                        context.Response.Write("1");
                    }
                    else
                    {
                        //ѧԱ���ʧ��
                        context.Response.Write("-3");
                    }
                }
                else if (flags == 5)
                {
                    // stuid, password, teaid, stuname, phonenum, sex?, address?, grade?, indentification
                    //�޸�һ��ѧԱ
                    stu stu = new stu();
                    stu.stuid = context.Request.Params["stuid"].ToString().Trim();
                    stu.password = context.Request.Params["password"].ToString().Trim();
                    stu.teaid = context.Request.Params["teaid"].ToString();
                    stu.stuname = context.Request.Params["stuname"].ToString().Trim();
                    stu.phonenum = context.Request.Params["phonenum"].ToString().Trim();
                    stu.sex = context.Request.Params["sex"].ToString().Trim();
                    stu.address = context.Request.Params["address"].ToString().Trim();
                    stu.grade = context.Request.Params["grade"].ToString().Trim();
                    stu.indentification = context.Request.Params["indentification"].ToString().Trim();
                    //stu.stuid ="5";
                    //stu.password ="3";
                    //stu.teaid ="3";
                    //stu.stuname ="3";
                    //stu.phonenum ="3";
                    //stu.sex ="" ;
                    //stu.address ="3";
                    //stu.grade ="3" ;
                    //stu.indentification ="3";
                    if (stu.stuid == "" | stu.password == "" | stu.teaid.ToString() == "" | stu.stuname == "" |
                        stu.stuname == "" | stu.phonenum == "" | stu.indentification == "")
                    {
                        //����������������ύ
                        context.Response.Write("-1");
                    }
                    else if (!DLL.stuIsExit(stu.stuid))
                    {
                        //ѧԱid�����ڲ��ܽ����޸�
                        context.Response.Write("-2");
                    }
                    else if (DLL.updateNewStu(stu))
                    {
                        //ѧԱ�޸ĳɹ�
                        context.Response.Write("1");
                    }
                    else
                    {
                        //ѧԱ�޸�ʧ��
                        context.Response.Write("-3");
                    }
                }
                else if (flags == 6)
                {
                    // stuid, password, teaid, stuname, phonenum, sex?, address?, grade?, indentification
                    //ɾ��һ��ѧԱ
                    string stuid = context.Request.Params["stuid"].ToString().Trim();
                    if (stuid == "")
                    {
                        //����������������ύ
                        context.Response.Write("-1");
                    }
                    else if (!DLL.stuIsExit(stuid))
                    {
                        //ѧԱid�����ڲ��ܽ���ɾ��
                        context.Response.Write("-2");
                    }
                    else if (DLL.deleteStuById(stuid))
                    {
                        //ѧԱɾ���ɹ�
                        context.Response.Write("1");
                    }
                    else
                    {
                        //ѧԱɾ��ʧ��
                        context.Response.Write("-3");
                    }
                }
                else if (flags == 7)
                {
                    //����bookingҳ����Ϣ��ʵ�ֽ��ù���
                    //δ�������ʱ���״̬��Ϣ
                    //��ʽ��δ����һ������,״̬.δ���ڶ�������,״̬.δ������������,״̬
                    DateTime firstday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(1);
                    DateTime secondday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(2);
                    DateTime thirdday = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(3);
                    int firstdayStatus = DLL.getDatetimeStatus(firstday);
                    int seconddayStatus = DLL.getDatetimeStatus(secondday);
                    int thirddayStatus = DLL.getDatetimeStatus(thirdday);
                    string threedaystatus = firstday.ToShortDateString() + "," + firstdayStatus.ToString() + "." +
                                            secondday.ToShortDateString() + "," + seconddayStatus.ToString() + "." +
                                            thirdday.ToShortDateString() + "," + thirddayStatus.ToString();
                    //���ؽ�����״̬��Ϣ
                    //��ʽ����һλ��״̬��ʾ����111�����Ǵ��ڽ�����000������û��һ��������,����Ψһid,��������,״̬��Ϣ.����Ψһid,��������,״̬��Ϣ
                    DataTable tea_t = DLL.getBanTea();
                    string teasstatus = "111.";
                    if (tea_t != null && tea_t.Rows.Count > 0)
                    {
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
                                tea.isban = Convert.ToInt32(row["isban"].ToString());
                            }
                            //teastr = teastr + tea.id.ToString() + "," + tea.teaid + "," + tea.password + "," + tea.teaname + "," + tea.isdelete.ToString() + "," + tea.isban.ToString() + ","; 
                            teasstatus = teasstatus + tea.teaid.ToString() + "," + tea.teaname + "," +
                                         tea.isban.ToString() + ".";
                        }
                    }
                    else
                    {
                        teasstatus = "000.";
                    }
                    teasstatus = teasstatus.Remove(teasstatus.Length - 1, 1);
                    //���س���id,���ֺ�״̬��Ϣ
                    //��ʽ����һλ��״̬��ʾ����111�����Ǵ��ڳ�����Ϣ��000������û��һ��������Ϣ��,����Ψһid,��������,������������Ψһid,����������������,����״̬��Ϣ.����Ψһid,��������,������������Ψһid,����������������,����״̬��Ϣ
                    DataTable car_t = DLL.getBanCar();
                    string carsstatus = "111.";
                    if (car_t != null && car_t.Rows.Count > 0)
                    {
                        foreach (DataRow row in car_t.Rows)
                        {
                            car car = new car();
                            foreach (DataColumn column in car_t.Columns)
                            {
                                //id, carid, carname, teaid, isdelete, isban, peoplenum
                                //car.id = Convert.ToInt32(row["id"].ToString());
                                car.carid = row["carid"].ToString();
                                car.teaid = row["teaid"].ToString();
                                car.carname = row["carname"].ToString();
                                //car.isdelete = Convert.ToInt32(row["isdelete"].ToString());
                                car.isban = Convert.ToInt32(row["isban"].ToString());
                                //car.peoplenum = Convert.ToInt32(row["peoplenum"].ToString());
                            }
                            carsstatus = carsstatus + car.carid + "," + car.carname + "," + car.teaid + "," +
                                         DLL.getTeaName(car.teaid) + "," + car.isban.ToString() + ".";
                        }
                    }
                    else
                    {
                        carsstatus = "000.";
                    }
                    carsstatus = carsstatus.Remove(carsstatus.Length - 1, 1);
                    //����ʱ���id,���ֺ�״̬��Ϣ�������Ӧ�Ľ���
                    //��ʽ����һλ��״̬��ʾ����111�����Ǵ���ʱ�����Ϣ��000������û��һ��ʱ�����Ϣ��,ʱ��Ψһid,ʱ�������,ʱ�����������Ψһid,ʱ���������������,ʱ���״̬��Ϣ.ʱ��Ψһid,ʱ�������,ʱ�����������Ψһid,ʱ���������������,ʱ���״̬��Ϣ
                    DataTable time_t = DLL.getBanTime();
                    string timesstatus = "111.";
                    if (time_t != null && time_t.Rows.Count > 0)
                    {
                        time time = new time();
                        //timeid, timename,isban, teaid
                        foreach (DataRow row in time_t.Rows)
                        {
                            time.timeid = Convert.ToInt32(row["timeid"].ToString());
                            time.timename = row["timename"].ToString();
                            time.isban = Convert.ToInt32(row["isban"].ToString());
                            time.teaid = row["teaid"].ToString();
                            timesstatus = timesstatus + time.timeid.ToString() + "," + time.timename + "," + time.teaid +
                                          "," + DLL.getTeaName(time.teaid) + "," + time.isban + ".";
                        }
                    }
                    else
                    {
                        timesstatus = "000.";
                    }
                    timesstatus = timesstatus.Remove(timesstatus.Length - 1, 1);
                    //��ֹbookingҳ�涯̬���ݴ���
                    string bookingstatusstr = threedaystatus + ";" + teasstatus + ";" + carsstatus + ";" + timesstatus;
                    context.Response.Write(bookingstatusstr);
                }
                else if (flags == 8)
                {
                    string boookingstatus = context.Request.Params["bookingflags"].ToString();
                    if (boookingstatus == "1")
                    {
                        DateTime bantime = Convert.ToDateTime(context.Request.Params["bantime"].ToString());
                        int isban = Convert.ToInt32(context.Request.Params["isban"].ToString());
                        if (DLL.changeDatetimeStatus(bantime, isban) == true)
                        {
                            context.Response.Write("1");
                        }
                        else
                        {
                            context.Response.Write("-1");
                        }
                    }
                    else if (boookingstatus == "2")
                    {
                        string teaid = context.Request.Params["teaid"].ToString();
                        int isban = Convert.ToInt32(context.Request.Params["isban"].ToString());
                        if (DLL.changeTeaStatus(teaid, isban) == true)
                        {
                            context.Response.Write("1");
                        }
                        else
                        {
                            context.Response.Write("-1");
                        }
                    }
                    else if (boookingstatus == "3")
                    {
                        string carid = context.Request.Params["carid"].ToString();
                        string teaid = context.Request.Params["teaid"].ToString();
                        int isban = Convert.ToInt32(context.Request.Params["isban"].ToString());
                        if (DLL.changeCarStatus(teaid, isban, carid) == true)
                        {
                            context.Response.Write("1");
                        }
                        else
                        {
                            context.Response.Write("-1");
                        }
                    }
                    else if (boookingstatus == "4")
                    {
                        string timeid = context.Request.Params["timeid"].ToString();
                        string teaid = context.Request.Params["teaid"].ToString();
                        int isban = Convert.ToInt32(context.Request.Params["isban"].ToString());
                        if (DLL.changeTimeStatus(timeid, isban, teaid) == true)
                        {
                            context.Response.Write("1");
                        }
                        else
                        {
                            context.Response.Write("-1");
                        }
                    }


                }
                else if (flags == 9)
                {
                    #region MyRegion

                    //dsdd

                    #endregion

                    string stubanflags = context.Request.Params["stubanflags"].ToString();
                    if (stubanflags == "1")
                    {
                        //����ѧ����ͣ����
                        string stuid = context.Request.Params["stuid"].ToString();
                        //int isban =Convert.ToInt32( context.Request.Params["isban"].ToString());
                        if (DLL.stuIsExit(stuid))
                        {
                            if (DLL.stuHasBanned(stuid))
                            {
                                context.Response.Write("-2");
                            }
                            else
                            {
                                if (DLL.banStuThreeDay(stuid))
                                {
                                    //��ͣ����
                                    context.Response.Write("1");
                                }
                                else
                                {
                                    //��ͣʧ��
                                    context.Response.Write("1");
                                }
                            }
                        }
                        else
                        {
                            //û�и�ѧ����Ϣ
                            context.Response.Write("000");
                        }

                    }
                    else if (stubanflags == "2")
                    {
                        //����ѧ�����
                        string stuid = context.Request.Params["stuid"].ToString();
                        //int isban =Convert.ToInt32( context.Request.Params["isban"].ToString());
                        if (DLL.stuIsExit(stuid))
                        {
                            if (!DLL.stuHasBanned(stuid))
                            {
                                context.Response.Write("-2");
                            }
                            else
                            {
                                if (DLL.unblockedStuThreeDay(stuid))
                                {
                                    //����ɹ�
                                    context.Response.Write("1");
                                }
                                else
                                {
                                    //���ʧ��
                                    context.Response.Write("-1");
                                }
                            }
                        }
                        else
                        {
                            //�����ڸ�ѧ��
                            context.Response.Write("000");
                        }

                    }
                    else if (stubanflags == "3")
                    {
                        DataTable banstus = DLL.getAllBanStu();
                        string banstusstr = "";
                        if (banstus != null && banstus.Rows.Count > 0)
                        {
                            string stuid = "";
                            DateTime bantime = new DateTime();
                            int isban = 0;
                            int flag = 0;
                            foreach (DataRow row in banstus.Rows)
                            {
                                //stuid,bantime,isban
                                stuid = row["stuid"].ToString();
                                bantime = Convert.ToDateTime(row["bantime"].ToString());
                                isban = Convert.ToInt32(row["isban"].ToString());

                                if (
                                    DateTime.Compare(Convert.ToDateTime(DateTime.Now.ToShortDateString()),
                                                     Convert.ToDateTime(bantime.AddDays(3).ToShortDateString())) < 0)
                                {
                                    flag = 1;
                                    banstusstr = banstusstr + stuid + "," + DLL.getStuName(stuid) + "," +
                                                 bantime.ToShortDateString() + "," +
                                                 bantime.AddDays(3).ToShortDateString() + "," + isban.ToString() + ".";
                                }
                                else
                                {
                                    //���Ѿ����������ͬѧ�������
                                    DLL.unblockedStuThreeDay(stuid);
                                    continue;
                                }
                            }
                            if (flag == 1)
                            {
                                banstusstr = banstusstr.Remove(banstusstr.Length - 1, 1);
                                context.Response.Write(banstusstr);
                            }
                            else
                            {
                                context.Response.Write("000");
                            }
                        }
                        else
                        {
                            //�����ڷ�ͣѧ����Ϣ
                            context.Response.Write("000");
                        }
                    }

                }
                else if (flags == 10)
                {
                    int datetimeeditflags = Convert.ToInt32(context.Request.Params["datetimeeditflags"]);
                    if (datetimeeditflags == 1)
                    {
                        int datetimeday = -2;
                        //����δ��ԤԼ����
                        try
                        {
                            datetimeday = Convert.ToInt32(context.Request.Params["datetimeday"]);
                            if (datetimeday < 0)
                            {
                                //��������С��0�����������
                                context.Response.Write("-3");
                            }
                            else if (DLL.changeDatetimeDays(datetimeday) == true)
                            {
                                //����δ��ԤԼ�����ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //����δ��ԤԼ����ʧ��
                                context.Response.Write("-1");
                            }
                        }
                        catch
                        {
                            //������Ϣ��������������
                            context.Response.Write("-2");
                        }


                    }
                    if (datetimeeditflags == 2)
                    {
                        //�༭booking�޸�ҳ��
                        //���ȸ��ݵ�ǰ���������������г��������������״̬��ͨ�������������ֹĳһ���ԤԼ
                        int datetimedays = DLL.getDatetimeDays();
                        DateTime[] futuredays = new DateTime[datetimedays * 2];
                        for (int i = 0; i < futuredays.Length; i++)
                        {
                            futuredays[i] =
                                new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(i + 1);
                        }
                        string futuredaysstr = "";
                        for (int j = 0; j < futuredays.Length; j++)
                        {
                            if (DLL.getDatetimeStatus(futuredays[j]) == 1)
                            {
                                //������������״̬
                                futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",1;";
                            }
                            else
                            {
                                //�������Ѿ����ر�
                                futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",0;";
                            }
                        }
                        futuredaysstr = futuredaysstr.Remove(futuredaysstr.Length - 1, 1);
                        context.Response.Write(futuredaysstr);
                    }
                    if (datetimeeditflags == 3)
                    {
                        //��ֹ����
                        DateTime bandatetime = Convert.ToDateTime(context.Request.Params["bandatetime"]);
                        int isban = Convert.ToInt32(context.Request.Params["isban"]);
                        if (DLL.changeDatetimeStatus(bandatetime, isban) == true)
                        {
                            //��ֹ�ɹ�
                            context.Response.Write("1");
                        }
                        else
                        {
                            //��ֹʧ��
                            context.Response.Write("-1");
                        }
                    }

                }
                else if (flags == 11)
                {
                    //ʵ�ֽ�������ɾ��Ľ�ֹ
                    string teaname = "";
                    string teaid = "";
                    string teaeditsflags = context.Request.Params["teaeditsflags"].ToString();
                    if (teaeditsflags == "1")
                    {
                        //����һ������
                        teaname = context.Request.Params["teaname"].ToString();
                        if (teaname == "")
                        {
                            //������ϢΪ��
                            context.Response.Write("-2");
                        }
                        else
                        {
                            int tempflags = 0;
                            DateTime now = DateTime.Now;
                            //now.Hour >= 17
                            if (now.Hour >= SysEndtime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                                {
                                    //δ���ڶ��졢��������û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else if (now.Hour < SysStarttime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now) == true)
                                {
                                    //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else
                            {
                                //����Ա����ʱ�䲻������5�������9��֮ǰ
                                context.Response.Write("-4");
                            }
                            if (tempflags == 1)
                            {
                                if (DLL.addNewTea(teaname) == true)
                                {
                                    //���ӳɹ�
                                    context.Response.Write("1");
                                }
                                else
                                {
                                    //����ʧ��
                                    context.Response.Write("-1");
                                }
                            }
                        }
                    }
                    else if (teaeditsflags == "2")
                    {
                        //ɾ��һ������
                        teaid = context.Request.Params["teaid"].ToString();
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.deleteTeaByTeaid(teaid) == true)
                            {
                                //ɾ���ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //ɾ��ʧ��
                                context.Response.Write("-1");
                            }
                        }
                    }
                    else if (teaeditsflags == "3")
                    {
                        //�޸Ľ�����
                        teaid = context.Request.Params["teaid"].ToString();
                        teaname = context.Request.Params["teaname"].ToString();
                        if (DLL.updateTeaInfo(teaid, teaname) == true)
                        {
                            //�޸ĳɹ�
                            context.Response.Write("1");
                        }
                        else
                        {
                            //�޸�ʧ��
                            context.Response.Write("-1");
                        }
                    }
                    else if (teaeditsflags == "4")
                    {
                        //��ֹһ������
                        teaid = context.Request.Params["teaid"].ToString();
                        int isban = Convert.ToInt32(context.Request.Params["isban"]);
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.banTeaByTeaid(teaid, isban) == true)
                            {
                                //��ֹ�ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //��ֹʧ��
                                context.Response.Write("-1");
                            }
                        }
                    }
                }
                else if (flags == 12)
                {
                    //ʵ�ֽ�����������ɾ��Ľ�ֹ
                    string careditsflags = context.Request.Params["careditsflags"].ToString();
                    string carid = "";
                    string carname = "";
                    string teaid = "";
                    if (careditsflags == "1")
                    {
                        //����������
                        carid = context.Request.Params["carid"].ToString();
                        carname = context.Request.Params["carname"].ToString();
                        ;
                        teaid = context.Request.Params["teaid"].ToString();
                        if (carid == "" || carname == "" || teaid == "")
                        {
                            //����Ϊ�գ�����ʧ��
                            context.Response.Write("-2");
                        }
                        else
                        {
                            int tempflags = 0;
                            DateTime now = DateTime.Now;
                            if (now.Hour >= SysEndtime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                                {
                                    //δ���ڶ��졢��������û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else if (now.Hour < SysStarttime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now) == true)
                                {
                                    //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else
                            {
                                //����Ա����ʱ�䲻������5�������9��֮ǰ
                                context.Response.Write("-4");
                            }
                            if (tempflags == 1)
                            {
                                if (DLL.addNewCar(carid, carname, teaid) == true)
                                {
                                    //����ɹ�
                                    context.Response.Write("1");
                                }
                                else
                                {
                                    //����ʧ��
                                    context.Response.Write("-1");
                                }
                            }

                        }
                    }
                    else if (careditsflags == "2")
                    {
                        //������ɾ��
                        carid = context.Request.Params["carid"].ToString();
                        teaid = context.Request.Params["teaid"].ToString();
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.deleteCarByTeaid(carid, teaid) == true)
                            {
                                //ɾ���ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //ɾ��ʧ��
                                context.Response.Write("-1");
                            }
                        }
                    }
                    else if (careditsflags == "3")
                    {
                        //�������޸�
                        //�޸Ľ�����
                        carid = context.Request.Params["carid"].ToString();
                        teaid = context.Request.Params["teaid"].ToString();
                        carname = context.Request.Params["carname"].ToString();
                        if (DLL.updateCarInfo(carid, teaid, carname) == true)
                        {
                            //�޸ĳɹ�
                            context.Response.Write("1");
                        }
                        else
                        {
                            //�޸�ʧ��
                            context.Response.Write("-1");
                        }
                    }
                    else if (careditsflags == "4")
                    {
                        //��ֹ����
                        carid = context.Request.Params["carid"].ToString();
                        teaid = context.Request.Params["teaid"].ToString();
                        int isban = Convert.ToInt32(context.Request.Params["isban"]);
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.banCarByCarid(carid, teaid, isban) == true)
                            {
                                //��ֹ�ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //��ֹʧ��
                                context.Response.Write("-1");
                            }
                        }

                    }
                }
                else if (flags == 13)
                {
                    string timeeditsflags = context.Request.Params["timeeditsflags"].ToString();
                    if (timeeditsflags == "1")
                    {
                        //ʱ��ν�������
                        string timename = context.Request.Params["timename"].ToString();
                        string[] times = timename.Split('-');
                        if (times[0] == "" || times[1] == "")
                        {
                            //����Ϊ��
                            context.Response.Write("-2");
                        }
                        else
                        {
                            int tempflags = 0;
                            DateTime now = DateTime.Now;
                            if (now.Hour >= SysEndtime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                                {
                                    //δ���ڶ��졢��������û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else if (now.Hour < SysStarttime)
                            {
                                if (DLL.deleteBookingStructureIsResonable(now) == true)
                                {
                                    //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                    //�и�����,�����и����ݣ���ֹɾ��
                                    context.Response.Write("-3");
                                }
                                else
                                {
                                    tempflags = 1;
                                }
                            }
                            else
                            {
                                //����Ա����ʱ�䲻������5�������9��֮ǰ
                                context.Response.Write("-4");
                            }
                            if (tempflags == 1)
                            {
                                if (DLL.addNewTime(timename) == true)
                                {
                                    //���ӳɹ�
                                    context.Response.Write("1");
                                }
                                else
                                {
                                    //����ʧ��
                                    context.Response.Write("-1");
                                }
                            }

                        }
                    }
                    else if (timeeditsflags == "2")
                    {
                        //ʱ��ν���ɾ��
                        int timeid = Convert.ToInt32(context.Request.Params["timeid"]);
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.deleteTimeByTimeid(timeid) == true)
                            {
                                //ɾ���ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //ɾ��ʧ��
                                context.Response.Write("-1");
                            }
                        }
                    }
                    else if (timeeditsflags == "3")
                    {
                        //ʱ��ν����޸�
                        int timeid = Convert.ToInt32(context.Request.Params["timeid"]);
                        string timename = context.Request.Params["timename"].ToString();
                        if (DLL.updateTimeInfo(timeid, timename) == true)
                        {
                            //�޸ĳɹ�
                            context.Response.Write("1");
                        }
                        else
                        {
                            //�޸�ʧ��
                            context.Response.Write("-1");
                        }
                    }
                    else if (timeeditsflags == "4")
                    {
                        //ʱ��ν��н�ֹ
                        int timeid = Convert.ToInt32(context.Request.Params["timeid"]);
                        int isban = Convert.ToInt32(context.Request.Params["isban"]);
                        int tempflags = 0;
                        DateTime now = DateTime.Now;
                        if (now.Hour >= SysEndtime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now.AddDays(1)) == true)
                            {
                                //δ���ڶ��졢��������û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else if (now.Hour < SysStarttime)
                        {
                            if (DLL.deleteBookingStructureIsResonable(now) == true)
                            {
                                //δ����һ�졢�ڶ�����û�и�ʱ��ε�����
                                //�и�����,�����и����ݣ���ֹɾ��
                                context.Response.Write("-2");
                            }
                            else
                            {
                                tempflags = 1;
                            }
                        }
                        else
                        {
                            //����Ա����ʱ�䲻������5�������9��֮ǰ
                            context.Response.Write("-3");
                        }
                        if (tempflags == 1)
                        {
                            if (DLL.banTimeByTimeid(timeid, isban) == true)
                            {
                                //��ֹ�ɹ�
                                context.Response.Write("1");
                            }
                            else
                            {
                                //��ֹʧ��
                                context.Response.Write("-1");
                            }
                        }
                    }
                }
                else if (flags == 14)
                {
                    //��������ǰ̨��Ϣ
                    //������ʾδ��������ʱ��
                    int datetimedays = DLL.getDatetimeDays();
                    DateTime[] futuredays = new DateTime[datetimedays * 2];
                    for (int i = 0; i < futuredays.Length; i++)
                    {
                        futuredays[i] =
                            new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(i + 1);
                    }
                    string futuredaysstr = datetimedays.ToString() + ".";
                    for (int j = 0; j < futuredays.Length; j++)
                    {
                        if (DLL.getDatetimeStatus(futuredays[j]) == 1)
                        {
                            //������������״̬
                            futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",1.";
                        }
                        else
                        {
                            //�������Ѿ����ر�
                            futuredaysstr = futuredaysstr + futuredays[j].ToShortDateString() + ",0.";
                        }
                    }
                    futuredaysstr = futuredaysstr.Remove(futuredaysstr.Length - 1, 1);
                    //context.Response.Write(futuredaysstr);
                    string teastr = "";
                    DataTable tea_dt = DLL.getALLTea();
                    if (tea_dt == null || tea_dt.Rows.Count <= 0)
                    {
                        //û����ؽ���
                        teastr = "0.";
                    }
                    else
                    {
                        string teaid = "";
                        string teaname = "";
                        int isban = 0;
                        //����ؽ���
                        teastr = "1.";
                        foreach (DataRow row in tea_dt.Rows)
                        {
                            teaid = row["teaid"].ToString();
                            teaname = row["teaname"].ToString();
                            isban = DLL.teaIsban(teaid);
                            if (DLL.teaIsban(teaid) == -1)
                            {
                                //û�иý���
                                continue;
                            }
                            else
                            {
                                teastr = teastr + teaid + "," + teaname + "," + isban + ".";
                            }
                        }
                        teastr = teastr.Remove(teastr.Length - 1, 1);
                    }
                    DataTable car_dt = DLL.getALLCar();
                    string carstr = "";
                    if (car_dt == null || car_dt.Rows.Count <= 0)
                    {
                        //û����س���
                        teastr = "0.";
                    }
                    else
                    {
                        string carid = "";
                        string carname = "";
                        string teaid = "";
                        int isban = 0;
                        //����س���
                        carstr = "1.";
                        foreach (DataRow row in car_dt.Rows)
                        {
                            carid = row["carid"].ToString();
                            carname = row["carname"].ToString();
                            teaid = row["teaid"].ToString();
                            isban = Convert.ToInt32(row["isban"]);
                            carstr = carstr + carid + "," + carname + "," + teaid + "," + DLL.getTeaName(teaid) + "," +
                                     isban + ".";
                        }
                        carstr = carstr.Remove(carstr.Length - 1, 1);
                    }
                    DataTable time_dt = DLL.getAllTime();
                    string timestr = "";
                    if (time_dt == null || time_dt.Rows.Count <= 0)
                    {
                        //û�����ʱ���
                        timestr = "0.";
                    }
                    else
                    {
                        string timeid = "";
                        string timename = "";
                        int isban = 0;
                        //�����ʱ���
                        timestr = "1.";
                        foreach (DataRow row in time_dt.Rows)
                        {
                            timeid = row["timeid"].ToString();
                            timename = row["timename"].ToString();
                            isban = Convert.ToInt32(row["isban"]);
                            timestr = timestr + timeid + "," + timename + "," + isban + ".";
                        }
                        timestr = timestr.Remove(timestr.Length - 1, 1);
                    }
                    int carpeoplenum = DLL.getCarpeopleNumber();
                    string bookingstr = futuredaysstr + ";" + teastr + ";" + carstr + ";" + timestr + ";" + carpeoplenum;
                    context.Response.Write(bookingstr);
                }
                else if (flags == 15)
                {
                    noticeflags = context.Request.Params["noticeflags"].ToString();
                    if (noticeflags == "1")
                    {
                        DataTable notice_dt = DLL.getNotice();
                        string noticestr = "0,";
                        if (notice_dt == null || notice_dt.Rows.Count <= 0)
                        {
                            context.Response.Write(noticestr);
                        }
                        else
                        {
                            noticestr = "1,";
                            foreach (DataRow row in notice_dt.Rows)
                            {
                                noticestr = noticestr + row["msg"] + ",";
                            }
                            noticestr = noticestr.Remove(noticestr.Length - 1, 1);
                            context.Response.Write(noticestr);
                        }
                    }
                    else if (noticeflags == "2")
                    {
                        string firstnotice = context.Request.Params["firstnotice"].ToString();
                        string secondnotice = context.Request.Params["secondnotice"].ToString();
                        string thirdnotice = context.Request.Params["thirdnotice"].ToString();
                        string forthnotice = context.Request.Params["forthnotice"].ToString();
                        int i = 0;
                        if (firstnotice != "")
                        {
                            i++;
                        }
                        if (secondnotice != "")
                        {
                            i++;
                        }
                        if (thirdnotice != "")
                        {
                            i++;
                        }
                        if (forthnotice != "")
                        {
                            i++;
                        }
                        if (i != 0)
                        {
                            int j = 0;
                            string[] notice = new string[i];
                            if (firstnotice != "")
                            {
                                notice[j] = firstnotice;
                                j++;

                            }
                            if (secondnotice != "")
                            {
                                notice[j] = secondnotice;
                                j++;
                            }
                            if (thirdnotice != "")
                            {
                                notice[j] = thirdnotice;
                                j++;
                            }
                            if (forthnotice != "")
                            {
                                notice[j] = forthnotice;
                                j++;
                            }
                            if (DLL.insertNotice(notice) == true)
                            {
                                context.Response.Write("1");
                            }
                        }
                        else
                        {
                            context.Response.Write("0");
                        }

                    }
                    else
                    {


                    }



                }
                else if (flags == 16)
                {
                    string deletestubookingflags = context.Request.Params["deletestubookingflags"].ToString();
                    if (deletestubookingflags == "1")
                    {
                        #region
                        string seekId = context.Request.Params["seekId"].ToString();
                        string bookingstatus = "";
                        DateTime bookingtime;
                        DateTime time = DateTime.MaxValue;
                        DateTime date = DateTime.MaxValue;
                        DataTable dt = new DataTable();
                        if (seekId == "")
                        {
                            context.Response.Write("0");
                        }
                        else if (!DLL.stuIsExit(seekId))
                        {
                            //��ѧԱ������
                            context.Response.Write("-1");
                        }
                        else
                        {
                            dt = DLL.stuBookingStatus(seekId);
                            if (dt == null | dt.Rows.Count <= 0)
                            {
                                context.Response.Write("2");
                            }
                            else
                            {
                                int flag = 1;
                                foreach (DataRow row in dt.Rows)
                                {
                                    int i = 0;
                                    string temstr = "";
                                    foreach (DataColumn column in dt.Columns)
                                    {
                                        i++;
                                        if (i == 2)
                                        {
                                            temstr = temstr + DLL.getStuName(row[column].ToString()) + ",";
                                        }
                                        if (i == 3)
                                        {
                                            temstr = temstr + DLL.getTeaName(row[column].ToString()) + ",";
                                        }
                                        if (i == 6)
                                        {
                                            temstr = temstr + DLL.getTimeName(Convert.ToInt32(row[column].ToString())) + ".";
                                            string gettime = DLL.getTimeName(Convert.ToInt32(row[column].ToString()));
                                            //8:30-9:40
                                            string temptime = DLL.getThisTimeById(Convert.ToInt32(row[column].ToString()));
                                            string[] times = temptime.Split('-');
                                            time = Convert.ToDateTime(times[1]);
                                            bookingtime = new DateTime(date.Year, date.Month, date.Day, time.Hour,
                                                                       time.Minute, time.Second);
                                            if (DateTime.Compare(DateTime.Now, bookingtime) > 0)
                                            {
                                                flag = 0;
                                            }
                                            else
                                            {

                                            }
                                        }
                                        if (i == 1 || i == 4 || i == 5)
                                        {
                                            temstr = temstr + row[column].ToString() + ",";
                                            if (i == 5)
                                            {
                                                date = Convert.ToDateTime(row[column].ToString());
                                            }
                                        }
                                    }
                                    if (flag == 1)
                                    {
                                        bookingstatus = bookingstatus + temstr;
                                    }
                                }
                                //else
                                if (bookingstatus == "")
                                {
                                    //û�и�ѧԱ��Ԥ����Ϣ
                                    context.Response.Write("2");
                                }
                                else
                                {
                                    context.Response.Write(bookingstatus);
                                }
                            }
                        }
                        #endregion
                    }
                    else if (deletestubookingflags == "2")
                    {
                        int id = Convert.ToInt32(context.Request.Params["id"]);
                        DateTime bookingtime = Convert.ToDateTime(context.Request.Params["datetime"]);
                        //if (bookingtime.AddDays(-1).AddHours(12).CompareTo(DateTime.Now) < 0)
                        //{
                        //    //ȡ��ԤԼ��Ҫ��ԤԼ����ǰһ��12��00֮ǰ���
                        //    context.Response.Write("1");
                        //}
                        //else
                        //{
                        if (DLL.deleteThisBookingMessage(id))
                        {
                            //ȡ��ԤԼ��Ϣ�ɹ�
                            context.Response.Write("2");
                        }
                        else
                        {
                            //ȡ��ԤԼ��Ϣʧ��
                            context.Response.Write("3");
                        }
                        //}
                    }
                    else
                    {

                    }

                }
                else if (flags == 18)
                {
                    int carpeoplenum = -2;
                    //���ĳ���ÿ�����ԤԼ����
                    try
                    {
                        carpeoplenum = Convert.ToInt32(context.Request.Params["carpeoplenum"]);
                        if (carpeoplenum <= 0)
                        {
                            //��������С��0�����������
                            context.Response.Write("-3");
                        }
                        else if (DLL.updateCarpeopleNumber(carpeoplenum) == true)
                        {
                            //���ĳ���ÿ�����ԤԼ�����ɹ�
                            context.Response.Write("1");
                        }
                        else
                        {
                            //���ĳ���ÿ�����ԤԼ����ʧ��
                            context.Response.Write("-1");
                        }
                    }
                    catch
                    {
                        //������Ϣ��������������
                        context.Response.Write("-2");
                    }
                }
                else if (flags == 20)
                {
                    //�޸ĺ�̨ϵͳԤԼ��ʼ����ʱ��
                    try
                    {
                        int sysStartTime = Convert.ToInt32(context.Request.Params["sysStartTime"]);
                        int sysEndTime = Convert.ToInt32(context.Request.Params["sysEndTime"]);
                        //�����ʼʱ��Ƚ���ʱ�仹���򲻷����߼�
                        if(sysStartTime>=sysEndTime)
                            context.Response.Write("-1");
                        else if (sysStartTime < 0 || sysStartTime > 24 || sysEndTime < 0 || sysEndTime > 24)//�����ʱ��β��Ϸ�
                            context.Response.Write("-2");
                        else if (DLL.updateSysTime(sysStartTime, sysEndTime))//����Ϸ����޸ĳɹ�
                            context.Response.Write("1");
                        else context.Response.Write("-3");//ϵͳ�����޸�ʧ��
                    }
                    catch
                    {
                        //������Ϣ��������������
                        context.Response.Write("-4");
                    }
                   
                }
            }
            else
            {
                context.Response.Write("404");
            }
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