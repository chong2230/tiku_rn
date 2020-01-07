/**
* 第一步：获取试题列表
*/

var restTime; //做题剩余试卷  秒计算
var restTimerInterval; //保存倒计时
var paperOpenAnalysis = "Y"; //是否公开答案解析
var staticlw = false;
var submitUrl = port.api_port + '/uc/paper/submitExam.do'; //交卷接口
var testId = Kino.getUrlParam('testId'); //测试id
var lwcurid = "";

var subjectCode = Kino.getUrlParam('subjectCode'); //subjectCode
var sjId = Kino.getUrlParam('sjId'); //sjId试卷id

//查找制定元素在数组中的索引值
Array.prototype.indexVf = function(arr) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == arr) {
      return i;
    }
  }
}
var mode = Kino.getUrlParam('mode'); //考试模式 exe练习模式  exam考试模式

var currentShitiId; //当前试题id
var stIdArr = []; //试题id数组
var daTiKaArr = []; //答题卡id数组
var tIndex = 0; //当前试题索引


var m, s; //分钟，秒数
var isLunwen,paperShitiType;

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
        }
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
            
          }
        }, {
          type: "POST",
          data: {
            paperLogId: testId,
            shitiId: stIdArr[stIdIndex]
          }
        });
        if (stIdIndex == stIdArr.length - 1) {
          
        } else {
          // next();
        }
      }
    }, {
      type: "POST",
      data: {
        id: stIdArr[stIdIndex]
      }
    });
  }

  //下一题
function next() {
  tIndex++;
  console.log('下一题', tIndex);
  loadShitiInfo(tIndex);
};