using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
///booking 的摘要说明
/// </summary>
public class booking
{
	public booking()
	{
		//
		//TODO: 在此处添加构造函数逻辑
		//
	}
    //id, stuid, teacherid, carid, datename, time
    public int id;
    public string stuid;
    public string teacherid;
    public string carid;
    public DateTime datename;
    public int timeid;
    public DateTime bookingtime;
    public int isdelete;
}