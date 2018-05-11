function add(e){
    if(e.length!=0){
        tlist.push({"vis":false,"text":e,"id":-1});
        reload();
    }else{
        alert("输入不能为空")
    }

}
function reset(){
    document.getElementById("tip").value = "";
}
var tlist = new Array();
mysql = 1;
function listremove(i){
    var ret = new Array();
    for(kk in tlist){
        if(kk==i) continue;
        ret.push(tlist[kk]);
    }
    tlist = ret;
}
function removeall(){
    tlist = new Array();
    reload();
}
function getli(i){
    var li = document.createElement("li");
    var ckb = document.createElement("input");
    ckb.r = i;
    ckb.setAttribute("type","checkbox");
    ckb.checked = tlist[i].vis;
    ckb.onclick = function (){
        console.log(this.r);
        tlist[i].vis = this.checked;
        var tmp = tlist[i];
        listremove(i);
        tlist.push(tmp);
        reload();
    }
    
    var text = document.createElement("span");
    text.innerHTML = tlist[i].text;
    text.setAttribute("contenteditable","true");
    text.setAttribute("class","tex");
    text.row = i;
    var tsave = function (){
        console.log(this.innerHTML);
        if(this.innerHTML)
            tlist[this.row].text = this.innerHTML;
        else
            alert("内容不能为空")
        reload();
    }
    text.onkeypress = function (e){
        if(e.charCode==13){
            return false;
            //text.onblur();
        }
    }
    text.onblur = tsave
    
    var deletebtn = document.createElement("button");
    deletebtn.innerHTML ="删除";
    deletebtn.setAttribute("class","del");
    deletebtn.row = i;
    deletebtn.onclick = function (){
        listremove(i);
        reload();
    }
    li.appendChild(ckb);
    li.appendChild(text);
    li.appendChild(deletebtn);
    li.setAttribute("class","row");
    li.setAttribute("draggable","true");
    li.row = i;
    return li;
}
function save(){
    jtlist = JSON.stringify(tlist);
    localStorage.bb = jtlist;
    if(mysql==1)
    $.post("http://127.0.0.1:57759",jtlist,function(result){
  });
}
function get(){
    console.log(1);
    tlist = JSON.parse(localStorage.bb);
    if(mysql == 1)
    $.get(
        "http://127.0.0.1:57759",function (data,err){
        console.log(data);
        tlist = JSON.parse(data);
        reload();
        }
    );
}
function reload(){
    save();
    var unow = document.getElementById("unow");
    var uready = document.getElementById("uready");
    while(unow.hasChildNodes()) //当div下还存在子节点时 循环继续  
    {  
        unow.removeChild(unow.firstChild);  
    } 
    while(uready.hasChildNodes()) //当div下还存在子节点时 循环继续  
    {  
        uready.removeChild(uready.firstChild);  
    }
    var ncnt = 0;
    var rcnt = 0;
    for(i in tlist){
        if(tlist[i].vis){
            rcnt++;
            var ttt  = getli(i);
            ttt.setAttribute("draggable","false");
            uready.appendChild(ttt);
        }else{
            ncnt++;
            unow.appendChild(getli(i));
        }
    }
    document.getElementById("ncnt").innerHTML = ncnt;
    document.getElementById("rcnt").innerHTML = rcnt;
}

document.addEventListener("dragstart", function( event ) {

      dragged = event.target;
      // 使其半透明
      //event.preventDefault();
      event.target.style.opacity = .5;
      event.target.setAttribute("contenteditable","true");
  }, false);
document.addEventListener("dragend", function( event ) {
      // 重置透明度
      event.target.style.opacity = "";
  }, false);
  document.addEventListener("dragover", function( event ) {
      // 阻止默认动作以启用drop
      event.preventDefault();
  }, false);
  document.addEventListener("drop", function( event ) {
      // 阻止默认动作（如打开一些元素的链接）
      event.preventDefault();
      // 将拖动的元素到所选择的放置目标节点中
      var ind = event.target.row;
      console.log(ind)
      if ( (event.target.className == "row"||
          event.target.className == "tex")&& tlist[ind].vis == false ) {
          console.log(dragged.row);
          console.log(event.target.row);
          var tmp = tlist[event.target.row];
          tlist[event.target.row] = tlist[dragged.row];
          tlist[dragged.row] = tmp;
          setTimeout(reload(),1000);
      }
    
  }, false);
//window.localStorage.clear();
get();
reload();