var feature = [
    {
        "id": 1,
        "text": "首页",
        "operate": "homePage",
        "attributes": {
            "url": "HomePage.html"
        }
    },{
        "id": 17,   
        "text": "校长管理",
        "operate": "Persion",
        "attributes": {
            "url": "system/Educational_Set.html"
        }
    },{
        "id": 18,   
        "text": "学校管理",
        "operate": "PersionSchool",
        "attributes": {
            "url": "system/School.html"
        }
    },{
        "id": 20,   
        "text": "资源管理",
        "operate": "Resource",
		"state":"closed",
        "children": [{
            "id": "201",
            "text": "知识点管理",
            "operate": "Knowledge",
            "attributes": {
                "url": "Admin/Knowledge.html"
            }
        }, {
            "id": "202",
            "text": "知识点内容组织",
            "operate": "KnowlgContent",
            "attributes": {
                "url": "Admin/KnowlgContent.html"
            }
		} 
        ] 
    },{
        "id": 2,   
        "text": "教务设置",
        "operate": "Educational_Set",
        "attributes": {
            "url": "School/Educational_Set.html"
        }
    },
    {
        "id": 3,
        "text": "校区管理",
        "operate": "School",
        "attributes": {
            "url": "School/School.html"
         }
    },
	{
         "id": 8,
         "text": "教师管理",
        
		 "operate": "Teacher",
         "attributes": {
             "url": "TeachingAffairs/Teacher_Ma.html"
         }
		 
    },
	{
         "id": 18,
         "text": "班级管理",
         "operate": "Teaching_My_class",
         "attributes": {
             "url": "TeachingAffairs/Teaching_MyClass.html"
         }
    },{
         "id": 19,
         "text": "报班管理",
         "operate": "Teaching_My_student",
         "attributes": {
             "url": "TeachingAffairs/Teaching_MyStudent.html"
         }
    }/*,{
         "id": 21,
         "text": "学生管理",
         "operate": "Teaching_My_studentes",
         "attributes": {
             "url": "TeachingAffairs/Teaching_MyStudentes.html"
         }
    }*/,
	{
        "id": 11,
        "text": "班级与学生管理",
        "operate": "MyClass_Student_1",
		"state":"closed",
		 "children": [{
            "id": "91",
            "text": "大班学生管理",
            "operate": "Big_Classes_Management",
            "attributes": {
                "url": "Student/Big_Classes_Management.html"
            }
        }, {
            "id": "92",
            "text": "一对一学生管理",
            "operate": "OneToOne_Student",
            "attributes": {
                "url": "Student/Class_Student.html"
            }
		} 
        ]
    },
	{
        "id": 12,
        "text": "试卷中心",
        "operate": "Test_Center",
		"state":"closed",
		 "children": [{
            "id": "120",
            "text": "试卷列表",
            "operate": "Test_List",
            "attributes": {
                "url": "TestCenter/GroupRollCenter.html"
            }
        },{
            "id": "121",
            "text": "智能组卷",
            "operate": "Noopsyche_Test",
            "attributes": {
                "url": "TestCenter/TestPaper.html"
            }
        }, {
            "id": "122",
            "text": "手动组卷",
            "operate": "Manually_Test",
            "attributes": {
                "url": "TestCenter/TestName.html"
            }
		} 
        ]
    },
	 
	{
        "id": 66,
        "text": "入学测评",
        "operate": "admission_Examination",
		"state":"closed",
		 "children": [{
            "id": "661",
            "text": "测试列表",
            "operate": "admission_Examination_List",
            "attributes": {
                "url": "admission/GroupRollCenter.html"
            }
        },{
            "id": "662",
            "text": "入学测试",
            "operate": "admission_Begin",
            "attributes": {
                "url": "admission/Teststart.html"
            }
        },{
            "id": "663",
            "text": "校区信息",
            "operate": "admission_zone",
            "attributes": {
                "url": "admission/admission_zone.html"
            }
        },{
            "id": "664",
            "text": "标准语管理",
            "operate": "admission_standard",
            "attributes": {
                "url": "admission/admission_standard.html"
            }
        } 
        ]
    },
	{
        "id": 13,
        "text": "测评派送",
        "operate": "Evaluation_To",
		"state":"closed",
		 "children": [{
            "id": "133",
            "text": "派送列表",
            "operate": "Send_List",
            "attributes": {
                "url": "SendCenter/SendList.html"
            }
        }, {
            "id": "131",
            "text": "选试卷派送",
            "operate": "Papers_To",
            "attributes": {
                "url": "SendCenter/Pager_Send.html"
            }
        }, {
            "id": "132",
            "text": "选学生派送",
            "operate": "Students_To",
            "attributes": {
                "url": "SendCenter/SendObjects.html"
            }
		} 
        ]
    },
	{
        "id": 14,
        "text": "测评批阅",
        "operate": "Assessment_Reviews",
        "attributes": {
            "url": "Reviews/GradingPaper.html"
        }
    },
	{
        "id": 4,
        "text": "学务报表",
		"state":"closed",
		 "children": [{
            "id": "41",
            "text": "教师批改统计",
            "operate": "Teacher_Corrects",
            "attributes": {
                "url": "Corrects/Teacher_Corrects.html"
            }
        }, {
            "id": "42",
            "text": "报班人次统计",
            "operate": "Students_Summary",
            "attributes": {
                "url": "Corrects/Students_Summary.html"
            }
		} , {
            "id": "44",
            "text": "在校人数统计",
            "operate": "school_students",
            "attributes": {
                "url": "Corrects/school_students.html"
           	}
		} , {
            "id": "43",
            "text": "学生测评统计",
            "operate": "Students_Work",
            "attributes": {
                "url": "Corrects/Students_Work.html"
           	}
		}
        ]
    },
	{
        "id": 45,
        "text": "查看批阅",
        "operate": "Assessment_Reader",
        "attributes": {
            "url": "Reviews/GradingPaper_Teaching.html"
        }
    },
	{
        "id": 10,
        "text": "测评作业监理",
        "operate": "Evaluation_Work",
        "attributes": {
            "url": "SendCenter/SendList.html"
        }
    },
	{
        "id": 7,
        "text":"能力维度管理",
        "operate":"Abilitys",
        "attributes": {
            "url": "School/Ability.html"
         }
    },
	
	{
        "id": 5,
        "text": "通知公告",
        "operate": "Informations",
        "attributes": {
            "url": "News/Informations.html"
         }
    },
	{
        "id": 515,
        "text": "小学选题",
        "operate": "select_xiaoxue",
        "attributes": {
            "url": "TestCenter/select_xiaoxue.html"
         }
    },
	{
        "id": 6,
        "text": "新闻管理",
        "operate": "News",
        "attributes": {
            "url": "News/News.html"
         }
    }
];