using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using jiaxiao.sql;
using System.Data;

/// <summary>
///DLL 的摘要说明
/// </summary>
namespace jiaxiao.dll
{
    public static class DLL
    {
        //判断登陆的学生信息是否存在
        public static bool stuIsExit(string username, string password)
        {
            //select COUNT(*)from stu where stuid='1' and password='1'  and isdelete=1
            string sql = "select COUNT(*)from stu where stuid='" + username + "'and password='" + password + "'" + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) >= 1)
            {
                return true;
            }
            return false;
        }
        //根据学生id判断登陆的学生信息是否存在
        public static bool stuIsExit(string username)
        {
            //select COUNT(*)from stu where stuid='1'  and isdelete=1
            string sql = "select COUNT(*)from stu where stuid='" + username + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) >= 1)
            {
                return true;
            }
            return false;
        }
        //判断登陆的教练信息是否存在
        public static bool teaIsExit(string username, string password)
        {
            //select COUNT(*)from tea where teaid='1' and password='1' and isdelete=1 and isban=1
            string sql = "select COUNT(*)from tea where teaid='" + username + "'and password='" + password + "'" + " and isdelete=1 and isban=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) >= 1)
            {
                return true;
            }
            return false;
        }
        //判断登陆的管理员信息是否存在
        public static bool adminIsExit(string username, string password)
        {
            //select COUNT(*)from admin where adminid='11111111111' and password='123'
            string sql = "select COUNT(*)from admin where adminid='" + username + "'and password='" + password + "'";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) >= 1)
            {
                return true;
            }
            return false;
        }
        //返回该学生预订练车的信息
        public static DataTable stuBookingStatus(string username)
        {
            //select *from booking where stuid='2' and isdelete=1 order by datename
            string sql = "select *from booking where stuid='" + username + "'and isdelete=1 order by datename desc";
            DataTable dt = SqlHelper.ExecuteDataTable(sql, CommandType.Text);
            return dt;
        }
        //将预订数据存到数据库中
        public static bool saveBookingMessage(booking bookings)
        {
            //insert into booking(stuid, teacherid, carid, datename, timeid) values('1','1','0501','2016-4-19',1,'2016-4-19')
            string sql = "insert into booking(stuid, teacherid, carid, datename, timeid,bookingtime) values('" + bookings.stuid + "','" + bookings.teacherid + "','" + bookings.carid + "','" + bookings.datename + "'," + bookings.timeid + ",'" + bookings.bookingtime + "')";
            //如果该预订时间段为当天最后一个时间段的话
            if (BookingMessageIsLast(bookings.timeid))
            {
                //插入人数上限减一的空数据
                string sqlEmpty = "insert into booking(stuid, teacherid, carid, datename, timeid,bookingtime) values('" + "00000000000" + "','" + bookings.teacherid + "','" + bookings.carid + "','" + bookings.datename + "'," + bookings.timeid + ",'" + bookings.bookingtime + "')";
                string sqlNum = "select COUNT(*) from booking where datename='" + bookings.datename + "' and teacherid='" + bookings.teacherid + "' and carid='" + bookings.carid + "'and timeid=" + bookings.timeid + " and isdelete=1";
                if ((int)SqlHelper.ExecuteScalar(sqlNum, CommandType.Text) > 0)
                {
                    //如果预订数据中有数据的话，则不在重复增加
                }
                else
                {
                    for (int i = 1; i <= getCarpeopleNumber() - 1; i++)
                    {
                        SqlHelper.ExecuteNonQuery(sqlEmpty, CommandType.Text);
                    }
                }
            }
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            { 
                return true;
            }
            return false;
        }
        //判断预订数据是否为改天最后一个时间段的数据
        public static bool BookingMessageIsLast(int timeid)
        {
            //select top 1 timeid  from time where isdelete=1 and isban=1  order by timeid desc
            string sql = "select top 1 timeid  from time where isdelete=1 and isban=1  order by timeid desc";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) == timeid)
            {
                return true;
            }
            return false;
        }

        //select *from booking where datename>dateadd(day,-2,getdate()) and isdelete=1 order by datename asc,teacherid,timeid asc,carid
        //获取最近5天的的学生预订信息
        public static DataTable getStuBookingMessageTop5()
        {
            //select *from booking where datename>dateadd(day,-2,getdate()) and isdelete=1 order by datename asc,teacherid,timeid asc,carid
            string sql = "select *from booking where datename>dateadd(day,-2,getdate()) and isdelete=1 order by datename asc,teacherid,timeid asc,carid";
            DataTable dt = SqlHelper.ExecuteDataTable(sql, CommandType.Text);
            return dt;
        }
        //获取所有的学生预订信息
        public static DataTable getStuBookingMessage()
        {
            //select *from booking where isdelete=1 order by datename asc,timeid asc,carid  
            string sql = "select *from booking where isdelete=1 order by datename asc,teacherid,timeid asc,carid";
            DataTable dt = SqlHelper.ExecuteDataTable(sql, CommandType.Text);
            return dt;
        }
        //获取学生的姓名
        public static String getStuName(string username)
        {
            //select stuname from stu where stuid='1'  and isdelete=1
            string sql = "select stuname from stu where stuid= '" + username + "'";
            string stuname = (string)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            return stuname;
        }
        //获取教练的姓名
        public static String getTeaName(string username)
        {
            //select stuname from stu where stuid='1'
            string sql = "select teaname from tea where teaid= '" + username + "'";
            string teaname = (string)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            return teaname;
        }
        //获取相对应的时间段
        public static String getTimeName(int time)
        {
            //select timename from time where timeid=1
            string sql = "select timename from time where timeid=" + time.ToString();
            string teaname = (string)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            return teaname;
        }
        //判断该场次是否已经被其他人预订
        public static bool carTimeIsHasBooked(booking bookings, int peoplenum = 1)
        {
            //select COUNT(*) from booking where datename='2016/4/20' and teacherid='2' and carid='0506'and timeid=1  and isdelete=1
            string sql = "select COUNT(*) from booking where datename='" + bookings.datename + "' and teacherid='" + bookings.teacherid + "' and carid='" + bookings.carid + "'and timeid=" + bookings.timeid + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > peoplenum - 1)
            {
                return true;
            }
            return false;
        }
        //得到车辆可以预订人数限制
        public static int getCarpeopleNumber()
        {
            //select top 1  peoplenum  from car where isdelete=1 and isban=1
            try
            {
                string sql = "select top 1  peoplenum  from car where isdelete=1 and isban=1";
                return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            }
            catch
            {
                //默认值为1
                return 1;
            }

        }
        //修改车辆预订人数限制
        public static bool updateCarpeopleNumber(int peoplenum)
        {
            //update car set peoplenum=3 where isdelete=1 and isban=1
            string sql = "update car set peoplenum=" + peoplenum.ToString() + " where isdelete=1 and isban=1";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //判断自己是否已经预订该日的任意场次
        public static bool iHasBookedDaytime(booking bookings)
        {
            //select *from booking where stuid='1' and datename='2016/4/20'  and isdelete=1
            string sql = "select COUNT(*) from booking where datename='" + bookings.datename + "' and stuid='" + bookings.stuid + "'" + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //判断自己是否选对自己的教练
        public static bool iHasChoiceRightTea(booking bookings)
        {
            //select COUNT(*)from stu where stuid='1' and teaid='2'  and isdelete=1
            string sql = "select COUNT(*)from stu where stuid='" + bookings.stuid + "' and teaid='" + bookings.teacherid + "'" + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) <= 0)
            {
                return true;
            }
            return false;
        }
        //获取该车的预约详细信息
        public static DataTable getThisCarBookingstatus(string carid, DateTime datename)
        {
            //select *from booking where carid='0506' and datename='2016/4/20' and isdelete=1
            //DataTable dt;
            string sql = "select *from booking where carid='" + carid + "' and datename='" + datename + "'" + " and isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获取教练的车辆人员动态预约信息
        public static DataTable getThisTeaCarBookingstatus(string teacherid, DateTime datename)
        {
            //select *from booking where datename='2016/4/21' and teacherid='1'  and isdelete=1
            // DataTable dt;
            string sql = "select *from booking where datename='" + datename + "' and teacherid='" + teacherid + "'" + " and isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //select COUNT(*)from time where isdelete=1 and isban=1
        //得到时间段划分的总个数
        public static int getTimeNum()
        {
            string sql = "select COUNT(*)from time where isdelete=1 and isban=1";
            return (int)SqlHelper.ExecuteScalar(sql,CommandType.Text);
        }
        //根据预订信息软删除学员指定预订信息
        public static bool deleteThisBookingMessage(booking bookings)
        {
            //update booking set isdelete=0 where stuid='1' and datename='2016/4/25' and teacherid='1' and carid='0506'and timeid=5;
            string sql = "update booking set isdelete=0 where stuid='" + bookings.stuid + "' and datename=" + bookings.datename + " and teacherid=" + bookings.teacherid + " and carid='" + bookings.carid + "'and timeid=" + bookings.timeid + ";";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        //根据id软删除学员指定预订信息
        public static bool deleteThisBookingMessage(int id)
        {
            //update booking set isdelete=0 where id=29;
            string sql = "update booking set isdelete=0 where id=" + id;
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        //根据时间段标记获得相应的时间段
        public static string getThisTimeById(int timeid)
        {
            //select timename from time where time='1'
            string sql = "select timename from time where timeid='" + timeid + "'";
            return SqlHelper.ExecuteScalar(sql, CommandType.Text).ToString();
        }
        //获得相应日期属性
        public static DataTable getDatetime()
        {
            //select *from datetime 
            string sql = "select *from datetime";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得相应的教练属性
        public static DataTable getTea()
        {
            //select id,teaname from tea where isdelete=1 and isban=1 
            string sql = "select teaid,teaname from tea where isdelete=1 and isban=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得未被删除的所有的教练属性
        public static DataTable getALLTea()
        {
            //select id,teaname from tea where isdelete=1 
            string sql = "select teaid,teaname from tea where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得全部教练和禁用状态
        public static DataTable getBanTea()
        {
            //select teaid,teaname,isban from tea where isdelete=1
            string sql = "select teaid,teaname,isban from tea where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得相应的教练的车的属性
        public static DataTable getCar(string teaid)
        {
            //select carid,carname from car where isdelete=1 and isban=1 and teaid=teaid
            string sql = "select carid,carname from car where isdelete=1 and isban=1 and teaid=" + teaid;
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //得到未被删除的所有教练的车的属性
        public static DataTable getALLCar()
        {
            //select carid,carname,teaid,isban from car where isdelete=1 order by teaid 
            string sql = "select carid,carname,teaid,isban from car where isdelete=1 order by teaid ";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得全部教练的车的属性和状态信息
        public static DataTable getBanCar()
        {
            //select teaid,carid,carname,isban from car where isdelete=1
            string sql = "select teaid,carid,carname,isban from car where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得相应的时间段属性
        public static DataTable getTime()
        {
            //select timeid,timename from time where isdelete=1 and isban=1
            string sql = "select timeid,timename from time where isdelete=1 and isban=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得所有未被删除相应的时间段属性
        public static DataTable getAllTime()
        {
            //select timeid,timename from time where isdelete=1
            string sql = "select timeid,timename,isban from time where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //获得全部时间的属性和状态信息
        public static DataTable getBanTime()
        {
            //select timeid,timename,teaid,isban from time where isdelete=1
            string sql = "select timeid,timename,teaid,isban from time where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //根据教练id获得相应的时间段属性
        public static DataTable getTime(string teaid)
        {
            //select timeid,timename from time where isdelete=1 and isban=1 and teaid='1'
            string sql = "select timeid,timename from time where isdelete=1 and isban=1 and teaid=" + teaid;
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //新增学员信息
        public static bool addNewStu(stu stu)
        {
            //insert into stu(stuid,password,stuname,sex,address,grade,phonenum,indentification,teaid) values('18737193716','218727','许世静','女','外地','大二','18737193716','410181199606218727',2)
            //stu.sex = stu.sex == "" ? (object)DBNull.Value : stu.sex;
            //stu.address = stu.address == "" ? null : stu.address;
            //stu.grade = stu.grade == "" ? null : stu.grade;
            string sql = "insert into stu(stuid,password,stuname,sex,address,grade,phonenum,indentification,teaid) values('" + stu.stuid + "','" + stu.password + "','" + stu.stuname + "','" + stu.sex + "','" + stu.address + "','" + stu.grade + "','" + stu.phonenum + "','" + stu.indentification + "','" + stu.teaid.ToString() + "')";
            //string sql = "insert into stu(stuid,password,stuname,sex,address,grade,phonenum,indentification,teaid) values('" + stu.stuid + "','" + stu.password + "','" + stu.stuname + "','" +  stu.phonenum + "','" + stu.indentification + "'," + stu.teaid.ToString() + ")";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //修改学生信息
        /// <summary>
        /// 修改学生信息
        /// </summary>
        /// <param name="stu"></param>
        /// <returns></returns>
        public static bool updateNewStu(stu stu)
        {
            //update stu set password='5',teaid='5',stuname='5',phonenum='5',sex='5',address='5',grade='5',indentification='5'  where stuid='5'
            string sql = " update stu set password='" + stu.password + "',teaid='" + stu.teaid + "',stuname='" + stu.stuname + "',phonenum='" + stu.phonenum + "',sex='" + stu.sex + "',address='" + stu.address + "',grade='" + stu.grade + "',indentification='" + stu.indentification + "'  where stuid='" + stu.stuid + "'";
            //string sql = "insert into stu(stuid,password,stuname,sex,address,grade,phonenum,indentification,teaid) values('" + stu.stuid + "','" + stu.password + "','" + stu.stuname + "','" +  stu.phonenum + "','" + stu.indentification + "'," + stu.teaid.ToString() + ")";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //根据学生id返回对应的学生信息
        public static DataTable getStuById(string stuid)
        {
            //select *from stu where stuid='1' and isdelete=1
            DataTable dt = new DataTable();
            string sql = "select *from stu where stuid='" + stuid + "' and isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //根据学生id删除对应的学生信息
        public static bool deleteStuById(string stuid)
        {
            //update stu set isdelete='0' where stuid='5'
            string sql = "update stu set isdelete='0' where stuid='" + stuid + "'";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                return true;
            return false;
        }
        //根据未来三天时间返回未来三天时间开启状态
        public static int getDatetimeStatus(DateTime datetime)
        {
            //select COUNT(*) from bandatetime where bantime='2016/5/1'
            //select isban from bandatetime where bantime='2016/5/3'
            string sql_count = "select COUNT(*) from bandatetime where bantime='" + datetime.ToShortDateString() + "'";
            string sql = "select isban from bandatetime where bantime='" + datetime.ToShortDateString() + "'";
            if ((int)SqlHelper.ExecuteScalar(sql_count, CommandType.Text) > 0)
            {
                //有过禁止状态，查看详细禁止状态，可能是1或者0
                return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            }
            else
            {
                //没有禁止过，正常状态是1
                return 1;
            }

        }
        //改变时间状态值
        public static bool changeDatetimeStatus(DateTime datetime, int isban)
        {
            //update bandatetime set  isban=1 where bantime='2016/5/5' 
            //select COUNT(*) from bandatetime where bantime='2016/5/1'
            //insert into bandatetime(bantime,isban) values('2016/5/6',1)
            string sql_count = "select COUNT(*) from bandatetime where bantime='" + datetime.ToString() + "'";
            if ((int)SqlHelper.ExecuteScalar(sql_count, CommandType.Text) > 0)
            {
                string sql = "update bandatetime set  isban=" + isban.ToString() + " where bantime='" + datetime.ToString() + "'";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
            }
            else
            {
                string sql_insert = "insert into bandatetime(bantime,isban) values('" + datetime.ToString() + "'," + isban.ToString() + ")";
                if (SqlHelper.ExecuteNonQuery(sql_insert, CommandType.Text) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return false;
        }
        //改变教练状态值
        public static bool changeTeaStatus(string teaid, int isban)
        {
            //update tea set  isban=1 where teaid='11111111111' 
            string sql = "update tea set  isban=" + isban.ToString() + " where teaid='" + teaid + "'";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //改变车辆状态值
        public static bool changeCarStatus(string teaid, int isban, string carid)
        {
            //update car set  isban=1 where teaid='1' and carid='0526'
            string sql = "update car set  isban=" + isban.ToString() + " where teaid='" + teaid + "'and carid='" + carid + "'";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //改变时间段状态值
        public static bool changeTimeStatus(string timeid, int isban, string teaid)
        {
            //update time set  isban=1 where timeid='1' and teaid='1'
            string sql = "update time set  isban=" + isban.ToString() + " where teaid='" + teaid + "'and timeid='" + timeid + "'";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //将该学生封停三天
        public static bool banStuThreeDay(string stuid)
        {
            //select COUNT(*) from stuban where stuid='1' and isdelete=1
            //update stuban set isban=0 where stuid='1'
            //insert into stuban(stuid, isban, bantime) values('1',0,'2016/5/4')
            //查询一下封禁表中有没有该同学信息
            string sql_count = "select COUNT(*) from stuban where stuid='" + stuid.ToString() + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql_count, CommandType.Text) > 0)
            {
                //有的话就更改状态值
                string sql = "update stuban set isban=0" + "where stuid='" + stuid.ToString() + "'";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
            }
            else
            {
                //没有的话就插入一条
                string sql_insert = "insert into stuban(stuid, isban, bantime) values('" + stuid + "',0,'" + new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second).ToString() + "')";
                if (SqlHelper.ExecuteNonQuery(sql_insert, CommandType.Text) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return false;
        }
        //解禁该学生封停状态
        public static bool unblockedStuThreeDay(string stuid)
        {
            //select COUNT(*) from stuban where stuid='1' and isdelete=1
            //update stuban set isban=0 where stuid='1'
            //insert into stuban(stuid, isban, bantime) values('1',0,'2016/5/4')
            //查询一下封禁表中有没有该同学信息
            string sql_count = "select COUNT(*) from stuban where stuid='" + stuid.ToString() + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql_count, CommandType.Text) > 0)
            {
                //有的话就更改状态值
                string sql = "update stuban set isdelete=0" + "where stuid='" + stuid.ToString() + "'";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
            }
            else
            {
                //没有的话该学生没有被封停
                return false;
            }
            return false;
        }
        //返回所有学生禁止信息
        public static DataTable getAllBanStu()
        {
            //select stuid,bantime,isban from stuban where isdelete=1
            DataTable dt = new DataTable();
            string sql = "select stuid,bantime,isban from stuban where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //该学生是否已经被封停
        public static bool stuHasBanned(string stuid)
        {
            //select COUNT(*) from stuban where isdelete=1 and isban=0 and stuid='1'
            //查询一下封禁表中有没有该同学信息
            string sql_count = "select COUNT(*) from stuban where isdelete=1 and isban=0 and stuid='" + stuid.ToString() + "'";
            if ((int)SqlHelper.ExecuteScalar(sql_count, CommandType.Text) > 0)
            {
                //该学生已被封停,禁止在进行操作
                return true;
            }
            return false;
        }
        //得到系统显示datetime的天数
        public static int getDatetimeDays()
        {
            //返回datetime天数
            //select days from datetimedays where isdelete=1 and isban=1
            //插入新更改的天数
            //insert into datetimedays(days) values(2)
            string sql = "select days from datetimedays where isdelete=1 and isban=1";
            DataTable datetimedays_dt = SqlHelper.ExecuteDataTable(sql, CommandType.Text);
            if (datetimedays_dt == null || datetimedays_dt.Rows.Count <= 0)
            {
                return 3;
            }
            else
            {
                return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            }
        }
        //更改未来预约天数
        public static bool changeDatetimeDays(int datetimedays)
        {
            //insert into datetimedays(days, edittime) values(2,'2016/5/8')
            //select days from datetimedays where isdelete=1 and isban=1
            string sql = "select * from datetimedays where isdelete=1 and isban=1";
            DataTable datetimedays_dt = SqlHelper.ExecuteDataTable(sql, CommandType.Text);
            if (datetimedays_dt == null || datetimedays_dt.Rows.Count <= 0)
            {
            }
            else
            {
                //未来预约天数里面还有数据,数据全部删除
                foreach (DataRow row in datetimedays_dt.Rows)
                {
                    //update datetimedays set isdelete=0,isban=0 where id=1
                    int timedaysid = (int)row["id"];
                    sql = "update datetimedays set isdelete=0,isban=0 where id=" + timedaysid;
                    if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) <= 0)
                    {
                        return false;
                    }
                }
            }
            //未来预约天数里面还没有数据，或者数据已经全部被删除的情况下，添加最新数据状态
            sql = "insert into datetimedays(days, edittime) values(" + datetimedays + ",'" + DateTime.Now.ToString() + "')";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) <= 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        //修改教练名字
        public static bool updateTeaInfo(string teaid, string teaname)
        {
            //update tea set teaname='于教练' where teaid='11111111111' and isdelete=1
            //select *from tea where teaid='11111111111' and isdelete=1
            string sql = "select COUNT(*)from tea where teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //确实有这个教练
                sql = "update tea set teaname='" + teaname + "' where teaid='" + teaid + "' and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                //没有这个教练
                return false;
            }
        }
        //增加一个教练
        public static bool addNewTea(string teaname)
        {
            //insert into tea(teaid, password, teaname) values('3','123','张教练')
            //select max(id) from tea
            string sql = "select max(id) from tea";
            string teaid = Convert.ToString((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) + 1);
            sql = "insert into tea(teaid, password, teaname) values('" + teaid + "','123','" + teaname + "')";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        //删除一个教练
        public static bool deleteTeaByTeaid(string teaid)
        {
            //update tea set isdelete=0,isban=0 where teaid='3'
            string sql = "select COUNT(*)from tea where teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该教练
                sql = "update tea set isdelete=0,isban=0 where teaid='" + teaid + "'";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //删除成功
                    return true;
                }
                else
                {
                    //删除失败
                    return false;
                }
            }
            else
            {
                //没有该教练
                //删除失败
                return false;
            }
        }
        //禁止一个教练
        public static bool banTeaByTeaid(string teaid, int isban)
        {
            //update tea set isban=0 where teaid='3' and isdelete=1
            string sql = "select COUNT(*)from tea where teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该教练
                sql = "update tea set isban=" + isban + " where teaid='" + teaid + "' and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //禁止成功
                    return true;
                }
                else
                {
                    //禁止失败
                    return false;
                }
            }
            else
            {
                //没有该教练
                //禁止失败
                return false;
            }
        }
        //增加某个教练的一辆车
        public static bool addNewCar(string carid, string carname, string teaid)
        {
            //insert into car(carid, carname, teaid) values('0501','奇瑞','2') 
            //select COUNT(*) from car where carid='0501' and teaid='2' and isdelete=1
            string sql = "select COUNT(*) from car where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //如果这个教练的车牌号的车辆已经存在
                //返回插入失败
                return false;
            }
            else
            {
                //如果这个教练的车牌号不存在
                sql = "insert into car(carid, carname, teaid) values('" + carid + "','" + carname + "','" + teaid +
                      "')";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //插入成功
                    return true;
                }
                else
                    //插入失败
                    return false;
            }
        }
        //删除一个教练的车辆通过教练id和车的id
        public static bool deleteCarByTeaid(string carid, string teaid)
        {
            //update car set isdelete=0,isban=0 where carid='0501' and teaid='2' 
            //select COUNT(*)from car where carid='0501' and teaid='2' and isdelete=1
            string sql = "select COUNT(*)from car where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该教练下的该车辆
                sql = "update car set isdelete=0,isban=0 where carid='" + carid + "' and teaid='" + teaid + "'";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //删除成功
                    return true;
                }
                else
                {
                    //删除失败
                    return false;
                }
            }
            else
            {
                //有该教练下的该车辆
                //删除失败
                return false;
            }
        }
        //修改一个教练的车辆的信息通过教练id和车的id
        public static bool updateCarInfo(string carid, string teaid, string carname)
        {
            //update tea set carname='桑普' where carid='0504' and teaid='2'  and isdelete=1
            //select *from car where carid='0501' and teaid='2' and isdelete=1
            string sql = "select COUNT(*)from car where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //确实有这个车辆进行修改
                sql = "update car set carname='" + carname + "' where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                //没有这个车牌号的车辆
                return false;
            }
        }
        //禁止某个教练的某个车辆
        public static bool banCarByCarid(string carid, string teaid, int isban)
        {
            //update car set isban=0 where carid='0501' and teaid='3' and isdelete=1
            string sql = "select COUNT(*)from car where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该教练下的这辆车
                sql = "update car set isban=" + isban + " where carid='" + carid + "' and teaid='" + teaid + "' and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //禁止成功
                    return true;
                }
                else
                {
                    //禁止失败
                    return false;
                }
            }
            else
            {
                //有该教练下的这辆车
                //禁止失败
                return false;
            }
        }
        //增加一个时间段
        public static bool addNewTime(string timename)
        {
            //insert into time(timeid,timename)values(8,'18:00-19:00') 
            //select max(id) from time
            string sql = "select max(id) from time";
            string timeid = Convert.ToString((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) + 1);
            //如果这个教练的车牌号不存在
            sql = "insert into time(timeid,timename)values(" + timeid + ",'" + timename + "') ";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
            {
                //插入成功
                return true;
            }
            else
            {
                //插入失败
                return false;
            }
        }
        //删除一个时间段
        public static bool deleteTimeByTimeid(int timeid)
        {
            //update time set isdelete=0,isban=0 where timeid=9

            //select COUNT(*)from time where timeid=9 and isdelete=1
            string sql = "select COUNT(*)from time where timeid=" + timeid + "and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该时间段存在
                sql = "update time set isdelete=0,isban=0 where timeid=" + timeid;
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //删除成功
                    return true;
                }
                else
                {
                    //删除失败
                    return false;
                }
            }
            else
            {
                //没有该时间段
                //删除失败
                return false;
            }
        }
        //修改一个时间段
        public static bool updateTimeInfo(int timeid, string timename)
        {
            //update time set timename='19:00-20:00' where timeid=9 and isdelete=1
            //select COUNT(*)from time where timeid=9 and isdelete=1
            string sql = "select COUNT(*)from time where timeid=" + timeid + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //确实有这个时间段进行修改
                sql = "update time set timename='" + timename + "' where timeid=" + timeid + "and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                //没有这个时间段
                return false;
            }
        }
        //禁止或者开启一个时间段
        public static bool banTimeByTimeid(int timeid, int isban)
        {
            //update time set isban=0 where timeid=8 and isdelete=1
            string sql = "select COUNT(*)from time where timeid=" + timeid + " and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                //有该时间段进行禁止
                sql = "update time set isban=" + isban + " where timeid=" + timeid + "and isdelete=1";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    //禁止成功
                    return true;
                }
                else
                {
                    //禁止失败
                    return false;
                }
            }
            else
            {
                //没有改时间段
                //禁止失败
                return false;
            }
        }
        public static int teaIsban(string teaid)
        {
            //select isban from tea where teaid='1' 
            string sql = "select COUNT(*)from tea where teaid='" + teaid + "' and isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                sql = "select isban from tea where teaid='" + teaid + "'";
                return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
            }
            else
            {
                return -1;
            }

        }

        public static DataTable getNotice()
        {
            //select msg from notice where isdelete=1
            string sql = "select msg from notice where isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //insertNotice
        public static bool insertNotice(string[] noticestr)
        {
            //insert into notice(msg) values('2')
            //update notice set isdelete=0 where isdelete=1
            string deletesql = "update notice set isdelete=0 where isdelete=1";
            int flag = 0;
            SqlHelper.ExecuteNonQuery(deletesql, CommandType.Text);
            for (int i = 0; i < noticestr.Length; i++)
            {
                string sql = "insert into notice(msg) values('" + noticestr[i] + "')";
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                {
                    flag++;
                }
            }
            if (flag == noticestr.Length)
            {

                return true;
            }
            else
            {
                return false;
            }
        }
        //未来几天booking有没有数据
        public static bool deleteBookingStructureIsResonable(DateTime starttime)
        {
            //select *from booking where (datename='2016-4-27' or datename='2016-4-29')  and isdelete='1' 
            //datename='2016-4-27' or datename='2016-4-29'
            string datestr = "";
            int futuredays = 7;
            for (int i = 1; i <= futuredays - 1; i++)
            {
                if (i == 1)
                {
                    datestr = datestr + "datename='" + starttime.AddDays(i).ToShortDateString() + "'";
                }
                else
                {
                    datestr = datestr + "or datename='" + starttime.AddDays(i).ToShortDateString() + "'";
                }
            }

            string sql = "select COUNT(*) from booking where (" + datestr + ") and isdelete='1' ";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //学生预订车辆是否选择相对应教练下的车辆
        public static bool stuBookingCarIsRight(string teaid, string carid)
        {
            //select *from car where teaid='1' and carid='5876' and isdelete='1'
            string sql = "select COUNT(*)from car where teaid='" + teaid + "' and carid='" + carid + "' and isdelete='1'";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
            {
                return true;
            }
            return false;
        }
        //将预订界面根据预订场次进行三天一次的分组
        public static int getDaysGroupByBookingTimeid(DateTime datename, string teacherid, int timeid)
        {
            //select COUNT(*)from booking where datename='2016-05-08' and timeid='1' and isdelete='1' and teacherid='1'
            string sql = "select COUNT(*)from booking where datename='" + datename.ToShortDateString() + "' and timeid='" + timeid + "' and isdelete='1' and teacherid='" + teacherid + "'";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //通过teaid获得车的数量
        public static int getCarsNumByTeaid(string teaid)
        {
            //select *from car where teaid='1' and isdelete='1' and isban='1'
            string sql = "select COUNT(*)from car where teaid='" + teaid + "' and isdelete='1' and isban='1'";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //select starttime,endtime from systime where isdelete=1
        //得到系统每天开放时间
        public static int getSysStarttime()
        {
            //select starttime from systime where isdelete=1
            string sql = "select starttime from systime where isdelete=1";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //得到系统每天结束时间
        public static int getSysEndtime()
        {
            //select endtime from systime where isdelete=1
            string sql = "select endtime from systime where isdelete=1";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //修改预约系统开放时间
        public static bool updateSysTime(int sysStartTime, int sysEndTime)
        {
            //update systime set isdelete=0 
            //insert into systime(starttime,endtime)values(2,3)
            try
            {
                string sqlupdate = "update systime set isdelete=0 ";
                SqlHelper.ExecuteNonQuery(sqlupdate, CommandType.Text);
                string sqlinsert = "insert into systime(starttime,endtime)values(" + sysStartTime + "," + sysEndTime + ")";
                SqlHelper.ExecuteNonQuery(sqlinsert, CommandType.Text);
                return true;
            }
            catch
            {
                return false;
            }
        }
        //-------------------评教系统数据连接
        //添加学生评教数据
        public static bool addEvalTeaInfo(int fuwutaidu, int jiaxuejineng, int chidaoqueqin, int chinakayaodis, int eyaneyuzhongshang, int zonghepingjia, string qitajianyi, int teaid, string stuid, int teaevaluationid, DateTime starttime, DateTime endtime, DateTime evalutiontime)
        {
            //insert into stuvaluetea(fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi, teaevaluationid, stuid, starttime, endtime, evalutiontime) values(1,1,1,1,1,1,'qitajianyi',1,'1','2016/9/30','2016/9/30','2016/9/30')
            string sql = "insert into stuvaluetea(fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi, teaid, stuid,teaevaluationid, starttime, endtime, evalutiontime) values(" + fuwutaidu + "," + jiaxuejineng + "," + chinakayaodis + "," + chidaoqueqin + "," + eyaneyuzhongshang + "," + zonghepingjia + ",'" + qitajianyi + "'," + teaid + "," + stuid + "," + teaevaluationid + ",'" + starttime + "','" + endtime + "','" + evalutiontime + "')";
            try
            {
                if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                    return true;
            }
            catch
            {
                //查询教练出现错误
                 return false;
            }
            return false;
        }
        //得到学生所属教练id
        public static int getTeaidByStuid(string stuid)
        {
            //select teaid from stu where stuid='1' and isdelete=1
            try
            {
                 string sql = "select teaid from stu where stuid='"+stuid+"' and isdelete=1";
                 return (int) SqlHelper.ExecuteScalar(sql, CommandType.Text);
            }
            catch
            {
                //查询教练出现错误
                 return -1;
            }
        }
        //select starttime from teaevaluation where id=2 and isdelete=1
        //select endtime from teaevaluation where id=2 and isdelete=1
        //得到评教系统开始时间
        public static DateTime getTeaValueStartTime(int teaevaluationid)
        {
            string sql = "select starttime from teaevaluation where id=" + teaevaluationid + "and isdelete=1";
            return (DateTime)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //得到评教系统结束时间
        public static DateTime getTeaValueEndTime(int teaevaluationid)
        {
            string sql = "select endtime from teaevaluation where id=" + teaevaluationid + "and isdelete=1";
            return (DateTime)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //select COUNT(*) from stuvaluetea where stuid=1 and teaevaluationid=1 and isdelete=1
        //学生是否已经进行过评教
        public static bool IsHaveTeaEval(int teaevaluationid,string stuid)
        {
            string sql = "select COUNT(*) from stuvaluetea where stuid=" + stuid + " and teaevaluationid=" + teaevaluationid + " and isdelete=1";
            if ((int) SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
                return true;//如果已经评教过了
            return false;
        }
        //评教系统是否正在开放
        public static bool IsOpenTeaEval()
        {
            string sql = "select COUNT(*) from teaevaluation where isdelete=1";
            if ((int)SqlHelper.ExecuteScalar(sql, CommandType.Text) > 0)
                return true;//评教系统正在开放
            return false;//评教系统已经关闭
        }
        //得到评教开放的唯一id
        public static int getOpenTeaEvalId()
        {
            string sql = "select id from dbo.teaevaluation where isdelete=1";
            return (int) SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //返回评教系结束时间
          public static DateTime getOpenTeaEvalEndtime()
        {
            string sql = "select endtime from dbo.teaevaluation where isdelete=1";
              return (DateTime) SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //insert into teaevaluation(starttime,endtime) values('2016/9/30','2016/10/1')
        //update teaevaluation set isdelete=0
        //评教系统已经关闭，重新开启评教
        public static bool OpenTeaEval(DateTime starttime,DateTime endtime)
        {
            string sql = "insert into teaevaluation(starttime,endtime) values('" + starttime.ToString() + "','" + endtime.ToString()+ "')";
            if (SqlHelper.ExecuteNonQuery(sql,CommandType.Text)>0)
                return true;//评教系统添加一个新的评价成功
            return false;//评教系统添加一个新的评价失败
        }
        //update teaevaluation set isdelete=0
        public static bool CloseAllTeaEval()
        {
            string sql = "update teaevaluation set isdelete=0";
            if (SqlHelper.ExecuteNonQuery(sql, CommandType.Text) > 0)
                return true;//评教系统关闭成功
            return false;//评教系统关闭失败
        }
        //select fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi from stuvaluetea where teaevaluationid=2 and teaid=2 and isdelete=1
        //得到评价系统统计数据
        public static DataTable GetTeaEvalDataByTeaid(int teaevaluationid,string teaid)
        {
           // 服务态度，教学技能，纪律情况（有无无故迟到或缺勤情况，有无吃拿卡要情况，有无恶言恶语、中伤学员情况），综合评价，其他建议，教练唯一id,学生唯一id,评价结束时间，评价开始时间，评教时间
           // fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi

            string sql = "select fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi from stuvaluetea where teaevaluationid=" + teaevaluationid + " and teaid='" + teaid + "' and isdelete=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //看评价系统有没有相关数据
        public static int GetTeaEvalDataCount(int teaevaluationid)
        {
            string sql = "select COUNT(*)from stuvaluetea where teaevaluationid=" + teaevaluationid + " and isdelete=1";
            return (int)SqlHelper.ExecuteScalar(sql,CommandType.Text);
        }
        //select  teaid from dbo.tea where isdelete=1 and isban=1
        //得到教练相关信息
        public static DataTable GetTeas()
        {
            string sql = "select  teaid from dbo.tea where isdelete=1 and isban=1";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
        //得到当前评教系统唯一id
        //select top 1 id  from teaevaluation where isdelete=1
        public static int GetTeaEvalId()
        {
            string sql = "select top 1 id  from teaevaluation where isdelete=1";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //根据评教id,教师id,详细数据类型和数据级别进行统计个数
        //select COUNT(*)from stuvaluetea where teaevaluationid=2 and teaid=-1 and isdelete=1 and fuwutaidu=1
        public static int GetTeaEvalEachData(int teaevaluationid, int teaid,string datatype,int datanum)
        {
            string sql = "select top 1 id  from teaevaluation where isdelete=1";
            return (int)SqlHelper.ExecuteScalar(sql, CommandType.Text);
        }
        //select *from dbo.teaevaluation order by id desc
        //得到所有的评教详细情况
        public static DataTable GetAllTeaEvals()
        {
            string sql = "select *from dbo.teaevaluation order by id desc";
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text);
        }
    }
}