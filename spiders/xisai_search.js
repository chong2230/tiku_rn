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

var jsonData = [];  // 导出数据
var delay = 2000;  // 延迟n秒
var isExportExcel = true;

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
            convertData(shitidata.shiti);
            if(shitidata['det']['subjectiveAnswerImg']){
              shitidata['det']['subjectiveAnswerImg'] = resp.model.subjectiveAnswerImg.split(",");
            }else{
              shitidata['det']['subjectiveAnswerImg'] = [];
            }

            if (stIdIndex == stIdArr.length - 1) {
              // addExportBtn();
                if (isExportExcel) tableToExcel();
                else {
                  saveJSON();
                  // Excel也保存一份
                  setTimeout(function() {
                    tableToExcel();
                  }, 500);
                }
            } else {
              // 延迟10秒请求下一题，避免请求太频繁
              setTimeout(function(){next();}, delay);
            }
            
          }
        }, {
          type: "POST",
          data: {
            paperLogId: testId,
            shitiId: stIdArr[stIdIndex]
          }
        });
        
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
}

function convertData(data) {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var pReg = /<\/?p.*?(?:>|\/>)/gi;
    var brReg = /<br\s*\/?>/gi;
    var divReg = /<div\s*\/?>/gi;
    var commentReg = /((<!--)[\S\s]*)(--\>)/ig;
    var htmlReg = /(<([^>]+)>)/ig;
  let question = data.questionMap.length > 0 ? data.questionMap[0] : {};
  if (data.questionMap.length > 1) {  // 多个问题处理
     question = {'A':'', 'B':'', 'C':'', 'D':'', 'E':'', 'F':''};
    for (let i=0; i<data.questionMap.length; i++) {
      let q = data.questionMap[i];
      question['A'] += (i==0 ? q['A'] : '####' + q['A']);
        question['B'] += (i==0 ? q['B'] : '####' + q['B']);
        if (q['C']) question['C'] += (i==0 ? q['C'] : '####' + q['C']);
        if (q['D'])question['D'] += (i==0 ? q['D'] : '####' + q['D']);
        if (q['E'])question['E'] += (i==0 ? q['E'] : '####' + q['E']);
        if (q['F'])question['F'] += (i==0 ? q['F'] : '####' + q['F']);
    }
      console.log('question[\'A\'] ', question['A']);
  }
  let obj = {
    'ask': data.tiganDelHTMLTag,//data.tigan.replace(/<br\s*\/?>/gi, '\n'),
    "askImg": "",
    "score": data.score || 10.00,
    'choiceA': question['A'] ? question['A'] : '',  // 案例题无选项
    'choiceB': question['B'] ? question['B'] : '',
    'choiceC': question['C'] ? question['C'] : '',
    'choiceD': question['D'] ? question['D'] : '',
    'choiceE': question['E'] ? question['E'] : '',
    'choiceF': question['F'] ? question['F'] : '',
    "answer": data.answerStr,
    "answerImg": "",
    "analysis": data.analysis.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?p>/gi, '').replace(imgReg, '')
        .replace(divReg, '').replace(commentReg, '').replace(htmlReg, ''),
    "analysisImg": getImg(data.analysis),
    // "typeName":data.stTypeName
  }
  // 案例题 stProp: "ZhenTi" stPropName: "真题" stType: 98 stTypeName: "案例题"
    if (data.stTypeName == '案例题') {
      // obj.ask = data.question.replace(brReg, '\n').replace(pReg, '').replace(imgReg, '');
      // obj.askImg = getImg(data.question);
      // obj.answer = data.answer.replace(brReg, '\n').replace(pReg, '').replace(imgReg, '');
      // obj.answerImg = getImg(data.answer);
      // obj.analysis = data.analysis.replace(brReg, '\n').replace(pReg, '').replace(imgReg, '');
      // obj.analysisImg = getImg(data.analysis);
        obj.ask = data.question;
        obj.answer = data.answer;
        obj.analysis = data.analysis;
        isExportExcel = false;
    }
  console.log(obj);
  jsonData.push(obj);
}

function getImg(str) {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);  // arr 为包含所有img标签的数组
    if (!arr) return '';
    var res = '';
    for (var i = 0; i < arr.length; i++) {
        var src = arr[i].match(srcReg);
        //获取图片地址
        console.log('图片地址'+(i+1)+'：'+src[1]);
        if (i == 0) res += src[1];
        else res += ',' + src[1];
    }
    return res;
}

function tableToExcel() {
  //要导出的json数据
  // 列标题：问题序号 问题内容  问题图片  问题分值  问题选项A 问题选项B 
  //问题选项C 问题选项D 问题选项E 问题选项F 问题答案  问题答案图片  问题解析  问题解析图片
  let str = '<tr><td>问题序号</td><td>问题内容</td><td>问题图片</td><td>问题分值</td>'
    +'<td>问题选项A</td><td>问题选项B</td><td>问题选项C</td><td>问题选项D</td>'
    +'<td>问题选项E</td><td>问题选项F</td><td>问题答案</td><td>问题答案图片</td>'
    +'<td>问题解析</td><td>问题解析图片</td></tr>';
  //循环遍历，每行加入tr标签，每个单元格加td标签
  for (let i = 0; i < jsonData.length; i++) {
      str += `<tr><td>${i+1}</td>`;
      for (let item in jsonData[i]) {
          //增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${jsonData[i][item]}</td>`;
      }
      str += '</tr>';
  }
  let excelHtml = `
  <html>
      <head>
       <meta charset='utf-8' />
      </head>
       <body>
          <table>
            ${str}
          </table>
       </body>
  </html>
`
  let excelBlob = new Blob([excelHtml], {type: 'application/vnd.ms-excel'})

  // 创建一个a标签
  let oA = document.createElement('a');
  // 利用URL.createObjectURL()方法为a元素生成blob URL
  oA.href = URL.createObjectURL(excelBlob);
  let title = '试卷';
  let modelTitle = document.querySelector('.modeTitle h4');
  if (modelTitle) title = modelTitle.innerText;
  // 给文件命名
  oA.download = title + '.xls';
  // 模拟点击
  oA.click()
}

function saveJSON(){
    let data = jsonData;
    let filename = '试卷.json';
    let modelTitle = document.querySelector('.modeTitle h4');
    if (modelTitle) filename = modelTitle.innerText + '.json';
    if(!data) {
        alert('保存的数据为空');
        return;
    }
    if(!filename)
        filename = 'json.json'
    if(typeof data === 'object'){
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function addExportBtn() {
  let btn = document.createElement('button');
  btn.setAttribute('id', 'exportBtn');
  btn.setAttribute('style', 'color: red;position: absolute;top: 50%;left: 50%;width: 150px;font-size: 30px;');
  btn.innerHTML = "导出";
  document.body.appendChild(btn);
  btn.addEventListener('click', function() {
    tableToExcel();
  });
}
