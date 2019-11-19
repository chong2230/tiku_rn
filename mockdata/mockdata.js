/**
* 题库数据
**/
const MockData = {

	'/question/list': {
        "code":0,
        "data":[
			{
				"id": 1,
				"myAnswers": ["A,B", "D"]
			},
            {
                "id": 2,
                "myAnswers": ["C", "A"]
            }
		],
        "msg":"SUCCESS"
	},
	'/question/info': {
    	"code":0,
	    "data":{
	        "analysis":[
	            "1.D『解析』选项A、B、C属于企业银行存款日记账的账面余额小于银行对账单余额的情形。"
	        ],
	        "analysisImg":[

	        ],
	        "answers":[
	            "D"
	        ],
	        "answersImg":[

	        ],
	        "choices":[
	            {
	                "a":"A.企业开出支票，银行尚未支付",
	                "b":"B.企业开出银行汇票，对方尚未到银行承兑",
	                "c":"C.银行代收款项，企业尚未接到收款通知",
	                "d":"D.企业车辆违章被罚款200元，银行已经扣款，但企业未接到扣款通知"
	            }
	        ],
	        "comments":"",
	        "courseId":1,
	        "gmtCreate":"2019-10-30 00:16:57.0",
	        "gmtModified":"2019-10-30 00:16:57.0",
	        "hasCollect":0,
	        "id":2,
	        "image":"",
	        "level":"较难",
	        "myAnswers":[

	        ],
	        "name":"",
	        "paperId":1,
	        "professionId":1,
	        "question":"1. 编制银行存款余额调节表时，下列未达账项中，会导致企业银行存款日记账的账面余额大于银行对账单余额的是（）。",
	        "questionImg":"",
	        "score":1.5,
	        "status":1,
	        "type":"单选题"
	    },
	    "msg":"SUCCESS"
	},
	// 最新版
	'/question/info': {
        "code": 0,
        "data": {
            "askList": [
                {
                    "analysis": "1.D『解析』选项A、B、C属于企业银行存款日记账的账面余额小于银行对账单余额的情形。",
                    "analysisImg": "",
                    "answer": "D",
                    "answerImg": "",
                    "choiceA": "A.企业开出支票，银行尚未支付",
                    "choiceB": "B.企业开出银行汇票，对方尚未到银行承兑",
                    "choiceC": "C.银行代收款项，企业尚未接到收款通知",
                    "choiceD": "D.企业车辆违章被罚款200元，银行已经扣款，但企业未接到扣款通知",
                    "choiceE": "",
                    "comments": "",
                    "courseId": 1,
                    "courseName": "",
                    "gmtCreate": "2019-10-31 20:44:37.0",
                    "gmtModified": "2019-10-31 20:44:37.0",
                    "id": 1,
                    "myAnswer": "",
                    "paperId": 1,
                    "paperName": "",
                    "professionId": 1,
                    "professionName": "",
                    "question": "",
                    "questionId": 1,
                    "questionImg": "",
                    "score": 1.5,
                    "status": 1
                }
            ],
            "comments": "",
            "courseId": 1,
            "gmtCreate": "2019-10-31 20:44:37.0",
            "gmtModified": "2019-10-31 20:44:37.0",
            "hasCollect": 0,
            "id": 1,
            "image": "",
            "level": "较难",
            "name": "",
            "paperId": 1,
            "professionId": 1,
            "score": 1.5,
            "status": 1,
            "type": "单选题"
        },
        "msg": "SUCCESS"
    },
	// 专业列表
	'/profession/list': {
	    "code":0,
	    "data":[
	        {
	            "comments":"各种会计考试",
	            "courseCategory":[
	                {
	                    "courses":[
	                        {
	                            "category":"初级",
	                            "comments":"",
	                            "gmtCreate":"2019-10-10 00:00:00.0",
	                            "gmtModified":"2019-10-10 00:00:00.0",
	                            "id":1,
	                            "image":"",
	                            "name":"初级会计师1",
	                            "professionId":1,
	                            "status":1
	                        },
	                        {
	                            "category":"初级",
	                            "comments":"",
	                            "gmtCreate":"2019-10-10 00:00:00.0",
	                            "gmtModified":"2019-10-10 00:00:00.0",
	                            "id":5,
	                            "image":"",
	                            "name":"初级会计师2",
	                            "professionId":1,
	                            "status":1
	                        }
	                    ],
	                    "name":"初级"
	                },
	                {
	                    "courses":[
	                        {
	                            "category":"中级",
	                            "comments":"",
	                            "gmtCreate":"2019-10-10 00:00:00.0",
	                            "gmtModified":"2019-10-10 00:00:00.0",
	                            "id":2,
	                            "image":"",
	                            "name":"中级会计师",
	                            "professionId":1,
	                            "status":1
	                        }
	                    ],
	                    "name":"中级"
	                },
	                {
	                    "courses":[
	                        {
	                            "category":"高级",
	                            "comments":"",
	                            "gmtCreate":"2019-10-10 00:00:00.0",
	                            "gmtModified":"2019-10-10 00:00:00.0",
	                            "id":3,
	                            "image":"",
	                            "name":"高级会计师",
	                            "professionId":1,
	                            "status":1
	                        }
	                    ],
	                    "name":"高级"
	                }
	            ],
	            "id":1,
	            "image":"",
	            "name":"会计专业",
	            "status":1
	        },
	        {
	            "comments":"各种通信考证",
	            "courseCategory":[
	                {
	                    "courses":[
	                        {
	                            "category":"默认",
	                            "comments":"",
	                            "gmtCreate":"2019-10-10 00:00:00.0",
	                            "gmtModified":"2019-10-10 00:00:00.0",
	                            "id":4,
	                            "image":"",
	                            "name":"系统分析师",
	                            "professionId":2,
	                            "status":1
	                        }
	                    ],
	                    "name":"默认"
	                }
	            ],
	            "id":2,
	            "image":"",
	            "name":"通信专业",
	            "status":1
	        }
	    ],
	    "msg":"SUCCESS"
	},
	// 科目列表
	'/course/list': {
	    "code":0,
	    "data":[
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":1,
	            "image":"",
	            "name":"初级会计师1",
	            "professionId":1,
	            "status":1
	        },
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":2,
	            "image":"",
	            "name":"中级会计师",
	            "professionId":1,
	            "status":1
	        },
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":3,
	            "image":"",
	            "name":"高级会计师",
	            "professionId":1,
	            "status":1
	        },
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":4,
	            "image":"",
	            "name":"系统分析师",
	            "professionId":2,
	            "status":1
	        },
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":5,
	            "image":"",
	            "name":"初级会计师2",
	            "professionId":1,
	            "status":1
	        }
	    ],
	    "msg":"SUCCESS"
	},
	// 选择科目 params: {professionId, category}
	'/course/list': {
	    "code":0,
	    "data":[
	        {
	            "courses":[
	                {
	                    "category":"中级",
	                    "comments":"",
	                    "gmtCreate":"2019-10-10 00:00:00.0",
	                    "gmtModified":"2019-10-10 00:00:00.0",
	                    "id":2,
	                    "image":"",
	                    "name":"中级会计师",
	                    "professionId":1,
	                    "status":1
	                }
	            ],
	            "name":"中级"
	        }
	    ],
	    "msg":"SUCCESS"
	},
	'/home/slide': {
	    "code":0,
	    "msg":"SUCCESS",
	    "data":[
	        {
	            "image":"img/basic_algorithm/56e63f3528134a50a19412cdf21bcc38.png",
	            "columnId":5,
	            "columnTitle":"数据结构基础"
	        },
	        {
	            "image":"img/basic_algorithm/fa30311a5df1403686ad04a8b3a1485d.png",
	            "columnId":12,
	            "columnTitle":"排序算法"
	        },
	        {
	            "image":"img/front_end/0ce4133110344d8d8b84999f73e19d9f.png",
	            "columnId":11,
	            "columnTitle":"React入门"
	        }
	    ]
	},
	'/home/functions': {
	    "code":0,
	    "data":[
	        {
	            "chargeable":1,
	            "id":1,
	            "image":"/img/icon/entrance_4.png",
	            "name":"每日一练",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":2,
	            "image":"/img/icon/entrance_5.png",
	            "name":"历年真题",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":3,
	            "image":"/img/icon/entrance_6.png",
	            "name":"模拟试卷",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":4,
	            "image":"",
	            "name":"章节练习",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":5,
	            "image":"",
	            "name":"知识点练习",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":6,
	            "image":"",
	            "name":"高频考点",
	            "type":"试卷列表",
	            "usable":1
	        },
	        {
	            "chargeable":1,
	            "id":7,
	            "image":"",
	            "name":"高频错题",
	            "type":"试卷列表",
	            "usable":1
	        }
	    ],
	    "msg":"SUCCESS"
	},
	'/home/my': {
	    "code":0,
	    "data":{
	        "accuracy":0,
	        "contents":[
	            {
	                "id":11,
	                "image":"",
	                "title":"试题收藏"
	            },
	            {
	                "id":12,
	                "image":"",
	                "title":"做题记录"
	            },
	            {
	                "id":13,
	                "image":"",
	                "title":"错题库"
	            },
	            {
	                "id":14,
	                "image":"",
	                "title":"题库笔记"
	            }
	        ]
	    },
	    "msg":"SUCCESS"
	},

	// 题库列表 params: {functionId:1}
	'/home/functionInfo': {
	    "code":0,
	    "data":[
	        {
	            "comments":"",
	            "courseId":1,
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":1,
	            "image":"",
	            "level":"初级",
	            "name":"2019年10月15日每日一练",
	            "professionId":1,
	            "status":1,
	            "type":"客观题"
	        },
	        {
	            "comments":"",
	            "courseId":1,
	            "gmtCreate":"2019-10-10 00:00:00.0",
	            "gmtModified":"2019-10-10 00:00:00.0",
	            "id":2,
	            "image":"",
	            "level":"初级",
	            "name":"2019年10月16日每日一练",
	            "professionId":1,
	            "status":1,
	            "type":"客观题"
	        }
	    ],
	    "msg":"SUCCESS"
	},
	'/exam/list': {
	    "code":0,
	    "msg":"SUCCESS",
	    "data":{
	    	list: [
		        {
	                id: 1,
	                name: '系统分析师'
	            },
	            {
	                id: 2,
	                name: '信息系统项目管理师'
	            },
	            {
	                id: 3,
	                name: '网络规划设计师'
	            },
	            {
	                id: 4,
	                name: '系统架构设计师'
	            },
	            {
	                id: 5,
	                name: '系统规划与管理师'
	            }
		    ]
		}
	},
	'/category/list': {
	    "code": 0,
	    "msg": "",
	    "data": {        
	        list: [ // 考试分类
	            {
	                id: 1,
	                name: '软考',
	                sublist: [
	                    {
	                        id: 1,
	                        name: '软考高级',
	                        contents: [
	                            {
	                                id: 1,
	                                name: '系统分析师'
	                            },
	                            {
	                                id: 2,
	                                name: '信息系统项目管理师'
	                            },
	                            {
	                                id: 3,
	                                name: '网络规划设计师'
	                            },
	                            {
	                                id: 4,
	                                name: '系统架构设计师'
	                            },
	                            {
	                                id: 5,
	                                name: '系统规划与管理师'
	                            },
	                        ]
	                    },
	                    {
	                        id: 2,
	                        name: '软考中级'
	                    },
	                    {
	                        id: 3,
	                        name: '软考初级'
	                    }
	                ]
	            },
	            {
	                id: 2,
	                name: '通信',
	                contents: [
	                    {
	                        id: 1,
	                        name: '初级通信工程师'
	                    },
	                    {
	                        id: 2,
	                        name: '中级通信工程师'
	                    }
	                ]
	            },
	            {
	                id: 3,
	                name: '建筑工程'
	            },
	            {
	                id: 4,
	                name: '会计'
	            },
	            {
	                id: 5,
	                name: '药师'
	            }
	        ]
	    }
	},
	'/subject/list': {
	    "code":0,
	    "data":[
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-01 11:57:32.0",
	            "gmtModified":"2019-10-01 11:57:32.0",
	            "id":1,
	            "image":"",
	            "level":"初级会计职称",
	            "status":1,
	            "subtitle":"",
	            "title":"2019年10月09日经济法基础每日一练",
	            "type":"客观题"
	        },
	        {
	            "comments":"",
	            "gmtCreate":"2019-10-01 11:57:32.0",
	            "gmtModified":"2019-10-01 11:57:32.0",
	            "id":2,
	            "image":"",
	            "level":"初级会计职称",
	            "status":1,
	            "subtitle":"",
	            "title":"2019年10月08日经济法基础每日一练",
	            "type":"客观题"
	        }
	    ],
	    "msg":"SUCCESS"
	},
	'/timu/info': {
	    "code": "0",
	    "msg": "",
	    "data": {
	        id: 1,
	        content: "IP报头包括哪些内容？",
	        category: "单选题",   // 单选题、多选题、判断题、问答题
	        imgs: ["timu/icon/1.png", "timu/icon/2.png"],    // 题目附带图片
	        choices: [
	            {
	                A: "内部人为风险",
	                B: "黑客攻击",
	                C: "设备损耗",
	                D: "病毒破坏",
	                E: "外部人为风险",    // 预留，多选
	            },
	            {
	                A: "隧道模型",
	                B: "报名模式",
	                C: "传输模式",
	                D: "压缩模式",
	            }
	        ],    
	        answers: ['A', 'B'],    // 回答   
	    }
	},
	'/subject/buy': {
		"code": 0,
	    "msg": "",
	    "data": {
	        balance: 100
	    }
	},
	'/subject/result': {
	    "code": 0,
	    "msg": "",
	    "data": {
	        totalCount: 10, // 总题数
	        rightCount: 4,  // 正确题数
	        wrongCount: 6,  // 错误题数
	        undoCount: 0,   // 未做题数
	        score: 55,      // 得分
	        totalScore: 100,    // 总分
	        costTime: 52,       // 答题时间，分钟
	        averageScore: 58,   // 平均得分
	    }
	},
	'/timu/analyse': {
	    "code": 0,
	    "msg": "",
	    "data": {
	        id: 1,
	        type: 1,        // 题库类型，1 客观题 2 主观题
	        content: "IP报头包括哪些内容？",
	        subtype: "1",   // subtype对应初级、中级、高级
	        imgs: ["timu/icon/1.png", "timu/icon/2.png"],    // 题目附带图片
	        choices: [
	            {
	                A: "",
	                B: "",
	                C: "",
	                D: "",
	                E: "",    // 预留，多选
	                F: "",
	                G: "",
	                H: "",
	            },
	            {
	                A: "",
	                B: "",
	                C: "",
	                D: "",
	            }
	        ],    
	        answers: ['A', 'B'], 
	        daans: ['B', 'C'],   
	        daanImgs: ["answer/icon/1.png", "answer/icon/2.png"],     // 答案附带图片  
	        detail: "POA是对象实现与ORB其他组件之间的中介，它将客户请求传送到伺服对象，按需创建子POA，提供管理伺服对象的策略。"
	    }
	},
	'/news/list': {"code":0,"msg":"SUCCESS","data":[{"id":1907,"title":"Google Cloud 值多少钱？","subtitle":null,"createTime":"2019-10-07","times":null,"audioUrl":null,"isNew":1},{"id":1908,"title":"任正非：5G全套技术可无歧视独家许可给美国公司，人工智能导致新的财富分化","subtitle":null,"createTime":"2019-10-07","times":null,"audioUrl":null,"isNew":1},{"id":1906,"title":"乔布斯去世 8 年，Tim Cook 是一个合格的苹果 CEO 吗？","subtitle":null,"createTime":"2019-10-07","times":null,"audioUrl":null,"isNew":1},{"id":1905,"title":"密苏里州欲投资90亿美元，引入VHO建设超级高铁","subtitle":null,"createTime":"2019-10-07","times":null,"audioUrl":null,"isNew":1},{"id":1904,"title":"关于数据增强在机器翻译中的应用现状和前景，刘群、黄辉等专场探讨","subtitle":null,"createTime":"2019-10-06","times":null,"audioUrl":null,"isNew":1},{"id":1903,"title":"Instagram 上线 AR 试妆功能，能否开启下一个风口？","subtitle":null,"createTime":"2019-10-06","times":null,"audioUrl":null,"isNew":1},{"id":1901,"title":"为改进Pixel 4人脸解锁，谷歌供应商对“流浪汉”下手","subtitle":null,"createTime":"2019-10-06","times":null,"audioUrl":null,"isNew":1},{"id":1902,"title":"HTC 新任 CEO：已停止手机硬件创新，将寻觅 5G 终端机会","subtitle":null,"createTime":"2019-10-06","times":null,"audioUrl":null,"isNew":1},{"id":1900,"title":"挑战抖音，谷歌拟收购 Firework 火拼短视频应用市场","subtitle":null,"createTime":"2019-10-06","times":null,"audioUrl":null,"isNew":1},{"id":1899,"title":"论文发表了就万事大吉了？小心欠下「论文债」","subtitle":null,"createTime":"2019-10-05","times":null,"audioUrl":null,"isNew":1}]},
	'/home/list': {
        "code":0,
        "msg":"SUCCESS",
        "data":[
            {
                "title":"新闻资讯",
                "category":"news",
                "type":1,
                "contents":[
                    {
                        "id":2144,
                        "title":"专访商汤联合创始人林达华：CV 才刚刚开始，远没到鼎盛时期",
                        "subtitle":null,
                        "createTime":"2019-11-05",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2141,
                        "title":"假如谷歌的“量子优越性”是一场革命，我们还应该知道什么？",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2143,
                        "title":"爱奇艺发布 FASPell: 产学界最强的简繁中文拼写检查工具",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2142,
                        "title":"深度学习求解「三体」问题，计算速度提高一亿倍",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2139,
                        "title":"美光是一家AI芯片公司？",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2140,
                        "title":"人机协同平台实力加冕，云从科技打造AI的行业逻辑",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2136,
                        "title":"OKEx合约大数据——巧用基差和多空比，玩转比特币合约",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2138,
                        "title":"首届入选者已开始IPO 第三届【AI最佳掘金案例年度评选】如期而至！",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2137,
                        "title":"4万亿餐饮消费市场，吉野家的数字化转型方法论 | 最佳实践案例",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    },
                    {
                        "id":2135,
                        "title":"平安人寿斩获国际顶尖人工智能竞赛三项世界第一",
                        "subtitle":null,
                        "createTime":"2019-11-04",
                        "times":null,
                        "audioUrl":null,
                        "isNew":1
                    }
                ]
            },
            {
                "title":"基础算法",
                "category":"basic_algorithm",
                "type":2,
                "contents":[
                    {
                        "id":5,
                        "title":"数据结构基础",
                        "subtitle":"实用，简洁易懂的理论知识",
                        "coverImage":"img/basic_algorithm/9984c11897da45949fcd949b4c18217a.png",
                        "image":"img/basic_algorithm/8bdd497ef21c42d5b0e618d004ef9d83.png",
                        "authorName":"Jordan",
                        "authorAvatarImage":"img/basic_algorithm/Q9Syru01.png",
                        "authorTitle":"前京东工程师",
                        "isNew":0,
                        "articleId":146,
                        "articleTitle":"19 | 广度优先搜索算法",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":19,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-09-25 21:16:01.0",
                        "gmtModified":"2019-05-13 16:22:21.0"
                    },
                    {
                        "id":12,
                        "title":"排序算法",
                        "subtitle":"介绍常见的排序算法",
                        "coverImage":"img/basic_algorithm/44b9435803404326a55d2f5eeb23cc1f.png",
                        "image":"img/basic_algorithm/34b980c4e50747b183451394c452f357.png",
                        "authorName":"Jordan",
                        "authorAvatarImage":"img/basic_algorithm/x1wUQukc.png",
                        "authorTitle":"算法工程师",
                        "isNew":0,
                        "articleId":204,
                        "articleTitle":"11 | 基数排序（Radix Sort）",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":11,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-26 20:17:05.0",
                        "gmtModified":"2019-05-13 16:28:00.0"
                    },
                    {
                        "id":14,
                        "title":"查找算法",
                        "subtitle":"常见查找算法揭秘",
                        "coverImage":"img/basic_algorithm/cc87ede2212d4bc1891daa58e869b71a.png",
                        "image":"img/basic_algorithm/7648d4c6b32c45d3a4d6c804290b70fb.png",
                        "authorName":"Jordan",
                        "authorAvatarImage":"img/basic_algorithm/N5QqwKBp.png",
                        "authorTitle":"算法工程师",
                        "isNew":0,
                        "articleId":224,
                        "articleTitle":"11 | 哈希查找",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":11,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-28 20:59:56.0",
                        "gmtModified":"2019-05-13 16:28:16.0"
                    }
                ]
            },
            {
                "title":"前端集粹",
                "category":"front_end",
                "type":2,
                "contents":[
                    {
                        "id":10,
                        "title":"jQuery1.6.1源码分析系列",
                        "subtitle":"",
                        "coverImage":"img/front_end/38f7e769f81d4237b08e0821d59289a1.jpg",
                        "image":"img/front_end/5cefaa0469c84cd7a5bc9fa359dc1ae7.jpg",
                        "authorName":"nuysoft/高云",
                        "authorAvatarImage":"img/front_end/a451c7d2c4324456909d3c2a0d4cb3e3.jpg",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":289,
                        "articleTitle":"19 - DOM遍历-Traversing-3个核心函数",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-23 15:46:00.0",
                        "gmtModified":"2018-12-18 21:45:20.0"
                    },
                    {
                        "id":11,
                        "title":"React入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/0ce4133110344d8d8b84999f73e19d9f.png",
                        "image":"img/front_end/c1ae5dabc59948b9840c870f6e15df91.png",
                        "authorName":"henu_xk126com",
                        "authorAvatarImage":"img/front_end/cd37e8d183534145876552e59d31ef77.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":200,
                        "articleTitle":"7 | 数据交互",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-25 20:06:52.0",
                        "gmtModified":"2019-06-04 15:59:40.0"
                    },
                    {
                        "id":13,
                        "title":"Vue 入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/6b686f2156524b04a1af572b6ae4dd47.jpg",
                        "image":"img/front_end/449fdb59f299435f96c5bfbaab3c612f.png",
                        "authorName":"Evan You",
                        "authorAvatarImage":"img/front_end/cdd60158e324412bbc5c9cec1885e43b.jpeg",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":885,
                        "articleTitle":"32 | 深入响应式原理",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-27 16:22:29.0",
                        "gmtModified":"2019-05-23 09:54:41.0"
                    },
                    {
                        "id":17,
                        "title":"Flutter入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/e7e40d24cd0e433890848fb409193eb7.jpg",
                        "image":"img/front_end/0e38ddd7f6c248bdb38b1c38fea1db61.png",
                        "authorName":"Google",
                        "authorAvatarImage":"img/front_end/64ad28da915b43748902e7fec7b934e4.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":353,
                        "articleTitle":"07 | 自定义插件",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2019-01-08 18:32:41.0",
                        "gmtModified":"2019-06-04 15:58:25.0"
                    },
                    {
                        "id":21,
                        "title":"Vuex入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/de9ba8cef5a74788bec97c75d080d8e1.png",
                        "image":"img/front_end/95dc1958aa864d21ab51dcb34017d492.png",
                        "authorName":"Evan You",
                        "authorAvatarImage":"img/front_end/0fe92ccbfa7046bd9fcb42f4ad011ff2.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":734,
                        "articleTitle":"14 | 热重载",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2019-04-29 14:39:17.0",
                        "gmtModified":"2019-04-30 10:13:51.0"
                    },
                    {
                        "id":22,
                        "title":"webpack入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/nyI3Mori.png",
                        "image":"img/front_end/cWNxPCTO.png",
                        "authorName":"Tobias Koppers",
                        "authorAvatarImage":"img/front_end/fA3cKW3S.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":832,
                        "articleTitle":"23 | 集成(integrations)",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":23,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2019-05-13 03:10:22.0",
                        "gmtModified":"2019-05-13 15:35:32.0"
                    },
                    {
                        "id":23,
                        "title":"Vue.js 技术揭秘",
                        "subtitle":"",
                        "coverImage":"img/front_end/rAIJeYiY.jpg",
                        "image":"img/front_end/5iBVmcaD.png",
                        "authorName":"HuangYi",
                        "authorAvatarImage":"img/front_end/0rQlJMoN.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":977,
                        "articleTitle":"47 | 插件",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2019-05-30 18:14:48.0",
                        "gmtModified":"2019-05-30 18:51:09.0"
                    },
                    {
                        "id":24,
                        "title":"Node入门",
                        "subtitle":"",
                        "coverImage":"img/front_end/EvrSJQei.png",
                        "image":"img/front_end/DY3Fwi0I.jpg",
                        "authorName":"Nanqiao Deng",
                        "authorAvatarImage":"img/front_end/6XRfqrm5.png",
                        "authorTitle":"",
                        "isNew":0,
                        "articleId":996,
                        "articleTitle":"07 | 大示例",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2019-06-03 19:54:42.0",
                        "gmtModified":"2019-06-04 10:25:32.0"
                    }
                ]
            },
            {
                "title":"基础网络",
                "category":"network",
                "type":2,
                "contents":[
                    {
                        "id":15,
                        "title":"计算机网络基础知识",
                        "subtitle":"计算机网络基础知识总结",
                        "coverImage":"img/network/2e7363fd8ac5415b81d5c6203b9567a2.png",
                        "image":"img/network/e235477144124e2ea6ea417845dec22c.jpeg",
                        "authorName":"方俊",
                        "authorAvatarImage":"img/network/a130e37775bc40f8990ac7d3de62ce02.png",
                        "authorTitle":"网络工程师",
                        "isNew":0,
                        "articleId":253,
                        "articleTitle":"14 | 一个举例",
                        "updateTag":"",
                        "price":0,
                        "originalPrice":0,
                        "period":14,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-11-30 21:22:41.0",
                        "gmtModified":"2018-11-30 23:42:27.0"
                    }
                ]
            },
            {
                "title":"读书笔记",
                "category":"reading",
                "type":2,
                "contents":[
                    {
                        "id":16,
                        "title":"《深入理解Java虚拟机》-读书笔记",
                        "subtitle":"读书笔记",
                        "coverImage":"img/reading/7e954b74795d427f8e61f1851a65d395.png",
                        "image":"img/reading/fe3e6689af3742b2b4c416752154291f.png",
                        "authorName":"小村长",
                        "authorAvatarImage":"img/reading/a090ea9f3fda49b3965b1eb322f9514e.jpg",
                        "authorTitle":"某互联网企业高级开发工程师",
                        "isNew":0,
                        "articleId":300,
                        "articleTitle":"07 | 虚拟机类加载机制",
                        "updateTag":"暂无",
                        "price":0,
                        "originalPrice":0,
                        "period":0,
                        "times":0,
                        "orderNum":0,
                        "comments":"",
                        "videoUrl":"",
                        "videoCover":"",
                        "hadSub":null,
                        "gmtCreate":"2018-12-02 17:51:02.0",
                        "gmtModified":"2018-12-02 18:13:21.0"
                    }
                ]
            }
        ]
    },
}

export default MockData;
