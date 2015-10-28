﻿//====================================================================================================
// [插件名称] jQuery formValidator
//----------------------------------------------------------------------------------------------------
// [描    述] jQuery formValidator表单验证插件，它是基于jQuery类库，实现了js脚本于页面的分离。对一个表
//            单对象，你只需要写一行代码就可以轻松实现20种以上的脚本控制。现支持一个表单元素累加很多种
//            校验方式,采用配置信息的思想，而不是把信息写4在表单元素上，能比较完美的实现ajax请求。
//----------------------------------------------------------------------------------------------------
// [作者网名] 猫冬
// [邮    箱] wzmaodong@126.com
// [作者博客] http://wzmaodong.cnblogs.com
// [QQ群交流] 74106519
// [更新日期] 2011-04-30
// [版 本 号] ver4.0
//====================================================================================================
(function($){$.formValidator={sustainType:function(a,b){var c=$("#"+a).get(0),d=c.tagName,e=c.type;switch(b.validatetype){case"InitValidator":return!0;case"InputValidator":return d=="INPUT"||d=="TEXTAREA"||d=="SELECT";case"CompareValidator":return d=="INPUT"||d=="TEXTAREA"?e!="checkbox"&&e!="radio":!1;case"AjaxValidator":return e=="text"||e=="textarea"||e=="file"||e=="password"||e=="select-one";case"RegexValidator":return d=="INPUT"||d=="TEXTAREA"?e!="checkbox"&&e!="radio":!1;case"FunctionValidator":return!0}},initConfig:function(a){var b={debug:!1,validatorgroup:"1",alertmessage:!1,validobjectids:[],ajaxobjectids:"",forcevalid:!1,onsuccess:function(){return!0},onerror:function(){},submitonce:!1,formid:"",autotip:!1,tidymode:!1,errorfocus:!0,wideword:!0};a=a||{},$.extend(b,a),b.tidymode&&(b.errorfocus=!1),b.formid!=""&&$("#"+b.formid).submit(function(){return $.formValidator.pageIsValid(b.validatorgroup)}),$("body").data(b.validatorgroup,b)},appendValid:function(a,b){if(!$.formValidator.sustainType(a,b))return-1;var c=$("#"+a).get(0);if(b.validatetype=="InitValidator"||c.settings==undefined)c.settings=[];var d=c.settings.push(b);c.settings[d-1].index=d-1;return d-1},triggerValidate:function(a){switch(a.setting.validatetype){case"InputValidator":$.formValidator.inputValid(a);break;case"CompareValidator":$.formValidator.compareValid(a);break;case"AjaxValidator":$.formValidator.ajaxValid(a);break;case"RegexValidator":$.formValidator.regexValid(a);break;case"FunctionValidator":$.formValidator.functionValid(a)}},setTipState:function(a,b,c){var d=a.settings[0],e=$("body").data(d.validatorgroup),f=$("#"+d.tipid);c==null||c==""?f.hide():e.tidymode?($("#fv_content").html(c),a.Tooltip=c,b!="onError"&&f.hide()):f.show().removeClass().addClass(b).html(c)},resetTipState:function(a){var b=$("body").data(a);$.each(b.validobjectids,function(){$.formValidator.setTipState(this,"onShow",this.settings[0].onshow)})},setFailState:function(a,b){var c=$("#"+a);c.removeClass().addClass("onError").html(b)},showMessage:function(a){var b=a.id,c=$("#"+b).get(0),d=a.isvalid,e=a.setting,f="",g="",h=$("#"+b).get(0).settings,i=$("body").data(h[0].validatorgroup);if(!d){g="onError",e.validatetype=="AjaxValidator"?e.lastValid==""?(g="onLoad",f=e.onwait):f=e.onerror:f=a.errormsg==""?e.onerror:a.errormsg;if(i.alertmessage){var c=$("#"+b).get(0);c.validoldvalue!=$(c).val()&&alert(f)}else $.formValidator.setTipState(c,g,f)}else f=$.formValidator.isEmpty(b)?e.onempty:e.oncorrect,$.formValidator.setTipState(c,"onCorrect",f);return f},showAjaxMessage:function(a){var b=a.setting,c=$("#"+a.id).get(0);c.validoldvalue!=$(c).val()?$.formValidator.ajaxValid(a):(b.isvalid!=undefined&&!b.isvalid&&(c.lastshowclass="onError",c.lastshowmsg=b.onerror),$.formValidator.setTipState(c,c.lastshowclass,c.lastshowmsg))},getLength:function(a){var b=$("#"+a),c=b.get(0);sType=c.type;var d=0;switch(sType){case"text":case"hidden":case"password":case"textarea":case"file":var e=b.val(),f=$("body").data(c.settings[0].validatorgroup);if(f.wideword)for(var g=0;g<e.length;g++)d=d+(e.charCodeAt(g)>=19968&&e.charCodeAt(g)<=40869?2:1);else d=e.length;break;case"checkbox":case"radio":d=$("input[type='"+sType+"'][name='"+b.attr("name")+"']:checked").length;break;case"select-one":d=c.options?c.options.selectedIndex:-1;break;case"select-multiple":d=$("select[name="+c.name+"] option:selected").length}return d},isEmpty:function(a){return $("#"+a).get(0).settings[0].empty&&$.formValidator.getLength(a)==0},isOneValid:function(a){return $.formValidator.oneIsValid(a).isvalid},oneIsValid:function(a){var b=new Object;b.id=a,b.ajax=-1,b.errormsg="";var c=$("#"+a).get(0),d=c.settings,e=d.length;e==1&&(d[0].bind=!1);if(!d[0].bind)return null;for(var f=0;f<e;f++){if(f==0){if($.formValidator.isEmpty(a)){b.isvalid=!0,b.setting=d[0];break}continue}b.setting=d[f],d[f].validatetype!="AjaxValidator"?$.formValidator.triggerValidate(b):b.ajax=f;if(!d[f].isvalid){b.isvalid=!1,b.setting=d[f];break}b.isvalid=!0,b.setting=d[0];if(d[f].validatetype=="AjaxValidator")break}return b},pageIsValid:function(a){if(a==null||a==undefined)a="1";var b=!0,c,d="^",e,f,g="^",h=[],i=$("body").data(a);$.each(i.validobjectids,function(){if(this.settings[0].bind){f=this.name;if(g.indexOf("^"+f+"^")==-1){f&&(g=g+f+"^"),c=$.formValidator.oneIsValid(this.id);if(c){c.isvalid||(b=!1,e==null&&(e=c.id),h[h.length]=c.errormsg==""?c.setting.onerror:c.errormsg);if(!i.alertmessage){var a=this.settings[0].tipid;d.indexOf("^"+a+"^")==-1&&(c.isvalid||(d=d+a+"^"),$.formValidator.showMessage(c))}}}}});if(b)b=i.onsuccess(),i.submitonce&&$(":submit,:button").attr("disabled",!0);else{var j=$("#"+e).get(0);i.onerror(h[0],j,h),e!=""&&i.errorfocus&&$("#"+e).focus()}return!i.debug&&b},ajaxValid:function(a){var b=a.id,c=$("#"+b),d=c.get(0),e=d.settings,f=e[a.ajax],g=f.url;if(c.size()==0&&e[0].empty)a.setting=e[0],a.isvalid=!0,$.formValidator.showMessage(a),f.isvalid=!0;else{var h=$("body").data(e[0].validatorgroup),i=$.param($(h.ajaxobjectids).serializeArray());i="clientid="+b+(i.length>0?"&"+i:""),g=g+(g.indexOf("?")>-1?"&"+i:"?"+i),$.ajax({type:f.type,url:g,cache:f.cache,data:f.data,async:f.async,timeout:f.timeout,dataType:f.datatype,success:function(a,b,c){f.success(a,b,c)?($.formValidator.setTipState(d,"onCorrect",e[0].oncorrect),f.isvalid=!0):($.formValidator.setTipState(d,"onError",f.onerror),f.isvalid=!1)},complete:function(a,b){f.buttons&&f.buttons.length>0&&f.buttons.attr({disabled:!1}),f.complete(a,b)},beforeSend:function(b){f.buttons&&f.buttons.length>0&&f.buttons.attr({disabled:!0});var c=f.beforesend(b);c&&(f.isvalid=!1,$.formValidator.setTipState(d,"onLoad",e[a.ajax].onwait)),f.lastValid="-1";return c},error:function(a,b,c){$.formValidator.setTipState(d,"onError",f.onerror),f.isvalid=!1,f.error(a,b,c)},processData:f.processdata})}},regexValid:function(returnObj){var id=returnObj.id,setting=returnObj.setting,srcTag=$("#"+id).get(0).tagName,elem=$("#"+id).get(0),isvalid;if(elem.settings[0].empty&&elem.value=="")setting.isvalid=!0;else{var regexpresslist;setting.isvalid=!1,typeof setting.regexp=="string"?regexpresslist=[setting.regexp]:regexpresslist=setting.regexp,$.each(regexpresslist,function(i,val){var r=val;setting.datatype=="enum"&&(r=eval("regexEnum."+r));if(r==undefined||r=="")return!0;isvalid=(new RegExp(r,setting.param)).test($("#"+id).val());if(setting.comparetype=="||"&&isvalid){setting.isvalid=!0;return!0}if(setting.comparetype=="&&"&&!isvalid)return!0}),setting.isvalid||(setting.isvalid=isvalid)}},functionValid:function(a){var b=a.id,c=a.setting,d=$("#"+b),e=c.fun(d.val(),d.get(0));e!=undefined&&(typeof e=="string"?(c.isvalid=!1,a.errormsg=e):c.isvalid=e)},inputValid:function(a){var b=a.id,c=a.setting,d=$("#"+b),e=d.get(0),f=d.val(),g=e.type,h=$.formValidator.getLength(b),i=c.empty,j=!1;switch(g){case"text":case"hidden":case"password":case"textarea":case"file":c.type=="size"&&(i=c.empty,i.leftempty||(j=f.replace(/^[ \s]+/,"").length!=f.length),!j&&!i.rightempty&&(j=f.replace(/[ \s]+$/,"").length!=f.length),j&&i.emptyerror&&(a.errormsg=i.emptyerror));case"checkbox":case"select-one":case"select-multiple":case"radio":var k=!1;if(g=="select-one"||g=="select-multiple")c.type="size";var l=c.type;if(l=="size")j||(k=!0),k&&(f=h);else if(l=="date"||l=="datetime"){var m=!1;l=="date"&&(k=isDate(f)),l=="datetime"&&(k=isDate(f)),k&&(f=new Date(f),c.min=new Date(c.min),c.max=new Date(c.max))}else stype=typeof c.min,stype=="number"&&(f=(new Number(f)).valueOf(),isNaN(f)||(k=!0)),stype=="string"&&(k=!0);c.isvalid=!1,k&&(f<c.min||f>c.max?(f<c.min&&c.onerrormin&&(a.errormsg=c.onerrormin),f>c.min&&c.onerrormax&&(a.errormsg=c.onerrormax)):c.isvalid=!0)}},compareValid:function(a){var b=a.id,c=a.setting,d=$("#"+b),e=$("#"+c.desid),f=c.datatype;curvalue=d.val(),ls_data=e.val();if(f=="number")if(!isNaN(curvalue)&&!isNaN(ls_data))curvalue=parseFloat(curvalue),ls_data=parseFloat(ls_data);else return;if(f=="date"||f=="datetime"){var g=!1;f=="date"&&(g=isDate(curvalue)&&isDate(ls_data)),f=="datetime"&&(g=isDateTime(curvalue)&&isDateTime(ls_data));if(g)curvalue=new Date(curvalue),ls_data=new Date(ls_data);else return}switch(c.operateor){case"=":c.isvalid=curvalue==ls_data;break;case"!=":c.isvalid=curvalue!=ls_data;break;case">":c.isvalid=curvalue>ls_data;break;case">=":c.isvalid=curvalue>=ls_data;break;case"<":c.isvalid=curvalue<ls_data;break;case"<=":c.isvalid=curvalue<=ls_data;break;default:c.isvalid=!1}},localTooltip:function(a){a=a||window.event;var b=a.pageX||(a.clientX?a.clientX+document.body.scrollLeft:0),c=a.pageY||(a.clientY?a.clientY+document.body.scrollTop:0);$("#fvtt").css({top:c+2+"px",left:b-40+"px"})},reloadAutoTip:function(a){a==undefined&&(a="1");var b=$("body").data(a),c=$();$.each(b.validobjectids,function(){var a=this.settings;if(b.autotip&&!b.tidymode){var c=a[0],d="#"+c.afterid,e=$(d).offset(),f=e.top,g=$(d).width()+e.left;$("#"+c.tipid).parent().css({left:g+"px",top:f+"px"})}})}},$.fn.formValidator=function(a){var b={validatorgroup:"1",empty:!1,automodify:!1,onshow:"请输入内容",onfocus:"请输入内容",oncorrect:"输入正确",onempty:"输入内容为空",defaultvalue:null,bind:!0,ajax:!0,validatetype:"InitValidator",tipcss:{left:"10px",top:"1px",height:"20px",width:"250px"},triggerevent:"blur",forcevalid:!1,tipid:null,afterid:null};a=a||{},a.validatorgroup==undefined&&(a.validatorgroup="1");var c=$("body").data(a.validatorgroup);c.tidymode&&(b.tipcss={left:"2px",width:"22px",height:"22px",display:"none"}),$.extend(!0,b,a);return this.each(function(a){var d=$(this),e={};$.extend(!0,e,b);var f=e.tipid?e.tipid:this.id+"Tip";if(c.autotip)if(!c.tidymode){if($("body [id="+f+"]").length==0){var g=e.relativeid?e.relativeid:this.id,h=$("#"+g).position(),i=h.top,j=$("#"+g).width()+h.left;$("<div class='formValidateTip'></div>").appendTo($("body")).css({left:j+"px",top:i+"px"}).prepend($('<div id="'+f+'"></div>').css(e.tipcss)),b.afterid=g}}else d.showTooltips();b.tipid=f,$.formValidator.appendValid(this.id,b);if($.inArray(d,c.validobjectids)==-1){if(e.ajax){var k=c.ajaxobjectids;c.ajaxobjectids=k+(k!=""?",#":"#")+this.id}c.validobjectids.push(this)}c.alertmessage||$.formValidator.setTipState(this,"onShow",b.onshow);var l=this.tagName.toLowerCase(),m=this.type,n=b.defaultvalue;n&&d.val(n),l=="input"||l=="textarea"?(d.focus(function(){if(!c.alertmessage){var a=$("#"+f);this.lastshowclass=a.attr("class"),this.lastshowmsg=a.html(),$.formValidator.setTipState(this,"onFocus",b.onfocus)}if(m=="password"||m=="text"||m=="textarea"||m=="file")this.validoldvalue=d.val()}),d.bind(b.triggerevent,function(){var a=this.settings,d=$.formValidator.oneIsValid(this.id);if(d!=null)if(d.ajax>=0)$.formValidator.showAjaxMessage(d);else{var e=$.formValidator.showMessage(d);if(!d.isvalid){var f=b.automodify&&(this.type=="text"||this.type=="textarea"||this.type=="file");if(f&&!c.alertmessage)alert(e),$(this).val(this.validoldvalue),$.formValidator.setTipState(this,"onShow",b.onshow);else if(c.forcevalid||b.forcevalid)alert(e),this.focus()}}})):l=="select"&&d.bind({focus:function(){c.alertmessage||$.formValidator.setTipState(this,"onFocus",b.onfocus)},blur:function(){d.trigger("change")},change:function(){var a=$.formValidator.oneIsValid(this.id);a!=null&&(a.ajax>=0?$.formValidator.showAjaxMessage(a):$.formValidator.showMessage(a))}})})},$.fn.inputValidator=function(a){var b={isvalid:!1,min:0,max:99999999999999,type:"size",onerror:"输入错误",validatetype:"InputValidator",empty:{leftempty:!0,rightempty:!0,leftemptyerror:null,rightemptyerror:null},wideword:!0};a=a||{},$.extend(!0,b,a);return this.each(function(){$.formValidator.appendValid(this.id,b)})},$.fn.compareValidator=function(a){var b={isvalid:!1,desid:"",operateor:"=",onerror:"输入错误",validatetype:"CompareValidator"};a=a||{},$.extend(!0,b,a);return this.each(function(){$.formValidator.appendValid(this.id,b)})},$.fn.regexValidator=function(a){var b={isvalid:!1,regexp:"",param:"i",datatype:"string",comparetype:"||",onerror:"输入的格式不正确",validatetype:"RegexValidator"};a=a||{},$.extend(!0,b,a);return this.each(function(){$.formValidator.appendValid(this.id,b)})},$.fn.functionValidator=function(a){var b={isvalid:!0,fun:function(){this.isvalid=!0},validatetype:"FunctionValidator",onerror:"输入错误"};a=a||{},$.extend(!0,b,a);return this.each(function(){$.formValidator.appendValid(this.id,b)})},$.fn.ajaxValidator=function(a){var b={isvalid:!1,lastValid:"",type:"GET",url:"",datatype:"html",timeout:999,data:"",async:!1,cache:!1,beforesend:function(){return!0},success:function(){return!0},complete:function(){},processdata:!1,error:function(){},buttons:null,onerror:"服务器校验没有通过",onwait:"正在等待服务器返回数据",validatetype:"AjaxValidator"};a=a||{},$.extend(!0,b,a);return this.each(function(){$.formValidator.appendValid(this.id,b)})},$.fn.defaultPassed=function(a){return this.each(function(){var b=this.settings;for(var c=1;c<b.length;c++){b[c].isvalid=!0;if(!$("body").data(b[0].validatorgroup).alertmessage){var d=a?"onShow":"onCorrect";$.formValidator.setTipState(this,d,b[0].oncorrect)}}})},$.fn.unFormValidator=function(a){return this.each(function(){this.settings[0].bind=!a,a?$("#"+this.settings[0].tipid).hide():$("#"+this.settings[0].tipid).show()})},$.fn.showTooltips=function(){$("body [id=fvtt]").length==0&&(fvtt=$("<div id='fvtt' style='position:absolute;z-index:56002'></div>"),$("body").append(fvtt),fvtt.before("<iframe src='about:blank' class='fv_iframe' scrolling='no' frameborder='0'></iframe>"));return this.each(function(){jqobj=$(this),s=$("<span class='top' id=fv_content style='display:block'></span>"),b=$("<b class='bottom' style='display:block' />"),this.tooltip=$("<span class='fv_tooltip' style='display:block'></span>").append(s).append(b).css({filter:"alpha(opacity:95)",KHTMLOpacity:"0.95",MozOpacity:"0.95",opacity:"0.95"}),jqobj.bind({mouseover:function(a){$("#fvtt").append(this.tooltip),$("#fv_content").html(this.Tooltip),$.formValidator.localTooltip(a)},mouseout:function(){$("#fvtt").empty()},mousemove:function(a){$("#fv_content").html(this.Tooltip),$.formValidator.localTooltip(a)}})})}})(jQuery)