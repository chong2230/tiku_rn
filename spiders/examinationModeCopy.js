var restTime; //做题剩余试卷  秒计算
var restTimerInterval; //保存倒计时
var paperOpenAnalysis = "Y"; //是否公开答案解析
var staticlw = false;
var submitUrl = port.api_port + '/uc/paper/submitExam.do'; //交卷接口
var testId = Kino.getUrlParam('testId'); //测试id
var lwcurid = "";
$(function() {

  var subjectCode = Kino.getUrlParam('subjectCode'); //subjectCode
  var sjId = Kino.getUrlParam('sjId'); //sjId试卷id
  //笔记
  $("#paperWrap").on("click",".note",function() {
    var dataId = $('.stId').attr('data-stId');
    var ansUrl = port.api_port + '/uc/interactContent/loadQuestionNote.do';
    Kino.ajax(ansUrl, function (resp) {
        if (resp.resultCode == "SUCCESS") {
          $(".bijixq").show();
          Kino.renderData(resp.model, "bijiSc", "#bijixq", true);
          $(".profession").hide()
        }
    }, {
        type: "POST",
        data:{
            dataId: dataId,
            contentType:"Note"
        }
    });
  })
  //提问
  $("#paperWrap").on("click",".question",function() {
    var dataId = $('.stId').attr('data-stId');
    var subjectCode = $('.stId').attr('data-subjectCode');
    var ansUrl = port.api_port + '/cms/Question/loadQuestionListdata.do';
    Kino.ajax(ansUrl, function (resp) {
        if (resp.resultCode == "SUCCESS") {
          $(".bijixq").show();
          Kino.renderData(resp, "wendaSc", "#bijixq", true);
          $("#bijixq .content").hide()
          $("#bijixq .bcwenda").hide()
          $("#bijixq .quesDiv").html('<div class="" id="highCadreEditor"></div><button type="button" name="button" class="huifubtn">提交</button>').show()
          Kino.editInit('highCadreEditor'); //问题内容富文本初始化
          $("#profession").prop('checked','checked')
          $("input:radio[name=jibie]").hide();
          $(".bijixq label").hide();
        }
    }, {
        type: "POST",
        data:{
            subjectCode: subjectCode,
            'queryParam["dataId"]': dataId,
            'queryParam["dataType"]': "ShiTi",
        }
    });
  })
  //
  $('#bijixq').on('click','.newAnswer', function () {
    $(".answerDiv").html("")
    var topicId = $(this).attr("data-topicId")
    var quesId = $(this).attr("data-quesId")
    var tagUid = $(this).attr("data-tagUid");var tagType = $(this).attr("data-userType");
    $(this).siblings(".answerDiv").html('<div class="" id="cadreEditor1"></div><button type="button" name="button" class="huifubtn1">回复</button>').show()
    $(".huifubtn1").attr("data-topicId",topicId).attr("data-quesId",quesId).attr("data-tagUid",tagUid).attr("data-userType",tagType);
    Kino.editInit('cadreEditor1'); //问题内容富文本初始化
  });
  //提交问题
  $('#bijixq').on('click','.huifubtn', function () {
    var dataId = $('.stId').attr('data-stId');
    var subjectCode = $('.stId').attr('data-subjectCode');
    Kino.ajax(port.api_port+"/cms/Question/saveQuestion.do", function (resp) {
      swal({
        title:"温馨提示",
        text:"提交成功",
        button:{
          text:"关闭"
        }
      })
      $(".question").trigger("click")
    }, {
        type: "POST",
        data:{
            subjectCode: subjectCode,
            dataType:"ShiTi",
            dataId:dataId,
            dataTcId:sjId,
            content:$("#highCadreEditor .w-e-text").html()
        }
    });
  });
  //回复问题
  $('#bijixq').on('click','.huifubtn1', function () {
    var content = $("#cadreEditor1 .w-e-text").html();
    var topicId = $(this).attr("data-topicId")
    var quesId = $(this).attr("data-quesId")
    var tagUid = $(this).attr("data-tagUid");var tagType = $(this).attr("data-userType");
    Kino.ajax(port.api_port+"/cms/Question/saveAnswer.do", function (resp) {
        if (resp.resultCode == "SUCCESS") {
          swal({
            title: "温馨提示",
            text: "回复成功",
            button: {
              text: "关闭",
            }
          }).then(function() {
            $(".answerDiv").hide();
            $(".answerDiv").html("")
            $(".question").trigger("click")
          })
        }
    }, {
        type: "POST",
        data: {
            topicId: topicId,
            quesId: quesId,
            tagUid: tagUid,
            content: content,
            tagType: tagType
        }
    });
  });
  //回复展开
  $('#bijixq').on('click','.huifu', function () {
      var i = $(this).attr('data-i');
      $(this).hide()
      $('.collapseTr'+i).toggleClass("none");
  });
  //保存笔记信息
  $("#bijixq").on("click",".bcwenda",function () {
    var dataId = $('.stId').attr('data-id');
    var openLevel = $('#bijixq input[name="jibie"]:checked').val();
    var contentType = "Note"
    if (openLevel=="Profession") {
      contentType="Question"
    }
    var content = $("#bijixq .content").val().replace(/^\s*|\s*$/g,"");
    if (content=='') {
      swal({
        title:"温馨提示",
        text:"请输入内容",
        button:{
          text:"关闭"
        }
      })
      return;
    }
    var wendaUrl = port.api_port + '/uc/interactContent/saveQuestionOrNote.do'; //保存笔记信息
    Kino.ajax(wendaUrl, function (resp) {
          if (resp.resultCode == "SUCCESS") {
            swal({
                title: "温馨提示",
                text: "保存信息成功！",
                button: {
                  text: "关闭",
                }
            });
        }
    }, {
        type: "POST",
        data:{
            subjectCode: Kino.getUrlParam("subjectCode")||"",
            dataId: dataId,
            dataType: "ShiTi",
            openLevel: openLevel,
            content:content,
            contentType: contentType
        }
    });
  })
  //回复
  $("#bijixq").on("click",".reply",function () {
    var dataId = $(this).attr('data-id');
    var content = $(this).siblings("textarea").val().replace(/^\s*|\s*$/g,"");
    if (content=='') {
      swal({
        title:"温馨提示",
        text:"请输入回复内容",
        button:{
          text:"关闭"
        }
      })
      return;
    }
    var wendaUrl = port.api_port + '/uc/interactContent/saveQuestionOrNote.do'; //回复
    Kino.ajax(wendaUrl, function (resp) {
          if (resp.resultCode == "SUCCESS") {
            swal({
                title: "温馨提示",
                text: "回复成功！",
                button: {
                  text: "关闭",
                }
            });
        }
    }, {
        type: "POST",
        data:{
            subjectCode: Kino.getUrlParam("subjectCode")||"",
            dataId: dataId,
            dataType: "ShiTi",
            content:content,
            contentType: "Answer",
            openLevel: "Public"
        }
    });
  })


  $(".kcurl").attr("href", port.netDomain + "/courseCenter/" + Kino.getUrlParam("subjectCode") + "/courseList.html");
  $(".bgcChoose").click(function() {
    if ($(this).hasClass("bgc1")) {
      $(".bg-fff,body,.subjectBody").addClass("bgc1")
      $(".bg-fff,body,.subjectBody").removeClass("bgc2")
      $(".bg-fff,body,.subjectBody").removeClass("bgc3")
    }
    if ($(this).hasClass("bgc2")) {
      $(".bg-fff,body,.subjectBody").addClass("bgc2")
      $(".bg-fff,body,.subjectBody").removeClass("bgc1")
      $(".bg-fff,body,.subjectBody").removeClass("bgc3")
    }
    if ($(this).hasClass("bgc3")) {
      $(".bg-fff,body,.subjectBody").addClass("bgc3")
      $(".bg-fff,body,.subjectBody").removeClass("bgc2")
      $(".bg-fff,body,.subjectBody").removeClass("bgc1")
    }
  })
  template.defaults.escape = false; //编译html片段
  //查找制定元素在数组中的索引值
  Array.prototype.indexVf = function(arr) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == arr) {
        return i;
      }
    }
  }
  var mode = Kino.getUrlParam('mode'); //考试模式 exe练习模式  exam考试模式
  if (mode == 'exam' || mode == 'Exam') { //考试模式，不可看答案与解析
    $('#examModeMsg').show();
    $('#exeModeMsg').hide();
  }

  var currentShitiId; //当前试题id
  var stIdArr = []; //试题id数组
  var daTiKaArr = []; //答题卡id数组
  var tIndex = 0; //当前试题索引


  var m, s; //分钟，秒数
  var isLunwen,paperShitiType;
  //查看试卷信息详情
  Kino.ajax('/api/course/paper/loadInfoByPK.do', function(resp) {
    if (resp.resultCode == "SUCCESS") {
      if (resp.model.paperShitiType == "82") {
        isLunwen = true;
        staticlw = true;
      }
      paperShitiType = resp.model.paperShitiType
      if (isLunwen) {
        $('#paperWrap').on('click', '#submitBtn', function() {
          swal("论文题只能选择一道题进行作答，是否交卷", {
            buttons: {
              hasaddr: "取消",
              defeat: "确定",
            },
          }).then(function(value) {
              switch (value) {
                case "hasaddr":

                  break;
                case "defeat":
                  //提交答案,主观题
                  var subjectiveAnswer = "";
                  subjectiveAnswerImg = "";
                  introduction = "";
                  introductionImg = "";
                  var that = $(this);
                  var sttype = $('.stId').attr('data-sttype');
                  var daTiKaId = $('.stId').attr('data-daTiKaId');
                  var shitiId = $('.stId').attr('data-id');
                  subjectiveAnswer = $('#contentTop').html();
                  if (sttype != 100) { //既不是填空的时候，要取图片
                    for (var i = 0; i < $(".contimg").length; i++) {
                      if (i == $(".contimg").length - 1) {
                        subjectiveAnswerImg += $(".contimg").eq(i).attr("src")
                      } else {
                        subjectiveAnswerImg += $(".contimg").eq(i).attr("src") + ","
                      }
                    }
                  }
                  if (sttype == 99) {
                    introduction = $('#contentZy').html();
                  }
                  var flagShitiUrl = port.api_port + '/uc/paper/submitSubjectiveAnswer.do'; //提交主观题答案
                  Kino.ajax(flagShitiUrl, function(resp) {
                    if (resp.resultCode == "SUCCESS") {
                      // swal({title: "温馨提示",text: "提交答案成功"});
                      $(".ISpan[data-stid='" + shitiId + "']").removeClass('unFinishISpan');
                      var sytime = $(".fen").text()*60 + $(".miao").text()*1;
                      Kino.ajax(submitUrl, function(resp) {
                        if (resp.resultCode == "SUCCESS") {
                          console.log('提交考试', resp);
                          swal({
                            title: "温馨提示",
                            text: "交卷成功",
                            button: {
                              text: "关闭",
                            }
                          }).then(function() {
                            location.href = port.ucDomain + '/tiku/testReport.html?id=' + testId;
                          })
                        }
                      }, {
                        type: "POST",
                        data: {
                          paperLogId: testId,
                          restTime: sytime,
                          isEnd: 'Y'
                        }
                      });
                    }
                  }, {
                    type: "POST",
                    data: {
                      stId: shitiId,
                      paperLogId: testId,
                      subjectiveAnswer: subjectiveAnswer,
                      subjectiveAnswerImg: subjectiveAnswerImg,
                      restTime: restTime,
                      introduction: introduction,
                      introductionImg: introductionImg,
                    }
                  });
                  break;
                default:

              }
          });
        })
      } else {
        //提交答案,主观题
        $('#paperWrap').on('click', '#submitBtn', function() {
          var subjectiveAnswer = "";
          subjectiveAnswerImg = "";
          introduction = "";
          introductionImg = "";
          var that = $(this);
          var sttype = $('.stId').attr('data-sttype');
          var daTiKaId = $('.stId').attr('data-daTiKaId');
          var shitiId = $('.stId').attr('data-id');
          subjectiveAnswer = $('#contentTop').html();
          if (sttype != 100) { //既不是填空的时候，要取图片
            for (var i = 0; i < $(".contimg").length; i++) {
              if (i == $(".contimg").length - 1) {
                subjectiveAnswerImg += $(".contimg").eq(i).attr("src")
              } else {
                subjectiveAnswerImg += $(".contimg").eq(i).attr("src") + ","
              }
            }
          }
          if (sttype == 99) {
            introduction = $('#contentZy').html();
          }
          var flagShitiUrl = port.api_port + '/uc/paper/submitSubjectiveAnswer.do'; //提交主观题答案
          Kino.ajax(flagShitiUrl, function(resp) {
            if (resp.resultCode == "SUCCESS") {
              swal({title: "温馨提示",text: "提交答案成功"});
              $(".ISpan[data-stid='" + shitiId + "']").removeClass('unFinishISpan');
            }
          }, {
            type: "POST",
            data: {
              stId: shitiId,
              paperLogId: testId,
              subjectiveAnswer: subjectiveAnswer,
              subjectiveAnswerImg: subjectiveAnswerImg,
              restTime: restTime,
              introduction: introduction,
              introductionImg: introductionImg,
            }
          });
        });
      }
      Kino.renderData(resp.model, "paperTitleSc", "#paperTitleWrap", true);
      Kino.renderData(resp.model, "paperDetailSc", "#paperDetailWrap", true);
      paperOpenAnalysis = resp.model.paperOpenAnalysis;
      if (Kino.getUrlParam("mode") == "exam" || Kino.getUrlParam("mode") == "Exam") {
        //倒计时
        restTimerInterval = setInterval(function() {
          if (s < 10) {
            //如果秒数少于10在前面加上0
            $(".fen").text(m);
            $(".miao").text("0"+s)
          } else {
            $(".fen").text(m);
            $(".miao").text(s)
          }
          s--;
          if (s < 0 && m > 0) {
            //如果秒数少于0就变成59秒
            s = 59;
            m--;
          }
          if (s < 0 && m <= 0) { //时间到
            clearInterval(restTimerInterval); //清楚倒计时
            subzhuguan(function(){
                Kino.ajax(submitUrl, function(resp) {
                  if (resp.resultCode == "SUCCESS") {
                    console.log('提交考试', resp);
                    swal({
                      title: "温馨提示",
                      text: "交卷成功",
                      button: {
                        text: "关闭",
                      }
                    }).then(function() {
                      location.href = port.ucDomain + '/tiku/testReport.html?id=' + testId;
                    })
                  }
                }, {
                  type: "POST",
                  data: {
                    paperLogId: testId,
                    restTime: 0,
                    isEnd: 'Y'
                  }
                });
            },'Y');
            // Kino.ajax(submitUrl, function(resp) {
            //   if (resp.resultCode == "SUCCESS") {
            //     swal({
            //       title: "温馨提示",
            //       text: "交卷时间已到，已帮您提交试卷",
            //       button: {
            //         text: "关闭",
            //       }
            //     }).then(function() {
            //       location.href = port.ucDomain + '/tiku/testReport.html?id=' + testId;
            //     })
            //   }
            // }, {
            //   type: "POST",
            //   data: {
            //     paperLogId: testId,
            //     restTime: 0,
            //     isEnd: 'Y'
            //   }
            // });
          };
        }, 1000)
      }
      Kino.ajax('/ucapi/uc/paper/loadNotEndTestLog.do', function(resps) {
        if (resps.resultCode == "SUCCESS") {
          if (JSON.stringify(resps.model) == "{}") {
            // $("body").hide()
            swal({
              title:"温馨提示",
              text:"您已经测试过本套试卷，如果重新测试，则将覆盖您以前的测试记录，重新测试吗？"
            }).then(function() {
              if (resp.model.paperType.nameDescp=="MockExam") {
                location.href = port.ucDomain + "/personalCenter/mokao.html"
              } else {
                location.href = port.netDomain + resp.model.accessId + ".html"
              }
            })
          } else {
            if (Kino.getUrlParam("mode") == "exe" && (resps.model.restTime / 60) == resps.model.duration) {
              m = 0; //分钟 试卷多少分钟
              s = 00; //秒
            } else {
              if (resp.model.paperType.nameDescp=="MockExam") {
                Kino.ajax('/ucapi/cms/MockExam/loadPaper.do', function(data) {
                  m = parseInt(data.model.paperEndtime / 60)>0?parseInt(data.model.paperEndtime / 60):0; //分钟 试卷多少分钟
                  s = (data.model.paperEndtime - m * 60) || 00; //秒
                }, {
                  type: "POST",
                  data: {
                    "tcId": resp.model.id
                  }
                });
              }else {
                if (parseInt(resps.model.restTime / 60) == 0) {
                  m = parseInt(resps.model.restTime / 60); //分钟 试卷多少分钟
                  s = (resps.model.restTime - m * 60) || 00; //秒
                } else {
                  m = parseInt(resps.model.restTime / 60) || resps.model.duration; //分钟 试卷多少分钟
                  s = (resps.model.restTime - m * 60) || 00; //秒
                }
              }
            }
          }
        }
      }, {
        type: "POST",
        data: {
          "tcId": resp.model.id
        }
      });
    };
  }, {
    data: {
      "pk": sjId
    }
  });
  //顺计时
  function runTime() {
    restTimerInterval = setInterval(function() {
      restTime = 60 * m + s;
      if (s < 10) {
        //如果秒数少于10在前面加上0
        $(".fen").text(m);
        $(".miao").text("0"+s)
      } else {
        $(".fen").text(m);
        $(".miao").text(s)
      }
      s++;
      if (s > 59) {
        //如果秒数少于0就变成59秒
        s = 0;
        m++;
      }
    }, 1000)
  };

  function daoTime() {
    restTimerInterval = setInterval(function() {
      restTime = 60 * m + s;
      if (s < 10) {
        //如果秒数少于10在前面加上0
        $(".fen").text(m);
        $(".miao").text("0"+s)
      } else {
        $(".fen").text(m);
        $(".miao").text(s)
      }
      s--;
      if (s <= 0) {
        //如果秒数少于0就变成59秒
        s = 59;
        m--;
      }
    }, 1000)
  };
  setTimeout(function() {
    if (Kino.getUrlParam("mode") == "exe"||Kino.getUrlParam("mode") == "Exercise") {
      runTime()
    }
  }, 0)
  //根据stId数组的索引取到stId再查试题信息
  function loadShitiInfo(stIdIndex) {
    var loadShitiInfoUrl = port.api_port + '/uc/paper/loadShitiInfo.do'; //根据ID查询试题信息
    var loadShitidetUrl = port.api_port + '/uc/testPaperLog/loadShitiLog.do'; //根据测试记录id和试题id查询做题详情
    Kino.ajax(loadShitiInfoUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        if(staticlw && lwcurid!="" && lwcurid!=stIdArr[stIdIndex]){//如果是论文题，并且当前题目不是已选中要做的题，则无法做题
          resp.model.choWork = "N";
          $(".exBtn").hide();
        }else if(staticlw){
          resp.model.choWork = "Y";
          $(".exBtn").show();
        }else{
          resp.model.choWork = "Y";
          $(".exBtn").show();
        }
        console.log(resp.model.choWork);
        var shitidata = resp.model;
        var shiTiLog = resp;
        $.extend(true, shiTiLog, {
          model: {
            shiti: {
              daTiKaId: daTiKaArr[stIdIndex]
            }
          }
        });

        Kino.ajax(loadShitidetUrl, function(resp) {
          if (resp.resultCode == "SUCCESS") {
            shitidata['det'] = resp.model;
            shitidata['index'] = stIdIndex;
            console.log('试题详细信息', shitidata);
            if(shitidata['det']['subjectiveAnswerImg']){
              shitidata['det']['subjectiveAnswerImg'] = resp.model.subjectiveAnswerImg.split(",");
            }else{
              shitidata['det']['subjectiveAnswerImg'] = [];
            }
            Kino.renderData(shitidata, "paperSc", "#paperWrap", true);
            if (shitidata.isWorked=="Y") {
              $(".subject-content").css("background-color","rgba(0,0,0,0.1)")
            }else if (shitidata.isWorked=="N") {
              $(".subject-content").css("background-color","")
            }
          }
        }, {
          type: "POST",
          data: {
            paperLogId: testId,
            shitiId: stIdArr[stIdIndex]
          }
        });
        if (stIdIndex == 0) {
          $('.subjectBody .bLeftWrap').addClass('notclickn');
        } else {
          $('.subjectBody .bLeftWrap').removeClass('notclickn');
        }
        if (stIdIndex == stIdArr.length - 1) {
          $('.subjectBody .bRightWrap').addClass('notclickn');
        } else {
          $('.subjectBody .bRightWrap').removeClass('notclickn');
        }
      }
    }, {
      type: "POST",
      data: {
        id: stIdArr[stIdIndex]
      }
    });
  }
  //先查询是不是论文试卷
  Kino.ajax('/api/course/paper/loadInfoByPK.do', function(mydata) {
      if (mydata.model.paperShitiType == "82") {
        staticlw = true;
      }
      var loadScantronUrl = port.api_port + '/uc/paper/loadScantron.do'; //查询答题卡信息
      Kino.ajax(loadScantronUrl, function(resp) {
        if (resp.resultCode == "SUCCESS") {
          console.log('查询答题卡信息', resp);
          if (resp.model.data.length >= 1) {
            $.each(resp.model.data, function(index, value) {
              if (value.shitiLogList.length >= 1) {
                $.each(value.shitiLogList, function(indexInArray, valueOfElement) {
                  stIdArr.push(valueOfElement.stId);
                  daTiKaArr.push(valueOfElement.id);
                });
              }
            });
          }
          currentShitiId = resp.model.currentShitiId; //当前试题id
          lwcurid = resp.model.currentShitiId;
          console.log('stIdArr', stIdArr);
          console.log('currentShitiId', currentShitiId);
          if (stIdArr.length>0) {
            if (currentShitiId) {
              tIndex = stIdArr.indexVf(currentShitiId);
              loadShitiInfo(tIndex);
            } else {
              loadShitiInfo(tIndex);
            }
          }else{
            swal({
              title:"温馨提示",
              text:"暂时没有题目，敬请期待",
              button:{
                text:"关闭"
              }
            })
            $('.subjectBody .bRightWrap').addClass('notclickn')
            $('.subjectBody .bLeftWrap').addClass('notclickn')
          }
          console.log('答题卡信息', resp.model);
          Kino.renderData(resp.model, "scantronSc", "#scantronWrap", true);
        }
      }, {
        type: "POST",
        data: {
          paperLogId: testId,
          paperType:mydata.model.paperType.nameDescp
        }
      });

  }, { data: {"pk": sjId}
  });

  //下一题
  $('.subjectBody .bRightWrap').click(function(e) {
      e.preventDefault()
      subzhuguan(function(){
          tIndex++;
          console.log('下一题', tIndex);
          loadShitiInfo(tIndex);
          $(".bijixq").hide();
      },'N');
  });
  //上一题
  $('.subjectBody .bLeftWrap').click(function() {
      subzhuguan(function(){
        tIndex--;
        console.log('上一题', tIndex);
        loadShitiInfo(tIndex);
        $(".bijixq").hide();
      },'N');
  });
  //查看答案与解析
  $('.subjectBody .bottomCenter').click(function() {
    if (paperOpenAnalysis == "Y") {
      $('.analysisAnswer').show();
    } else {
      swal({
        title: "该试卷不能查看解析",
        button: {
          text: "关闭",
        }
      }).then(function() {});
    }
  });
  //收藏
  $('#paperWrap').on('click', '.addCollect,.scorno', function() {
    var that = $(this);
    var dataId = $('.stId').attr('data-id');
    var dataType = 'ShiTi';
    var stuCollectionUrl = port.api_port + '/uc/stuCollection/add.do'; //收藏试题
    Kino.ajax(stuCollectionUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        // swal({
        //   title: "温馨提示",
        //   text: "收藏试题成功",
        //   button: {
        //     text: "关闭",
        //   }
        // }).then(function() {
          $(".addCollect").addClass('cancelCollect');
          $(".addCollect").removeClass('addCollect');
          $(".scorno").addClass('noorsc');
          $(".scorno").removeClass('scorno');
          $(".cancelCollect").text('取消收藏');
        // });
      }
    }, {
      type: "POST",
      data: {
        dataId: dataId,
        dataType: dataType,
        subjectCode: subjectCode
      }
    });
  });
  //取消收藏
  $('#paperWrap').on('click', '.cancelCollect,.noorsc', function() {
    var that = $(this);
    var dataId = $('.stId').attr('data-stId');
    var dataType = 'ShiTi';
    var cancelCollectUrl = port.api_port + '/uc/stuCollection/cancel.do'; //取消收藏
    Kino.ajax(cancelCollectUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        // swal({
        //   title: "温馨提示",
        //   text: "取消收藏试题成功",
        //   button: {
        //     text: "关闭",
        //   }
        // }).then(function() {
          $(".cancelCollect").addClass('addCollect');
          $(".cancelCollect").removeClass('cancelCollect');
          $(".noorsc").addClass('scorno');
          $(".noorsc").removeClass('noorsc');
          $(".addCollect").text('收藏');
        // })
      }
    }, {
      type: "POST",
      data: {
        dataId: dataId,
        dataType: dataType
      }
    });
  });

  //跳转到对应试题
  $('#scantronWrap').on("click", '.ISpan', function() {
      var dataId = $(this).attr('data-stid');
      subzhuguan(function(){
          $(".bijixq").hide();
          for (var j = 0; j < stIdArr.length; j++) {
            if (stIdArr[j] == dataId) {
              tIndex = j;
            }
          }
          loadShitiInfo(tIndex);
      },'N');
  });

  //提交问题图片
  var flag = 0;
  $(document).on('change', '#contentImg', function() {
    flag++;
    var _name, _fileName, personsFile;
    personsFile = document.getElementById("contentImg");
    _name = personsFile.value;
    _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
    console.log(_fileName);
    if (_fileName&&_fileName !== "png" && _fileName !== "jpg") {
      swal({
        title:"温馨提示",
        text:"上传图片格式不正确，请重新上传"
      })
      document.getElementById("contentImg").value="";
      return;
    }
    var curl = port.baseDomain + '/upload/img.do'; //图片上传
    if (flag <= 9) {
      Kino.uploadNoForm('contentImg', curl, 'shitifeed', function(resp) {
        $('.imgbox').append('<img class="contimg" src="' + resp.model.data + '" alt="" style="width:20%;height:100px;" />'); //设置头像图片
      });
    } else {
      swal({
        title:"温馨提示",
        text:"最多支持上传9张"
      })
    }
  });
  //标记（新的）
  $('#paperWrap').on('click', '.addBiaoji', function() {
    var that = $(this);
    var dataId = $('.stId').attr('data-datikaid');
    var shitiId = $('.stId').attr('data-id');
    var flagShitiUrl = port.api_port + '/uc/paper/flagShiti.do'; //标记试题
    Kino.ajax(flagShitiUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        swal({
          title: "温馨提示",
          text: "添加标记试题成功",
          button: {
            text: "关闭",
          }
        }).then(function() {
          that.addClass('cancelBiaoji');
          that.removeClass('addBiaoji');
          that.text('取消标记');
          $(".ISpan[data-stid='" + shitiId + "']").addClass('spanMark');
          $(".ISpan[data-stid='" + shitiId + "']").addClass('icon_question');
          $(".ISpan[data-stid='" + shitiId + "']").addClass('inline-block');
        })
      }
    }, {
      type: "POST",
      data: {
        pks: dataId,
        paperLogId: testId,
        stId: shitiId
      }
    });
  });
  //取消标记（新的）
  $('#paperWrap').on('click', '.cancelBiaoji', function() {
    var that = $(this);
    var dataId = $('.stId').attr('data-datikaid');
    var shitiId = $('.stId').attr('data-id');
    var cancelShitiFlagUrl = port.api_port + '/uc/paper/cancelShitiFlag.do'; //取消试题标记
    Kino.ajax(cancelShitiFlagUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        swal({
          title: "温馨提示",
          text: "取消标记试题成功",
          button: {
            text: "关闭",
          }
        }).then(function() {
          that.removeClass('cancelBiaoji');
          that.addClass('addBiaoji');
          that.text('标记');
          $(".ISpan[data-stid='" + shitiId + "']").removeClass('spanMark');
          $(".ISpan[data-stid='" + shitiId + "']").removeClass('icon_question');
          $(".ISpan[data-stid='" + shitiId + "']").removeClass('inline-block');
        })
      }
    }, {
      type: "POST",
      data: {
        pks: dataId,
        paperLogId: testId,
        stId: shitiId
      }
    });
  });
  //暂停
  $('#scantronWrap').on('click', '.zanTing', function() {
    clearInterval(restTimerInterval);
    $(this).find("span.pause").text('开始');
    $(this).addClass('restart');
    $(this).removeClass('zanTing');
    swal({
      text:"休息一会~~",
      closeOnClickOutside: false,
      button:{
        text:"继续做题"
      }
    }).then(function(){
      $(".restart").trigger("click")
    })
  });
  //重启
  if (Kino.getUrlParam("mode") == "exam"||Kino.getUrlParam("mode") == "Exam") {
    $('#scantronWrap').on('click', '.restart', function() {
      $(this).removeClass('restart');
      $(this).addClass('zanTing');
      $(this).find("span.pause").text('暂停');
      restTimerInterval = setInterval(function() {
        restTime = 60 * m + s;
        if (s < 10) {
          //如果秒数少于10在前面加上0
          $(".fen").text(m);
          $(".miao").text("0"+s)
        } else {
          $(".fen").text(m);
          $(".miao").text(s)
        }
        s--;
        if (s < 0) {
          //如果秒数少于0就变成59秒
          s = 59;
          m--;
        }
      }, 1000)
    });
  }
  if (Kino.getUrlParam("mode") == "exe") {
    $('#scantronWrap').on('click', '.restart', function() {
      $(this).removeClass('restart');
      $(this).addClass('zanTing');
      $(this).find("span.pause").text('暂停');
      restTimerInterval = setInterval(function() {
        restTime = 60 * m + s;
        if (s < 10) {
          //如果秒数少于10在前面加上0
          $(".fen").text(m);
          $(".miao").text("0"+s)
        } else {
          $(".fen").text(m);
          $(".miao").text(s)
        }
        s++;
        if (s > 59) {
          //如果秒数少于0就变成59秒
          s = 0;
          m++;
        }
      }, 1000)
    });
  }
  $(".subject-content").on("click", ".jiucuo", function() {
    jiucuoid = $(this).attr("data-id")
    // jiucuo(id)
    $("#jiucuo").modal()
  })
  $("#jiucuo").on("click", "#saveStuAttention", function() {
    var jiucuoUrl = port.api_port + '/uc/errFix/save.do'; //纠错
    var content = $("#jiucuo textarea").val().replace(/^\s*|\s*$/g,"")
    if (content=='') {
      swal({
        title:"温馨提示",
        text:"请输入纠错内容",
        button:{
          text:"关闭"
        }
      })
      return;
    }
    Kino.ajax(jiucuoUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        swal({
          title: "温馨提示",
          text: "信息提交成功！",
          button: {
            text: "关闭",
          }
        }).then(function() {
          $("#jiucuo textarea").val("")
        });
      }
    }, {
      type: "POST",
      data: {
        dataType: 'ShiTi',
        dataId: jiucuoid,
        subjectCode: subjectCode,
        content: content
      }
    });
  })
  //保存进度下次继续
  $('#scantronWrap').on('click', '.pauseExam', function() {
      subzhuguan(function(){
          var pauseUrl = port.api_port + '/uc/paper/submitExam.do';
          // var sytime = parseFloat(parseFloat($("#time").text())*60);
          var sytime = m * 60 + s;
          Kino.ajax(pauseUrl, function(resp) {
            if (resp.resultCode == "SUCCESS") {
              clearInterval(restTimerInterval);
              $(".sp").removeClass('pause');
              $(".sp").addClass('restart');
              $(".sp").text('开始');
              swal({
                title: "温馨提示",
                text: "保存进度成功",
                button: {
                  text: "关闭",
                }
              }).then(function() {
                  window.location.href = port.ucDomain + "/personalCenter/studyCenter.html"
              });
            }
          }, {
            type: "POST",
            data: {
              paperLogId: testId,
              restTime: sytime,
              isEnd: 'N'
            }
          });
      },'N');
  });
  //提交考试
  var nums=1
  $('#scantronWrap').on('click', '.submitExam', function() {
      subzhuguan(function(){
          var sytime = $(".fen").text()*60 + $(".miao").text()*1;
          // if (paperShitiType!=80&&nums==1) {
          //   swal({
          //     title: "温馨提示",
          //     text: "试卷有需要手动提交答案的试题，请检查是否提交答案。",
          //     button: {
          //       text: "关闭",
          //     }
          //   })
          //   nums++;
          //   return
          // }
          swal({
              title:"温馨提示",
              text:"确认交卷吗？",
              buttons: ["取消", "确定"],
          }).then(function(value) {
              if(value==1){
                Kino.ajax(submitUrl, function(resp) {
                  if (resp.resultCode == "SUCCESS") {
                    console.log('提交考试', resp);
                    swal({
                      title: "温馨提示",
                      text: "交卷成功",
                      button: {
                        text: "关闭",
                      }
                    }).then(function() {
                      location.href = port.ucDomain + '/tiku/testReport.html?id=' + testId;
                    })
                  }
                }, {
                  type: "POST",
                  data: {
                    paperLogId: testId,
                    restTime: sytime,
                    isEnd: 'Y'
                  }
                });
              }
          })
      },'Y');
  });



  //禁用F5刷新
  document.onkeydown = function() {
    if (event.keyCode == 116) {
      event.keyCode = 0;
      event.cancelBubble = true;
      return false;
    }
  }

  //禁止右键弹出菜单
  document.oncontextmenu = function() {
    return false;
  }
});
//提交选择题或者判断题答案
function chooseSubmit(type) {
  var myAnswer = [];
  if (type == "96" || type=="105") { //多选
    var answerArrLength = $('.answerRow').attr('data-answer-length');
    for (let index = 0; index < answerArrLength; index++) {
      myAnswer[index] = [];
      $('.aw' + index).find('.answerInpt:checked').each(function() {
        myAnswer[index].push($(this).val());
      })
    }
    console.log('答案', myAnswer);
  } else if (type == "95" || type == "97") { //单选
    if ($(".answerWrap .answerList").length == 1) {
      if (!$(".bRightWrap").hasClass("notclickn")) {
        $(".bRightWrap").triggerHandler("click")
      }
    }
    var answerArrLength = $('.answerRow').attr('data-answer-length');
    for (let index = 0; index < answerArrLength; index++) {
      myAnswer[index] = [];
      if ($('.aw' + index).find('.answerInpt:checked').val()) {
        myAnswer[index].push($('.aw' + index).find('.answerInpt:checked').val());
      };
    }
    console.log('答案', myAnswer);
  }
  var sytime = $(".fen").text()*60 + $(".miao").text()*1;
  var myAnswerEnd = JSON.stringify(myAnswer);
  var daTiKaId = $('.stId').attr('data-daTiKaId');
  var shitiId = $('.stId').attr('data-id');
  var idx = $('.finishISpan').attr('data-stId');
  var submitAnswerUrl = port.api_port + '/uc/paper/submitAnswer.do'; //提交答案
  Kino.ajax(submitAnswerUrl, function(resp) {
    if (resp.resultCode == "SUCCESS") {
      $(".ISpan[data-stid='" + shitiId + "']").removeClass('unFinishISpan');
    }

  }, {
    type: "POST",
    data: {
      stId: shitiId,
      paperLogId: testId,
      myAnswer: myAnswerEnd,
      restTime: sytime
    }
  });
}

