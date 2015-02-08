(function(window , $){
	//联系管理对象，主要负责查询数据
	var exerciseHandler = {
		
		webroot : Webversion+'/',
		
		query : function(queryName ,queryData , callback){
			var paramData = {};
			var queryUrl = this.webroot+'exercise_query?r='+$.getRom();
			switch(queryName){
				case 'nav':
					paramData.action = 'init';
					break;
				case 'zhuanti':
					paramData.action = 'zhuanti';
					break;
				case 'zhuanti_info':
					paramData.action = 'zhuanti_info';
					break;
				
				case 'zhuanti_question':
					paramData.action = 'zhuanti_question'	;
					break;
				case 'tongbu':
					paramData.action = 'tongbu';
					break;	
				case 'tongbu_info':
					paramData.action = 'tongbu_info';
					break;
				
				case 'tongbu_question':
					paramData.action = 'tongbu_question'	;
					break;
				case 'sync_question':
					paramData.action = 'sync_question'	;
					break;	
					
				case 'zhenti':
					paramData.action = 'zhenti';
					break;
				case 'exercise_and_exam_content':
					paramData.action = 'exercise_and_exam_content';
					break;	
				case 'zhenti_question':
					paramData.action = 'zhenti_question';
					break;
				case 'mingxiao':
					paramData.action = 'mingxiao';
					break;
					
				case 'mingxiao_question':
					paramData.action = 'mingxiao_question';
					break;
				case 'init_setting':
					paramData.action = 'init_setting';
					break;
				
			}
			
			for(var i in queryData){
				paramData[i] = queryData[i];
			}
			var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : 'GET',
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					XMLHttpRequest.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			})
		},
		
		add2haoti : function(subject_id , question_id ,dbtype, answer , callback){
			var queryUrl = this.webroot+'exercise_post?r='+$.getRom();
			 
			var paramData = {
				action : 'add2haoti',
				subject : subject_id,
				question : question_id,
				answer : answer,
				dbtype:dbtype
			};
			var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : 'POST',
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					XMLHttpRequest.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			});
		},
		
		saveRecord : function(data , callback){
			var queryUrl = this.webroot+'exercise_post?r='+$.getRom();
			var paramData = {
				action : 'saveRecord',
				data : data
			};
			var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : 'POST',
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			});
		},
		
		saveExamResult : function(data , callback){
			var queryUrl = this.webroot+'exercise_post?r='+$.getRom();
			var paramData = {
				action : 'saveExamResult',
				data : data
			};
			var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : 'POST',
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					XMLHttpRequest.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			});
		},
		saveExamResult_act : function(act,data , callback){
			var queryUrl = this.webroot+'exercise_post?r='+$.getRom();
			var paramData = {
				action : act,
				data : data
			};
			 var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : 'POST',
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					XMLHttpRequest.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			});
		},
		public_ajax : function(urlName,dataJSON,type,callback){
			var queryUrl = this.webroot+urlName;
			var paramData = dataJSON;
			var load_i = 0;
			$.ajax({
				url : queryUrl,
				type : type,
				data : paramData,
				beforeSend :function(XMLHttpRequest){
					load_i = layer.load('加载中...'); 
					XMLHttpRequest.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
				},
				success:function(data){
					if(data){
						callback(true , data);
					}else{
						callback(false , data);
					}
				},
				error: function (result) {
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				}
			});
		},
		
		init : function(){
		}		
	};
	
	//无尽练习模式，统计总共对错数，客观题进行答案判断，完成整个流程
	
	exerciseHandler.endlessExercise = {
		rightNum : 0,
		wrongNum : 0,
		currQuestion : null,
		currNum : 0,
		questionList : null,
		questionListTemp : null,
		queryData : null,
		q_typeP : null,
		q_difficultyP: null,
		haotiFlag : false,
		startTime : 0,
		startTime_some : '',
		begin : function(exerciseData , callback){
			this.rightNum = 0;
			this.wrongNum = 0;
			this.queryData = exerciseData;
			
			var _this = this;
			
			exerciseHandler.query('zhuanti_question' , exerciseData , function(flag , data){
				 
				if(!data.question || data.question.length == 0){
					layer.alert('该专题没有题目！', 8,'温馨提示');
					 
					return;
				}
				if(flag){
					
					_this.questionList= data.question;
					_this.currQuestion = data.question[0];
					_this.startTime = new Date().getTime();
					_this.onChangeQuestion && _this.onChangeQuestion(_this.currQuestion);
					callback(true , null);
				}else{
					layer.alert('加载题目失败！', 8,'温馨提示');
					callback(false , null);
					
				}
				
			});
			
		},
		tongbu_begin : function(action_str,flagT,exerciseData, callback){
			this.rightNum = 0;
			this.wrongNum = 0;
			this.q_typeP = null;
			this.q_difficultyP=null;
			this.queryData = exerciseData;
			var _this = this;
			this.startTime_some = 0;
			 
			//sync_question
			var action_name = action_str;
			var  exerciseData_temp = exerciseData;
			 
			if(action_name=='zhuanti_question'&&exerciseData.study_exercise_id!=0&&exerciseData.study_exercise_id!=undefined){ 
				action_name = 'exercise_and_exam_content';
				exerciseData_temp = {'study_exercise_id':exerciseData.study_exercise_id};
			}
			 
			exerciseHandler.query(action_name , exerciseData_temp , function(flag , data){
			 
				var temp_sub_list = [];
				if(action_str=='sync_question'){
					temp_sub_list = data.list;
				}else{
					 
					if(action_name=='exercise_and_exam_content'&&exerciseData.study_exercise_id!=0&&exerciseData.study_exercise_id!=undefined){
						 
						temp_sub_list = data.list.exam_list;
					}else{
						temp_sub_list = data.question;
					}
				}
				if(!temp_sub_list || temp_sub_list.length == 0){
					layer.alert('该模块没有题目！', 8,'温馨提示',function(){
						window.history.go(-1); 
					});
					
					return;
				}
				
				if(flag){
					var right_i = 0;
					var wrong_i = 0;
					var qtypeP = [];
					var qdifficultyP = [];
					var timesQs = '';
					if(flagT&&(exerciseData.study_exercise_id!=0&&exerciseData.study_exercise_id!=undefined)){
					 	
						var init_data =  Ajax_option('/exercise_query',{'action':'exercise_content','study_exercise_id':exerciseData.study_exercise_id},"GET",false);
						 	
							if((init_data.exercise_content!=null)){
								var temst = $.parseJSON(Base64.decode(init_data.exercise_content));
								timesQs = init_data.exercise_duration;
								/*var num_Ls = 5;
								if(action_str=='sync_question'){
									num_Ls = 5;	
								}else{
									num_Ls = 2;	
								}*/
								 
								if(temst!=""&&temst!=null&&temst!=undefined){
									var temp_sub_listTT = []; 
									$.each(temp_sub_list,function(q_i,q_n){
										if(action_name=='exercise_and_exam_content'&&exerciseData.study_exercise_id!=0&&exerciseData.study_exercise_id!=undefined){
											qtypeP.push(q_n.type_name);
											qdifficultyP.push(q_n.difficulty);	
										}
										$.each(temst,function(t_i,t_n){
											if(q_n.gid==t_n.id){
												//0(错),1(对)是主观题的判定  true(对) false(错)客观题的判
												if(t_n.flag==0||t_n.flag==false){
													wrong_i++;
												}else{
													right_i++;
												}
												q_n['user_answer'] = t_n.answer;
												q_n['user_flag'] = t_n.flag;
												q_n['user_start_time'] = new Date().getTime();
												q_n['user_end_time'] = new Date().getTime();
											}
										});
										temp_sub_listTT.push(q_n);
										 
									});
									 
									temp_sub_list = temp_sub_listTT;
								}
							}
						 
					}
					_this.q_typeP = qtypeP;
					_this.q_difficultyP=qdifficultyP;
					_this.rightNum = right_i;
					_this.wrongNum = wrong_i;
					
					_this.questionList= temp_sub_list;
					_this.currQuestion = temp_sub_list[0];
					_this.startTime = new Date().getTime();
					_this.startTime_some = timesQs;
					_this.onChangeQuestion && _this.onChangeQuestion(_this.currQuestion);
					callback(true , null);
					
				}else{
					layer.alert('加载题目失败！', 8,'温馨提示');
					 
					callback(false , null);
					
				}
				
			});
			
		},
		submitObjectiveAnswer : function(answer){
			if(this.currQuestion.type_name == '选择题' || this.currQuestion.type_name == '判断题'){
				var flag = false;
				if(this.currQuestion.objective_answer == answer){
					this.rightNum ++ ;
					flag = true;
				}else{
					this.wrongNum ++;
					flag = false;
					
				}
				this.currQuestion.user_answer = answer;
				this.currQuestion.user_flag = flag;
				this.currQuestion.user_start_time = this.startTime;
				this.currQuestion.user_end_time = new Date().getTime();
				this.onSubmitAnswer && this.onSubmitAnswer('objective' , flag);
			}
		},
		
		submitSubjectiveAnswer : function(flag ,answer){
			if(flag){
				this.rightNum ++ ;
			}else{
				this.wrongNum ++;
			}
			this.currQuestion.user_answer = answer;
			this.currQuestion.user_flag = flag;
			this.currQuestion.user_start_time = this.startTime;
			this.currQuestion.user_end_time = new Date().getTime();
			this.onSubmitAnswer && this.onSubmitAnswer('subjective' , flag);
		},
		
		saveAnswer : function(answer){
			this.currQuestion.user_answer = answer;
		},
		
		next : function(){
			if(this.currNum < this.questionList.length - 1){
				this.currNum++;
				this.currQuestion = this.questionList[this.currNum];
				this.onChangeQuestion && this.onChangeQuestion(this.currQuestion);
			}
		},
		
		prev : function(){
			if(this.currNum > 0){
				this.currNum--;
				this.currQuestion = this.questionList[this.currNum];
				this.onChangeQuestion && this.onChangeQuestion(this.currQuestion);
			}
		},
		
		jump : function(index){
			if(index >=0 && index < this.questionList.length){
				this.currNum = index;
				this.currQuestion = this.questionList[this.currNum];
				this.startTime = new Date().getTime();
				this.onChangeQuestion && this.onChangeQuestion(this.currQuestion);
			}
		},
		
		end : function(data , callback){
			var updateInfo = [];
			
			for(var i in this.questionList){
				if(this.questionList[i].user_answer){
					updateInfo.push({
						id : this.questionList[i].id,
						time_start : this.questionList[i].user_start_time,
						time_end : this.questionList[i].user_end_time,
						answer : this.questionList[i].user_answer,
						correct : this.questionList[i].user_flag,
						comefrom : 'pc',
						subject_id : data.subject_id
					});
				}
			}
			
			if(updateInfo.length == 0){
				callback(true , null);
				return;
			}
			
			exerciseHandler.saveRecord(updateInfo , function(flag ,data){
				if(flag){
					callback(true , data);
				}else{
					callback(false , data);
				}
			});
			
		},
		
		add2haoti : function(subject_id ,dbtype, answer , callback){
			if(!this.haotiFlag){
				exerciseHandler.add2haoti(subject_id , this.currQuestion.id ,dbtype, answer , function(flag , data){
					if(flag){
						exerciseHandler.endlessExercise.haotiFlag = true;
					}
					callback(flag , data);
				});
			}else{
				layer.alert('已经加入好题本！', 8,'温馨提示');
				 
			}
		},
		
		onChangeQuestion : null,
		onSubmitAnswer : null
	};
	
	//考试模式，提供计时器，客观题判卷，得分
	exerciseHandler.examExercise = {
		score : 0,
		exam_id : 0,
		subject_id : 0,
		question_list : null,
		clock : null,
		clockTimer : null,
		start_time : 0,
		use_time : 0,
		show_time : '',
		
		
		begin : function(sss){
			var _this = this;
			
			if(sss){
				this.start_time = parseInt(new Date().getTime())-(parseInt(sss)+3)*1000;	
			}else{
				this.start_time = new Date().getTime();	
			}
			this.clockTimer = setInterval(function(){
				_this.use_time = parseInt((new Date().getTime() - _this.start_time)/1000);
				
//				_this.show_time = _
				var hours = parseInt(_this.use_time/3600);
				hours = hours>9 ? hours : '0'+hours;
				var minutes = parseInt(_this.use_time/60);
				minutes = minutes>60 ? minutes%60 : minutes;
				minutes = minutes>9 ? minutes : '0'+minutes;
				var seconds = parseInt(_this.use_time%60);
				seconds = seconds>9 ? seconds : '0'+seconds;
				_this.show_time = hours+':'+minutes+':'+seconds;
				
				_this.onTimer && _this.onTimer(_this.show_time);
			},900);
		},
		pause : function(){
			var _this = this;
			this.start_time = new Date().getTime();
			var sss = this.use_time ;
			this.clockTimer = setInterval(function(){
				_this.use_time = parseInt((new Date().getTime() - _this.start_time)/1000)+sss;
				
//				_this.show_time = _
				var hours = parseInt(_this.use_time/3600);
				hours = hours>9 ? hours : '0'+hours;
				
				var minutes = parseInt(_this.use_time/60);
				minutes = minutes>60 ? minutes%60 : minutes;
				minutes = minutes>9 ? minutes : '0'+minutes;
				
				var seconds = parseInt(_this.use_time%60);
				seconds = seconds>9 ? seconds : '0'+seconds;
				
				_this.show_time = hours+':'+minutes+':'+seconds;
				
				_this.onTimer && _this.onTimer(_this.show_time);
			},900);
			
		},
		end : function(){
			clearInterval(this.clockTimer);
			
		},
		
		loadExamData : function(exam_id ,subject_id, callback){
			this.exam_id = exam_id;
			this.subject_id = subject_id;
			var _this = this;
			
			exerciseHandler.query('zhenti_question' , {'exam_id':exam_id,'subject_id':subject_id}, function(flag , data){
				if(flag){
					_this.question_list = data.question_data;
				}
				callback(flag,data);
			});
		},
		loadExamData_M : function(exam_id ,subject_id, callback){
			this.exam_id = exam_id;
			this.subject_id = subject_id;
			var _this = this;
			
			exerciseHandler.query('mingxiao_question' , {'exam_id':exam_id,'subject_id':subject_id}, function(flag , data){
				if(flag){
					_this.question_list = data.question_data;
				}
				callback(flag,data);
			});
		},
		
		uploadExamResult : function(data , callback){
			
			exerciseHandler.saveExamResult(data , function(flag , data){
				callback(flag , data);
			});
			
			
		},
		
		uploadExamResult_act : function(act,data , callback){
			
			exerciseHandler.saveExamResult_act(act,data , function(flag , data){
				callback(flag , data);
			});
			
			
		},
		
		onTimer : null
	};
	
	window.exerciseHandler = exerciseHandler;
	
})(window , window.jQuery);


