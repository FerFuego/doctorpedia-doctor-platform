var bkExtend=function(){var t=arguments;for(var e in 1==t.length&&(t=[this,t[0]]),t[1])t[0][e]=t[1][e];return t[0]};function bkClass(){}bkClass.prototype.construct=function(){},bkClass.extend=function(t){var e=function(){if(arguments[0]!==bkClass)return this.construct.apply(this,arguments)},n=new this(bkClass);return bkExtend(n,t),e.prototype=n,e.extend=this.extend,e};var bkElement=bkClass.extend({construct:function(t,e){return"string"==typeof t&&(t=(e||document).createElement(t)),t=$BK(t)},appendTo:function(t){return t.appendChild(this),this},appendBefore:function(t){return t.parentNode.insertBefore(this,t),this},addEvent:function(t,e){return bkLib.addEvent(this,t,e),this},setContent:function(t){return this.innerHTML=t,this},pos:function(){var t=curtop=0;obj=this;if(obj.offsetParent)do{t+=obj.offsetLeft,curtop+=obj.offsetTop}while(obj=obj.offsetParent);var e=window.opera?0:parseInt(this.getStyle("border-width")||this.style.border)||0;return[t+e,curtop+e+this.offsetHeight]},noSelect:function(){return bkLib.noSelect(this),this},parentTag:function(t){var e=this;do{if(e&&e.nodeName&&e.nodeName.toUpperCase()==t)return e;e=e.parentNode}while(e);return!1},hasClass:function(t){return this.className.match(new RegExp("(\\s|^)nicEdit-"+t+"(\\s|$)"))},addClass:function(t){return this.hasClass(t)||(this.className+=" nicEdit-"+t),this},removeClass:function(t){return this.hasClass(t)&&(this.className=this.className.replace(new RegExp("(\\s|^)nicEdit-"+t+"(\\s|$)")," ")),this},setStyle:function(t){var e=this.style;for(var n in t)switch(n){case"float":e.cssFloat=e.styleFloat=t[n];break;case"opacity":e.opacity=t[n],e.filter="alpha(opacity="+Math.round(100*t[n])+")";break;case"className":this.className=t[n];break;default:e[n]=t[n]}return this},getStyle:function(t,e){var n=e||document.defaultView;if(1==this.nodeType)return n&&n.getComputedStyle?n.getComputedStyle(this,null).getPropertyValue(t):this.currentStyle[bkLib.camelize(t)]},remove:function(){return this.parentNode.removeChild(this),this},setAttributes:function(t){for(var e in t)this[e]=t[e];return this}}),bkLib={isMSIE:-1!=navigator.appVersion.indexOf("MSIE"),addEvent:function(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent("on"+e,n)},toArray:function(t){for(var e=t.length,n=new Array(e);e--;)n[e]=t[e];return n},noSelect:function(t){t.setAttribute&&"input"!=t.nodeName.toLowerCase()&&"textarea"!=t.nodeName.toLowerCase()&&t.setAttribute("unselectable","on");for(var e=0;e<t.childNodes.length;e++)bkLib.noSelect(t.childNodes[e])},camelize:function(t){return t.replace(/\-(.)/g,function(t,e){return e.toUpperCase()})},inArray:function(t,e){return null!=bkLib.search(t,e)},search:function(t,e){for(var n=0;n<t.length;n++)if(t[n]==e)return n;return null},cancelEvent:function(t){return(t=t||window.event).preventDefault&&t.stopPropagation&&(t.preventDefault(),t.stopPropagation()),!1},domLoad:[],domLoaded:function(){if(!arguments.callee.done)for(arguments.callee.done=!0,i=0;i<bkLib.domLoad.length;i++)bkLib.domLoad[i]()},onDomLoaded:function(t){this.domLoad.push(t),document.addEventListener?document.addEventListener("DOMContentLoaded",bkLib.domLoaded,null):bkLib.isMSIE&&(document.write("<style>.nicEdit-main p { margin: 0; }</style><script id=__ie_onload defer "+("https:"==location.protocol?"src='javascript:void(0)'":"src=//0")+"><\/script>"),$BK("__ie_onload").onreadystatechange=function(){"complete"==this.readyState&&bkLib.domLoaded()}),window.onload=bkLib.domLoaded}};function $BK(t){return"string"==typeof t&&(t=document.getElementById(t)),t&&!t.appendTo?bkExtend(t,bkElement.prototype):t}var bkEvent={addEvent:function(t,e){return e&&(this.eventList=this.eventList||{},this.eventList[t]=this.eventList[t]||[],this.eventList[t].push(e)),this},fireEvent:function(){var t=bkLib.toArray(arguments),e=t.shift();if(this.eventList&&this.eventList[e])for(var n=0;n<this.eventList[e].length;n++)this.eventList[e][n].apply(this,t)}};function __(t){return t}Function.prototype.closure=function(){var t=this,e=bkLib.toArray(arguments),n=e.shift();return function(){if(void 0!==bkLib)return t.apply(n,e.concat(bkLib.toArray(arguments)))}},Function.prototype.closureListener=function(){var t=this,e=bkLib.toArray(arguments),n=e.shift();return function(i){if((i=i||window.event).target)var s=i.target;else s=i.srcElement;return t.apply(n,[i,s].concat(e))}};var nicEditorConfig=bkClass.extend({buttons:{bold:{name:__("Click to Bold"),command:"Bold",tags:["B","STRONG"],css:{"font-weight":"bold"},key:"b"},italic:{name:__("Click to Italic"),command:"Italic",tags:["EM","I"],css:{"font-style":"italic"},key:"i"},underline:{name:__("Click to Underline"),command:"Underline",tags:["U"],css:{"text-decoration":"underline"},key:"u"},left:{name:__("Left Align"),command:"justifyleft",noActive:!0},center:{name:__("Center Align"),command:"justifycenter",noActive:!0},right:{name:__("Right Align"),command:"justifyright",noActive:!0},justify:{name:__("Justify Align"),command:"justifyfull",noActive:!0},ol:{name:__("Insert Ordered List"),command:"insertorderedlist",tags:["OL"]},ul:{name:__("Insert Unordered List"),command:"insertunorderedlist",tags:["UL"]},subscript:{name:__("Click to Subscript"),command:"subscript",tags:["SUB"]},superscript:{name:__("Click to Superscript"),command:"superscript",tags:["SUP"]},strikethrough:{name:__("Click to Strike Through"),command:"strikeThrough",css:{"text-decoration":"line-through"}},removeformat:{name:__("Remove Formatting"),command:"removeformat",noActive:!0},indent:{name:__("Indent Text"),command:"indent",noActive:!0},outdent:{name:__("Remove Indent"),command:"outdent",noActive:!0},hr:{name:__("Horizontal Rule"),command:"insertHorizontalRule",noActive:!0}},iconsPath:"http://js.nicedit.com/nicEditIcons-latest.gif",buttonList:["save","bold","italic","underline","left","center","right","justify","ol","ul","fontSize","fontFamily","fontFormat","indent","outdent","image","upload","link","unlink","forecolor","bgcolor"],iconList:{xhtml:1,bgcolor:2,forecolor:3,bold:4,center:5,hr:6,indent:7,italic:8,justify:9,left:10,ol:11,outdent:12,removeformat:13,right:14,save:25,strikethrough:16,subscript:17,superscript:18,ul:19,underline:20,image:21,link:22,unlink:23,close:24,arrow:26,upload:27}}),nicEditors={nicPlugins:[],editors:[],registerPlugin:function(t,e){this.nicPlugins.push({p:t,o:e})},allTextAreas:function(t){for(var e=document.getElementsByTagName("textarea"),n=0;n<e.length;n++)nicEditors.editors.push(new nicEditor(t).panelInstance(e[n]));return nicEditors.editors},findEditor:function(t){for(var e=nicEditors.editors,n=0;n<e.length;n++)if(e[n].instanceById(t))return e[n].instanceById(t)}},nicEditor=bkClass.extend({construct:function(t){this.options=new nicEditorConfig,bkExtend(this.options,t),this.nicInstances=new Array,this.loadedPlugins=new Array;for(var e=nicEditors.nicPlugins,n=0;n<e.length;n++)this.loadedPlugins.push(new e[n].p(this,e[n].o));nicEditors.editors.push(this),bkLib.addEvent(document.body,"mousedown",this.selectCheck.closureListener(this))},panelInstance:function(t,e){t=this.checkReplace($BK(t));var n=new bkElement("DIV").setStyle({width:(parseInt(t.getStyle("width"))||t.clientWidth)+"px"}).appendBefore(t);return this.setPanel(n),this.addInstance(t,e)},checkReplace:function(t){var e=nicEditors.findEditor(t);return e&&(e.removeInstance(t),e.removePanel()),t},addInstance:function(t,e){if((t=this.checkReplace($BK(t))).contentEditable||window.opera)var n=new nicEditorInstance(t,e,this);else n=new nicEditorIFrameInstance(t,e,this);return this.nicInstances.push(n),this},removeInstance:function(t){t=$BK(t);for(var e=this.nicInstances,n=0;n<e.length;n++)e[n].e==t&&(e[n].remove(),this.nicInstances.splice(n,1))},removePanel:function(t){this.nicPanel&&(this.nicPanel.remove(),this.nicPanel=null)},instanceById:function(t){t=$BK(t);for(var e=this.nicInstances,n=0;n<e.length;n++)if(e[n].e==t)return e[n]},setPanel:function(t){return this.nicPanel=new nicEditorPanel($BK(t),this.options,this),this.fireEvent("panel",this.nicPanel),this},nicCommand:function(t,e){this.selectedInstance&&this.selectedInstance.nicCommand(t,e)},getIcon:function(t,e){var n=this.options.iconList[t],i=e.iconFiles?e.iconFiles[t]:"";return{backgroundImage:"url('"+(n?this.options.iconsPath:i)+"')",backgroundPosition:(n?-18*(n-1):0)+"px 0px"}},selectCheck:function(t,e){do{if(e.className&&-1!=e.className.indexOf("nicEdit"))return!1}while(e=e.parentNode);return this.fireEvent("blur",this.selectedInstance,e),this.lastSelectedInstance=this.selectedInstance,this.selectedInstance=null,!1}});nicEditor=nicEditor.extend(bkEvent);var nicEditorInstance=bkClass.extend({isSelected:!1,construct:function(t,e,n){this.ne=n,this.elm=this.e=t,this.options=e||{},newX=parseInt(t.getStyle("width"))||t.clientWidth,newY=parseInt(t.getStyle("height"))||t.clientHeight,this.initialHeight=newY-8;var i="textarea"==t.nodeName.toLowerCase();if(i||this.options.hasPanel){var s=bkLib.isMSIE&&!(void 0!==document.body.style.maxHeight&&"CSS1Compat"==document.compatMode),o={width:newX+"px",border:"1px solid #ccc",borderTop:0,overflowY:"auto",overflowX:"hidden"};o[s?"height":"maxHeight"]=this.ne.options.maxHeight?this.ne.options.maxHeight+"px":null,this.editorContain=new bkElement("DIV").setStyle(o).appendBefore(t);var a=new bkElement("DIV").setStyle({width:newX-8+"px",margin:"4px",minHeight:newY+"px"}).addClass("main").appendTo(this.editorContain);if(t.setStyle({display:"none"}),a.innerHTML=t.innerHTML,i){a.setContent(t.value),this.copyElm=t;var r=t.parentTag("FORM");r&&bkLib.addEvent(r,"submit",this.saveContent.closure(this))}a.setStyle(s?{height:newY+"px"}:{overflow:"hidden"}),this.elm=a}this.ne.addEvent("blur",this.blur.closure(this)),this.init(),this.blur()},init:function(){this.elm.setAttribute("contentEditable","true"),""==this.getContent()&&this.setContent("<br />"),this.instanceDoc=document.defaultView,this.elm.addEvent("mousedown",this.selected.closureListener(this)).addEvent("keypress",this.keyDown.closureListener(this)).addEvent("focus",this.selected.closure(this)).addEvent("blur",this.blur.closure(this)).addEvent("keyup",this.selected.closure(this)),this.ne.fireEvent("add",this)},remove:function(){this.saveContent(),(this.copyElm||this.options.hasPanel)&&(this.editorContain.remove(),this.e.setStyle({display:"block"}),this.ne.removePanel()),this.disable(),this.ne.fireEvent("remove",this)},disable:function(){this.elm.setAttribute("contentEditable","false")},getSel:function(){return window.getSelection?window.getSelection():document.selection},getRng:function(){var t=this.getSel();if(t&&0!==t.rangeCount)return t.rangeCount>0?t.getRangeAt(0):t.createRange()},selRng:function(t,e){window.getSelection?(e.removeAllRanges(),e.addRange(t)):t.select()},selElm:function(){var t=this.getRng();if(t){if(t.startContainer){var e=t.startContainer;if(1==t.cloneContents().childNodes.length)for(var n=0;n<e.childNodes.length;n++){var i=e.childNodes[n].ownerDocument.createRange();if(i.selectNode(e.childNodes[n]),1!=t.compareBoundaryPoints(Range.START_TO_START,i)&&-1!=t.compareBoundaryPoints(Range.END_TO_END,i))return $BK(e.childNodes[n])}return $BK(e)}return $BK("Control"==this.getSel().type?t.item(0):t.parentElement())}},saveRng:function(){this.savedRange=this.getRng(),this.savedSel=this.getSel()},restoreRng:function(){this.savedRange&&this.selRng(this.savedRange,this.savedSel)},keyDown:function(t,e){t.ctrlKey&&this.ne.fireEvent("key",this,t)},selected:function(t,e){if(e||(e=this.selElm)||(e=this.selElm()),!t.ctrlKey){var n=this.ne.selectedInstance;n!=this&&(n&&this.ne.fireEvent("blur",n,e),this.ne.selectedInstance=this,this.ne.fireEvent("focus",n,e)),this.ne.fireEvent("selected",n,e),this.isFocused=!0,this.elm.addClass("selected")}return!1},blur:function(){this.isFocused=!1,this.elm.removeClass("selected")},saveContent:function(){(this.copyElm||this.options.hasPanel)&&(this.ne.fireEvent("save",this),this.copyElm?this.copyElm.value=this.getContent():this.e.innerHTML=this.getContent())},getElm:function(){return this.elm},getContent:function(){return this.content=this.getElm().innerHTML,this.ne.fireEvent("get",this),this.content},setContent:function(t){this.content=t,this.ne.fireEvent("set",this),this.elm.innerHTML=this.content},nicCommand:function(t,e){document.execCommand(t,!1,e)}}),nicEditorIFrameInstance=nicEditorInstance.extend({savedStyles:[],init:function(){var t=this.elm.innerHTML.replace(/^\s+|\s+$/g,"");this.elm.innerHTML="",t||(t="<br />"),this.initialContent=t,this.elmFrame=new bkElement("iframe").setAttributes({src:"javascript:;",frameBorder:0,allowTransparency:"true",scrolling:"no"}).setStyle({height:"100px",width:"100%"}).addClass("frame").appendTo(this.elm),this.copyElm&&this.elmFrame.setStyle({width:this.elm.offsetWidth-4+"px"});for(itm in["font-size","font-family","font-weight","color"])this.savedStyles[bkLib.camelize(itm)]=this.elm.getStyle(itm);setTimeout(this.initFrame.closure(this),50)},disable:function(){this.elm.innerHTML=this.getContent()},initFrame:function(){var t=$BK(this.elmFrame.contentWindow.document);t.designMode="on",t.open();var e=this.ne.options.externalCSS;t.write("<html><head>"+(e?'<link href="'+e+'" rel="stylesheet" type="text/css" />':"")+'</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">'+this.initialContent+"</body></html>"),t.close(),this.frameDoc=t,this.frameWin=$BK(this.elmFrame.contentWindow),this.frameContent=$BK(this.frameWin.document.body).setStyle(this.savedStyles),this.instanceDoc=this.frameWin.document.defaultView,this.heightUpdate(),this.frameDoc.addEvent("mousedown",this.selected.closureListener(this)).addEvent("keyup",this.heightUpdate.closureListener(this)).addEvent("keydown",this.keyDown.closureListener(this)).addEvent("keyup",this.selected.closure(this)),this.ne.fireEvent("add",this)},getElm:function(){return this.frameContent},setContent:function(t){this.content=t,this.ne.fireEvent("set",this),this.frameContent.innerHTML=this.content,this.heightUpdate()},getSel:function(){return this.frameWin?this.frameWin.getSelection():this.frameDoc.selection},heightUpdate:function(){this.elmFrame.style.height=Math.max(this.frameContent.offsetHeight,this.initialHeight)+"px"},nicCommand:function(t,e){this.frameDoc.execCommand(t,!1,e),setTimeout(this.heightUpdate.closure(this),100)}}),nicEditorPanel=bkClass.extend({construct:function(t,e,n){this.elm=t,this.options=e,this.ne=n,this.panelButtons=new Array,this.buttonList=bkExtend([],this.ne.options.buttonList),this.panelContain=new bkElement("DIV").setStyle({overflow:"hidden",width:"100%",border:"1px solid #cccccc",backgroundColor:"#efefef"}).addClass("panelContain"),this.panelElm=new bkElement("DIV").setStyle({margin:"2px",marginTop:"0px",zoom:1,overflow:"hidden"}).addClass("panel").appendTo(this.panelContain),this.panelContain.appendTo(t);var i=this.ne.options,s=i.buttons;for(button in s)this.addButton(button,i,!0);this.reorder(),t.noSelect()},addButton:function(buttonName,options,noOrder){var button=options.buttons[buttonName],type=button.type?eval("(typeof("+button.type+') == "undefined") ? null : '+button.type+";"):nicEditorButton,hasButton=bkLib.inArray(this.buttonList,buttonName);type&&(hasButton||this.ne.options.fullPanel)&&(this.panelButtons.push(new type(this.panelElm,buttonName,options,this.ne)),hasButton||this.buttonList.push(buttonName))},findButton:function(t){for(var e=0;e<this.panelButtons.length;e++)if(this.panelButtons[e].name==t)return this.panelButtons[e]},reorder:function(){for(var t=this.buttonList,e=0;e<t.length;e++){var n=this.findButton(t[e]);n&&this.panelElm.appendChild(n.margin)}},remove:function(){this.elm.remove()}}),nicEditorButton=bkClass.extend({construct:function(t,e,n,i){this.options=n.buttons[e],this.name=e,this.ne=i,this.elm=t,this.margin=new bkElement("DIV").setStyle({float:"left",marginTop:"2px"}).appendTo(t),this.contain=new bkElement("DIV").setStyle({width:"20px",height:"20px"}).addClass("buttonContain").appendTo(this.margin),this.border=new bkElement("DIV").setStyle({backgroundColor:"#efefef",border:"1px solid #efefef"}).appendTo(this.contain),this.button=new bkElement("DIV").setStyle({width:"18px",height:"18px",overflow:"hidden",zoom:1,cursor:"pointer"}).addClass("button").setStyle(this.ne.getIcon(e,n)).appendTo(this.border),this.button.addEvent("mouseover",this.hoverOn.closure(this)).addEvent("mouseout",this.hoverOff.closure(this)).addEvent("mousedown",this.mouseClick.closure(this)).noSelect(),window.opera||(this.button.onmousedown=this.button.onclick=bkLib.cancelEvent),i.addEvent("selected",this.enable.closure(this)).addEvent("blur",this.disable.closure(this)).addEvent("key",this.key.closure(this)),this.disable(),this.init()},init:function(){},hide:function(){this.contain.setStyle({display:"none"})},updateState:function(){this.isDisabled?this.setBg():this.isHover?this.setBg("hover"):this.isActive?this.setBg("active"):this.setBg()},setBg:function(t){switch(t){case"hover":var e={border:"1px solid #666",backgroundColor:"#ddd"};break;case"active":e={border:"1px solid #666",backgroundColor:"#ccc"};break;default:e={border:"1px solid #efefef",backgroundColor:"#efefef"}}this.border.setStyle(e).addClass("button-"+t)},checkNodes:function(t){var e=t;do{if(this.options.tags&&bkLib.inArray(this.options.tags,e.nodeName))return this.activate(),!0}while(e=e.parentNode&&"nicEdit"!=e.className);for(e=$BK(t);3==e.nodeType;)e=$BK(e.parentNode);if(this.options.css)for(itm in this.options.css)if(e.getStyle(itm,this.ne.selectedInstance.instanceDoc)==this.options.css[itm])return this.activate(),!0;return this.deactivate(),!1},activate:function(){this.isDisabled||(this.isActive=!0,this.updateState(),this.ne.fireEvent("buttonActivate",this))},deactivate:function(){this.isActive=!1,this.updateState(),this.isDisabled||this.ne.fireEvent("buttonDeactivate",this)},enable:function(t,e){this.isDisabled=!1,this.contain.setStyle({opacity:1}).addClass("buttonEnabled"),this.updateState(),this.checkNodes(e)},disable:function(t,e){this.isDisabled=!0,this.contain.setStyle({opacity:.6}).removeClass("buttonEnabled"),this.updateState()},toggleActive:function(){this.isActive?this.deactivate():this.activate()},hoverOn:function(){this.isDisabled||(this.isHover=!0,this.updateState(),this.ne.fireEvent("buttonOver",this))},hoverOff:function(){this.isHover=!1,this.updateState(),this.ne.fireEvent("buttonOut",this)},mouseClick:function(){this.options.command&&(this.ne.nicCommand(this.options.command,this.options.commandArgs),this.options.noActive||this.toggleActive()),this.ne.fireEvent("buttonClick",this)},key:function(t,e){this.options.key&&e.ctrlKey&&String.fromCharCode(e.keyCode||e.charCode).toLowerCase()==this.options.key&&(this.mouseClick(),e.preventDefault&&e.preventDefault())}}),nicPlugin=bkClass.extend({construct:function(t,e){this.options=e,this.ne=t,this.ne.addEvent("panel",this.loadPanel.closure(this)),this.init()},loadPanel:function(t){var e=this.options.buttons;for(var n in e)t.addButton(n,this.options);t.reorder()},init:function(){}}),nicPaneOptions={},nicEditorPane=bkClass.extend({construct:function(t,e,n,i){this.ne=e,this.elm=t,this.pos=t.pos(),this.contain=new bkElement("div").setStyle({zIndex:"99999",overflow:"hidden",position:"absolute",left:this.pos[0]+"px",top:this.pos[1]+"px"}),this.pane=new bkElement("div").setStyle({fontSize:"12px",border:"1px solid #ccc",overflow:"hidden",padding:"4px",textAlign:"left",backgroundColor:"#ffffc9"}).addClass("pane").setStyle(n).appendTo(this.contain),i&&!i.options.noClose&&(this.close=new bkElement("div").setStyle({float:"right",height:"16px",width:"16px",cursor:"pointer"}).setStyle(this.ne.getIcon("close",nicPaneOptions)).addEvent("mousedown",i.removePane.closure(this)).appendTo(this.pane)),this.contain.noSelect().appendTo(document.body),this.position(),this.init()},init:function(){},position:function(){if(this.ne.nicPanel){var t=this.ne.nicPanel.elm,e=t.pos()[0]+parseInt(t.getStyle("width"))-(parseInt(this.pane.getStyle("width"))+8);e<this.pos[0]&&this.contain.setStyle({left:e+"px"})}},toggle:function(){this.isVisible=!this.isVisible,this.contain.setStyle({display:this.isVisible?"block":"none"})},remove:function(){this.contain&&(this.contain.remove(),this.contain=null)},append:function(t){t.appendTo(this.pane)},setContent:function(t){this.pane.setContent(t)}}),nicSelectOptions={buttons:{fontSize:{name:__("Select Font Size"),type:"nicEditorFontSizeSelect",command:"fontsize"},fontFamily:{name:__("Select Font Family"),type:"nicEditorFontFamilySelect",command:"fontname"},fontFormat:{name:__("Select Font Format"),type:"nicEditorFontFormatSelect",command:"formatBlock"}}},nicEditorSelect=bkClass.extend({construct:function(t,e,n,i){this.options=n.buttons[e],this.elm=t,this.ne=i,this.name=e,this.selOptions=new Array,this.margin=new bkElement("div").setStyle({float:"left",margin:"2px 1px 0 1px"}).appendTo(this.elm),this.contain=new bkElement("div").setStyle({width:"90px",height:"20px",cursor:"pointer",overflow:"hidden"}).addClass("selectContain").addEvent("click",this.toggle.closure(this)).appendTo(this.margin),this.items=new bkElement("div").setStyle({overflow:"hidden",zoom:1,border:"1px solid #ccc",paddingLeft:"3px",backgroundColor:"#fff"}).appendTo(this.contain),this.control=new bkElement("div").setStyle({overflow:"hidden",float:"right",height:"18px",width:"16px"}).addClass("selectControl").setStyle(this.ne.getIcon("arrow",n)).appendTo(this.items),this.txt=new bkElement("div").setStyle({overflow:"hidden",float:"left",width:"66px",height:"14px",marginTop:"1px",fontFamily:"sans-serif",textAlign:"center",fontSize:"12px"}).addClass("selectTxt").appendTo(this.items),window.opera||(this.contain.onmousedown=this.control.onmousedown=this.txt.onmousedown=bkLib.cancelEvent),this.margin.noSelect(),this.ne.addEvent("selected",this.enable.closure(this)).addEvent("blur",this.disable.closure(this)),this.disable(),this.init()},disable:function(){this.isDisabled=!0,this.close(),this.contain.setStyle({opacity:.6})},enable:function(t){this.isDisabled=!1,this.close(),this.contain.setStyle({opacity:1})},setDisplay:function(t){this.txt.setContent(t)},toggle:function(){this.isDisabled||(this.pane?this.close():this.open())},open:function(){this.pane=new nicEditorPane(this.items,this.ne,{width:"88px",padding:"0px",borderTop:0,borderLeft:"1px solid #ccc",borderRight:"1px solid #ccc",borderBottom:"0px",backgroundColor:"#fff"});for(var t=0;t<this.selOptions.length;t++){var e=this.selOptions[t],n=new bkElement("div").setStyle({overflow:"hidden",borderBottom:"1px solid #ccc",width:"88px",textAlign:"left",overflow:"hidden",cursor:"pointer"}),i=new bkElement("div").setStyle({padding:"0px 4px"}).setContent(e[1]).appendTo(n).noSelect();i.addEvent("click",this.update.closure(this,e[0])).addEvent("mouseover",this.over.closure(this,i)).addEvent("mouseout",this.out.closure(this,i)).setAttributes("id",e[0]),this.pane.append(n),window.opera||(i.onmousedown=bkLib.cancelEvent)}},close:function(){this.pane&&(this.pane=this.pane.remove())},over:function(t){t.setStyle({backgroundColor:"#ccc"})},out:function(t){t.setStyle({backgroundColor:"#fff"})},add:function(t,e){this.selOptions.push(new Array(t,e))},update:function(t){this.ne.nicCommand(this.options.command,t),this.close()}}),nicEditorFontSizeSelect=nicEditorSelect.extend({sel:{1:"1&nbsp;(8pt)",2:"2&nbsp;(10pt)",3:"3&nbsp;(12pt)",4:"4&nbsp;(14pt)",5:"5&nbsp;(18pt)",6:"6&nbsp;(24pt)"},init:function(){for(itm in this.setDisplay("Font&nbsp;Size..."),this.sel)this.add(itm,'<font size="'+itm+'">'+this.sel[itm]+"</font>")}}),nicEditorFontFamilySelect=nicEditorSelect.extend({sel:{arial:"Arial","comic sans ms":"Comic Sans","courier new":"Courier New",georgia:"Georgia",helvetica:"Helvetica",impact:"Impact","times new roman":"Times","trebuchet ms":"Trebuchet",verdana:"Verdana"},init:function(){for(itm in this.setDisplay("Font&nbsp;Family..."),this.sel)this.add(itm,'<font face="'+itm+'">'+this.sel[itm]+"</font>")}}),nicEditorFontFormatSelect=nicEditorSelect.extend({sel:{p:"Paragraph",pre:"Pre",h6:"Heading&nbsp;6",h5:"Heading&nbsp;5",h4:"Heading&nbsp;4",h3:"Heading&nbsp;3",h2:"Heading&nbsp;2",h1:"Heading&nbsp;1"},init:function(){for(itm in this.setDisplay("Font&nbsp;Format..."),this.sel){var t=itm.toUpperCase();this.add("<"+t+">","<"+itm+' style="padding: 0px; margin: 0px;">'+this.sel[itm]+"</"+t+">")}}});nicEditors.registerPlugin(nicPlugin,nicSelectOptions);var nicButtonTips=bkClass.extend({construct:function(t){this.ne=t,t.addEvent("buttonOver",this.show.closure(this)).addEvent("buttonOut",this.hide.closure(this))},show:function(t){this.timer=setTimeout(this.create.closure(this,t),400)},create:function(t){this.timer=null,this.pane||(this.pane=new nicEditorPane(t.button,this.ne,{fontSize:"12px",marginTop:"5px"}),this.pane.setContent(t.options.name))},hide:function(t){this.timer&&clearTimeout(this.timer),this.pane&&(this.pane=this.pane.remove())}});nicEditors.registerPlugin(nicButtonTips);var nicEditorAdvancedButton=nicEditorButton.extend({init:function(){this.ne.addEvent("selected",this.removePane.closure(this)).addEvent("blur",this.removePane.closure(this))},mouseClick:function(){this.isDisabled||(this.pane&&this.pane.pane?this.removePane():(this.pane=new nicEditorPane(this.contain,this.ne,{width:this.width||"270px",backgroundColor:"#fff"},this),this.addPane(),this.ne.selectedInstance.saveRng()))},addForm:function(t,e){for(itm in this.form=new bkElement("form").addEvent("submit",this.submit.closureListener(this)),this.pane.append(this.form),this.inputs={},t){var n=t[itm],i="";e&&(i=e.getAttribute(itm)),i||(i=n.value||"");var s=t[itm].type;if("title"==s)new bkElement("div").setContent(n.txt).setStyle({fontSize:"14px",fontWeight:"bold",padding:"0px",margin:"2px 0"}).appendTo(this.form);else{var o=new bkElement("div").setStyle({overflow:"hidden",clear:"both"}).appendTo(this.form);switch(n.txt&&new bkElement("label").setAttributes({for:itm}).setContent(n.txt).setStyle({margin:"2px 4px",fontSize:"13px",width:"50px",lineHeight:"20px",textAlign:"right",float:"left"}).appendTo(o),s){case"text":this.inputs[itm]=new bkElement("input").setAttributes({id:itm,value:i,type:"text"}).setStyle({margin:"2px 0",fontSize:"13px",float:"left",height:"20px",border:"1px solid #ccc",overflow:"hidden"}).setStyle(n.style).appendTo(o);break;case"select":for(opt in this.inputs[itm]=new bkElement("select").setAttributes({id:itm}).setStyle({border:"1px solid #ccc",float:"left",margin:"2px 0"}).appendTo(o),n.options)new bkElement("option").setAttributes({value:opt,selected:opt==i?"selected":""}).setContent(n.options[opt]).appendTo(this.inputs[itm]);break;case"content":this.inputs[itm]=new bkElement("textarea").setAttributes({id:itm}).setStyle({border:"1px solid #ccc",float:"left"}).setStyle(n.style).appendTo(o),this.inputs[itm].value=i}}}new bkElement("input").setAttributes({type:"submit"}).setStyle({backgroundColor:"#efefef",border:"1px solid #ccc",margin:"3px 0",float:"left",clear:"both"}).appendTo(this.form),this.form.onsubmit=bkLib.cancelEvent},submit:function(){},findElm:function(t,e,n){for(var i=this.ne.selectedInstance.getElm().getElementsByTagName(t),s=0;s<i.length;s++)if(i[s].getAttribute(e)==n)return $BK(i[s])},removePane:function(){this.pane&&(this.pane.remove(),this.pane=null,this.ne.selectedInstance.restoreRng())}}),nicLinkOptions={buttons:{link:{name:"Add Link",type:"nicLinkButton",tags:["A"]},unlink:{name:"Remove Link",command:"unlink",noActive:!0}}},nicLinkButton=nicEditorAdvancedButton.extend({addPane:function(){this.ln=this.ne.selectedInstance.selElm().parentTag("A"),this.addForm({"":{type:"title",txt:"Add/Edit Link"},href:{type:"text",txt:"URL",value:"http://",style:{width:"150px"}},title:{type:"text",txt:"Title"},target:{type:"select",txt:"Open In",options:{"":"Current Window",_blank:"New Window"},style:{width:"100px"}}},this.ln)},submit:function(t){var e=this.inputs.href.value;if("http://"==e||""==e)return alert("You must enter a URL to Create a Link"),!1;if(this.removePane(),!this.ln){var n="javascript:nicTemp();";this.ne.nicCommand("createlink",n),this.ln=this.findElm("A","href",n)}this.ln&&this.ln.setAttributes({href:this.inputs.href.value,title:this.inputs.title.value,target:this.inputs.target.options[this.inputs.target.selectedIndex].value})}});nicEditors.registerPlugin(nicPlugin,nicLinkOptions);var nicColorOptions={buttons:{forecolor:{name:__("Change Text Color"),type:"nicEditorColorButton",noClose:!0},bgcolor:{name:__("Change Background Color"),type:"nicEditorBgColorButton",noClose:!0}}},nicEditorColorButton=nicEditorAdvancedButton.extend({addPane:function(){var t={0:"00",1:"33",2:"66",3:"99",4:"CC",5:"FF"},e=new bkElement("DIV").setStyle({width:"270px"});for(var n in t)for(var i in t)for(var s in t){var o="#"+t[n]+t[s]+t[i],a=new bkElement("DIV").setStyle({cursor:"pointer",height:"15px",float:"left"}).appendTo(e),r=new bkElement("DIV").setStyle({border:"2px solid "+o}).appendTo(a),l=new bkElement("DIV").setStyle({backgroundColor:o,overflow:"hidden",width:"11px",height:"11px"}).addEvent("click",this.colorSelect.closure(this,o)).addEvent("mouseover",this.on.closure(this,r)).addEvent("mouseout",this.off.closure(this,r,o)).appendTo(r);window.opera||(a.onmousedown=l.onmousedown=bkLib.cancelEvent)}this.pane.append(e.noSelect())},colorSelect:function(t){this.ne.nicCommand("foreColor",t),this.removePane()},on:function(t){t.setStyle({border:"2px solid #000"})},off:function(t,e){t.setStyle({border:"2px solid "+e})}}),nicEditorBgColorButton=nicEditorColorButton.extend({colorSelect:function(t){this.ne.nicCommand("hiliteColor",t),this.removePane()}});nicEditors.registerPlugin(nicPlugin,nicColorOptions);var nicImageOptions={buttons:{image:{name:"Add Image",type:"nicImageButton",tags:["IMG"]}}},nicImageButton=nicEditorAdvancedButton.extend({addPane:function(){this.im=this.ne.selectedInstance.selElm().parentTag("IMG"),this.addForm({"":{type:"title",txt:"Add/Edit Image"},src:{type:"text",txt:"URL",value:"http://",style:{width:"150px"}},alt:{type:"text",txt:"Alt Text",style:{width:"100px"}},align:{type:"select",txt:"Align",options:{none:"Default",left:"Left",right:"Right"}}},this.im)},submit:function(t){var e=this.inputs.src.value;if(""==e||"http://"==e)return alert("You must enter a Image URL to insert"),!1;if(this.removePane(),!this.im){var n="javascript:nicImTemp();";this.ne.nicCommand("insertImage",n),this.im=this.findElm("IMG","src",n)}this.im&&this.im.setAttributes({src:this.inputs.src.value,alt:this.inputs.alt.value,align:this.inputs.align.value})}});nicEditors.registerPlugin(nicPlugin,nicImageOptions);var nicSaveOptions={buttons:{save:{name:__("Save this content"),type:"nicEditorSaveButton"}}},nicEditorSaveButton=nicEditorButton.extend({init:function(){this.ne.options.onSave||this.margin.setStyle({display:"none"})},mouseClick:function(){var t=this.ne.options.onSave,e=this.ne.selectedInstance;t(e.getContent(),e.elm.id,e)}});nicEditors.registerPlugin(nicPlugin,nicSaveOptions);var nicXHTML=bkClass.extend({stripAttributes:["_moz_dirty","_moz_resizing","_extended"],noShort:["style","title","script","textarea","a"],cssReplace:{"font-weight:bold;":"strong","font-style:italic;":"em"},sizes:{1:"xx-small",2:"x-small",3:"small",4:"medium",5:"large",6:"x-large"},construct:function(t){this.ne=t,this.ne.options.xhtml&&t.addEvent("get",this.cleanup.closure(this))},cleanup:function(t){var e=t.getElm(),n=this.toXHTML(e);t.content=n},toXHTML:function(t,e,n){var i="",s="",o="",a=t.nodeType,r=t.nodeName.toLowerCase(),l=t.hasChildNodes&&t.hasChildNodes(),c=new Array;switch(a){case 1:var d=t.attributes;switch(r){case"b":r="strong";break;case"i":r="em";break;case"font":r="span"}if(e){for(var h=0;h<d.length;h++){var u=d[h],p=u.nodeName.toLowerCase(),m=u.nodeValue;if(u.specified&&m&&!bkLib.inArray(this.stripAttributes,p)&&"function"!=typeof m){switch(p){case"style":var f=m.replace(/ /g,"");for(itm in this.cssReplace)-1!=f.indexOf(itm)&&(c.push(this.cssReplace[itm]),f=f.replace(itm,""));o+=f,m="";break;case"class":m=m.replace("Apple-style-span","");break;case"size":o+="font-size:"+this.sizes[m]+";",m=""}m&&(s+=" "+p+'="'+m+'"')}}o&&(s+=' style="'+o+'"');for(h=0;h<c.length;h++)i+="<"+c[h]+">";""==s&&"span"==r&&(e=!1),e&&(i+="<"+r,"br"!=r&&(i+=s))}if(l||bkLib.inArray(this.noShort,p)){e&&(i+=">");for(h=0;h<t.childNodes.length;h++){var g=this.toXHTML(t.childNodes[h],!0,!0);g&&(i+=g)}}else e&&(i+=" />");e&&l&&(i+="</"+r+">");for(h=0;h<c.length;h++)i+="</"+c[h]+">";break;case 3:i+=t.nodeValue}return i}});nicEditors.registerPlugin(nicXHTML);var nicCodeOptions={buttons:{xhtml:{name:"Edit HTML",type:"nicCodeButton"}}},nicCodeButton=nicEditorAdvancedButton.extend({width:"350px",addPane:function(){this.addForm({"":{type:"title",txt:"Edit HTML"},code:{type:"content",value:this.ne.selectedInstance.getContent(),style:{width:"340px",height:"200px"}}})},submit:function(t){var e=this.inputs.code.value;this.ne.selectedInstance.setContent(e),this.removePane()}});nicEditors.registerPlugin(nicPlugin,nicCodeOptions);var nicBBCode=bkClass.extend({construct:function(t){if(this.ne=t,this.ne.options.bbCode){t.addEvent("get",this.bbGet.closure(this)),t.addEvent("set",this.bbSet.closure(this));var e=this.ne.loadedPlugins;for(itm in e)e[itm].toXHTML&&(this.xhtml=e[itm])}},bbGet:function(t){var e=this.xhtml.toXHTML(t.getElm());t.content=this.toBBCode(e)},bbSet:function(t){t.content=this.fromBBCode(t.content)},toBBCode:function(t){function e(e,n){t=t.replace(e,n)}return e(/\n/gi,""),e(/<strong>(.*?)<\/strong>/gi,"[b]$1[/b]"),e(/<em>(.*?)<\/em>/gi,"[i]$1[/i]"),e(/<span.*?style="text-decoration:underline;">(.*?)<\/span>/gi,"[u]$1[/u]"),e(/<ul>(.*?)<\/ul>/gi,"[list]$1[/list]"),e(/<li>(.*?)<\/li>/gi,"[*]$1[]"),e(/<ol>(.*?)<\/ol>/gi,"[list=1]$1[/list]"),e(/<img.*?src="(.*?)".*?>/gi,"[img]$1[/img]"),e(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi,"[url=$1]$2[/url]"),e(/<br.*?>/gi,"\n"),e(/<.*?>.*?<\/.*?>/gi,""),t},fromBBCode:function(t){function e(e,n){t=t.replace(e,n)}return e(/\[b\](.*?)\[\/b\]/gi,"<strong>$1</strong>"),e(/\[i\](.*?)\[\/i\]/gi,"<em>$1</em>"),e(/\[u\](.*?)\[\/u\]/gi,'<span style="text-decoration:underline;">$1</span>'),e(/\[list\](.*?)\[\/list\]/gi,"<ul>$1</ul>"),e(/\[list=1\](.*?)\[\/list\]/gi,"<ol>$1</ol>"),e(/\[\*\](.*?)\[\/\*\]/gi,"<li>$1</li>"),e(/\[img\](.*?)\[\/img\]/gi,'<img src="$1" />'),e(/\[url=(.*?)\](.*?)\[\/url\]/gi,'<a href="$1">$2</a>'),e(/\n/gi,"<br />"),t}});nicEditors.registerPlugin(nicBBCode);var nicUploadOptions={buttons:{upload:{name:"Upload Image",type:"nicUploadButton"}}},nicUploadButton=nicEditorAdvancedButton.extend({nicURI:"https://api.imgur.com/3/image",errorText:"Failed to upload image",addPane:function(){if(void 0===window.FormData)return this.onError("Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead.");this.im=this.ne.selectedInstance.selElm().parentTag("IMG");var t=new bkElement("div").setStyle({padding:"10px"}).appendTo(this.pane.pane);new bkElement("div").setStyle({fontSize:"14px",fontWeight:"bold",paddingBottom:"5px"}).setContent("Insert an Image").appendTo(t),this.fileInput=new bkElement("input").setAttributes({type:"file"}).appendTo(t),this.progress=new bkElement("progress").setStyle({width:"100%",display:"none"}).setAttributes("max",100).appendTo(t),this.fileInput.onchange=this.uploadFile.closure(this)},onError:function(t){this.removePane(),alert(t||"Failed to upload image")},uploadFile:function(){var t=this.fileInput.files[0];if(t&&t.type.match(/image.*/)){this.fileInput.setStyle({display:"none"}),this.setProgress(0);var e=new FormData;e.append("image",t);var n=new XMLHttpRequest;n.open("POST",this.ne.options.uploadURI||this.nicURI),n.onload=function(){try{var t=JSON.parse(n.responseText).data}catch(t){return this.onError()}if(t.error)return this.onError(t.error);this.onUploaded(t)}.closure(this),n.onerror=this.onError.closure(this),n.upload.onprogress=function(t){this.setProgress(t.loaded/t.total)}.closure(this),n.setRequestHeader("Authorization","Client-ID c37fc05199a05b7"),n.send(e)}else this.onError("Only image files can be uploaded")},setProgress:function(t){this.progress.setStyle({display:"block"}),t<.98?this.progress.value=t:this.progress.removeAttribute("value")},onUploaded:function(t){this.removePane();var e=t.link;if(!this.im){this.ne.selectedInstance.restoreRng();this.ne.nicCommand("insertImage",e),this.im=this.findElm("IMG","src",e)}var n=parseInt(this.ne.selectedInstance.elm.getStyle("width"));this.im&&this.im.setAttributes({src:e,width:n&&t.width?Math.min(n,t.width):""})}});nicEditors.registerPlugin(nicPlugin,nicUploadOptions);