//提交主观题答案
function subzhuguan(callback,istj){
    var zhuguan = $('.stId').attr('data-zhuguan');
    var worked = $('.stId').attr('worked');
    if( (!zhuguan || zhuguan=="" || zhuguan!="Y") ){//1，是论文题，但不需要交卷。2，非主观题，不需要提交答案
        if ( callback &&  typeof callback === 'function') {
            callback();
        }
        return;
    }
    //否则，需要保存和提交答案
    if(staticlw){//如果这套试卷是论文试卷，代表只能几选一，则调论文题的保存方法
          var zyhtml = "";
          if($("#contentZy").is(":visible") && $('#contentZy').html()!=""){
             zyhtml = $('#contentZy').html();
          }
          if($(".answerList").is(":visible") && ( zyhtml.replace(/\s+/g,"")!="" || $('#contentTop').html().replace(/\s+/g,"")!="" || $(".contimg").length>0 ||worked=="Y" ) ){//如果有答案区域，则先提交答案，否则，判断是否istj为Y，是就直接交卷，不是直接回调
                //提交答案,主观题
                var subjectiveAnswer = "";
                subjectiveAnswerImg = "";
                introduction = "";
                introductionImg = "";
                var sttype = $('.stId').attr('data-sttype');
                var daTiKaId = $('.stId').attr('data-daTiKaId');
                var shitiId = $('.stId').attr('data-id');
                subjectiveAnswer = $('#contentTop').html();
                if (sttype != 100) { //既不是填空的时候，要取图片
                  for (var i = 0; i < $(".contimg").length; i++) {
                    if (i == $(".contimg").length - 1) {
                      subjectiveAnswerImg += $(".contimg").eq(i).attr("src")
                    } else {
                      subjectiveAnswerImg += $(".contimg").eq(i).attr("src") + ","
                    }
                  }
                }
                if (sttype == 99) {
                  introduction = $('#contentZy').html();
                }
                var flagShitiUrl = port.api_port + '/uc/paper/submitSubjectiveAnswer.do'; //提交主观题答案
                Kino.ajax(flagShitiUrl, function(resp) {
                  if (resp.resultCode == "SUCCESS") {
                    // swal({title: "温馨提示",text: "提交答案成功"});
                    $(".ISpan[data-stid='" + shitiId + "']").removeClass('unFinishISpan');
                    lwcurid = shitiId;
                    if(istj && istj=="Y"){//需要交卷
                        lwjiaojuan();
                    }else{
                        if ( callback &&  typeof callback === 'function') {
                            callback();
                        }
                    }
                  }
                }, {
                  type: "POST",
                  data: {
                    stId: shitiId,
                    paperLogId: testId,
                    subjectiveAnswer: subjectiveAnswer,
                    subjectiveAnswerImg: subjectiveAnswerImg,
                    restTime: restTime,
                    introduction: introduction,
                    introductionImg: introductionImg,
                  }
                });
          }else{//如果该题不可做，则直接判断是否需要交卷或者回调
                if(istj && istj=="Y"){//需要交卷
                      lwjiaojuan();
                }else{
                    if ( callback &&  typeof callback === 'function') {
                        callback();
                    }
                }
          }
    }else{//如果是其它的主观题
        var subjectiveAnswer = "";
        subjectiveAnswerImg = "";
        introduction = "";
        introductionImg = "";
        var sttype = $('.stId').attr('data-sttype');
        var daTiKaId = $('.stId').attr('data-daTiKaId');
        var shitiId = $('.stId').attr('data-id');
        subjectiveAnswer = $('#contentTop').html();
        if (sttype != 100) { //既不是填空的时候，要取图片
          for (var i = 0; i < $(".contimg").length; i++) {
            if (i == $(".contimg").length - 1) {
              subjectiveAnswerImg += $(".contimg").eq(i).attr("src")
            } else {
              subjectiveAnswerImg += $(".contimg").eq(i).attr("src") + ","
            }
          }
        }
        if (sttype == 99) {
          introduction = $('#contentZy').html();
        }
        if( (sttype == 100 && subjectiveAnswer=="" && worked=="N" ) || (sttype != 100 && (subjectiveAnswer.replace(/\s+/g,"")=="" && subjectiveAnswerImg=="" && worked=="N" ) ) ){//如果没有数据，则不保存
            if ( callback &&  typeof callback === 'function') {
                callback();
            }
            return;
        }
        var flagShitiUrl = port.api_port + '/uc/paper/submitSubjectiveAnswer.do'; //提交主观题答案
        Kino.ajax(flagShitiUrl, function(resp) {
          if (resp.resultCode == "SUCCESS") {
            $(".ISpan[data-stid='" + shitiId + "']").removeClass('unFinishISpan');
            if ( callback &&  typeof callback === 'function') {
                callback();
            }
          }
        }, {
          type: "POST",
          data: {
            stId: shitiId,
            paperLogId: testId,
            subjectiveAnswer: subjectiveAnswer,
            subjectiveAnswerImg: subjectiveAnswerImg,
            restTime: restTime,
            introduction: introduction,
            introductionImg: introductionImg,
          }
        });
    }
}

//交卷代码
function lwjiaojuan(){
    if(lwcurid==""){
        swal({
          title: "温馨提示",
          text: "请先选择一道论文题进行作答！",
          button: {
            text: "关闭",
          }
        });
        console.log(99999999999);
        return;
    }
    var sytime = $(".fen").text()*60 + $(".miao").text()*1;
    Kino.ajax(submitUrl, function(resp) {
      if (resp.resultCode == "SUCCESS") {
        swal({
          title: "温馨提示",
          text: "交卷成功",
          button: {
            text: "关闭",
          }
        }).then(function() {
          location.href = port.ucDomain + '/tiku/testReport.html?id=' + testId;
        })
      }
    }, {
      type: "POST",
      data: {
        paperLogId: testId,
        restTime: sytime,
        isEnd: 'Y'
      }
    });
}