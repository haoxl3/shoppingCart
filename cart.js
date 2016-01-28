/**
 * Created by hxl on 2016/1/22.
 */
window.onload=function(){
    //兼容IE没有getElementsByClassName方法，把类名按空格分成多个数组，再分别遍历
    if(!document.getElementsByClassName){
        document.getElementsByClassNamefunction=function(name){
            var doms=document.getElementsByTagName("*");
            var arr=[];
            for(var i=0;i<doms.length;i++){
                var txt=doms[i].className.split(" ");
                for(j=0;j<txt.length;j++){
                    if(txt[j]==name){
                        arr.push(doms[i]);
                    }
                }
            }
            return arr;
        }
    }
    var cartTable=document.getElementById('cartTable');
    var tr=cartTable.children[1].rows;//获得表格中的行，.rows是表格特有的属性
    var checkInputs=document.getElementsByClassName('check');
    var checkAllInputs=document.getElementsByClassName('check-all');
    var selectedTotal=document.getElementById('selectedTotal');
    var priceTotal=document.getElementById('priceTotal');
    var selected=document.getElementById('selected');
    var foot=document.getElementById('foot');
    var selectedViewList=document.getElementById('selectedViewList');
    var deleteAll=document.getElementById('deleteAll');

    //更新总数和总价格，已选浮层
    function getTotal(){
        var selected=0;//累计“数量”
        var price=0;//累计小计
        var HTMLstr='';
        for(var i= 0,len=tr.length;i<len;i++){
            //如果最前面的多选框被选中的话
            if(tr[i].getElementsByTagName('input')[0].checked){
                tr[i].className='on';//选中的行颜色变深
                selected +=parseInt(tr[i].getElementsByTagName('input')[1].value);//数量
                price +=parseFloat(tr[i].cells[4].innerHTML);//获得当前行的“小计”的值
                //如果商品被选中则会在最下面的弹出层显示
                HTMLstr+='<div><img src="'+tr[i].getElementsByTagName('img')[0].src+'"><span class="del" index="'+i+'">取消选择</span></div>';// 添加图片到弹出层已选商品列表容器
            }else{
                tr[i].className='';
            }
        }
        selectedTotal.innerHTML=selected;
        priceTotal.innerHTML=price.toFixed(2);
        selectedViewList.innerHTML=HTMLstr;
        if(selected==0){
            foot.className='foot';//如果没选择商品，则下面那个栏不显示
        }
    }
    /*判断多选框是否选中部分*/
    for(var i= 0,len=checkInputs.length;i<len;i++){
        checkInputs[i].onclick=function(){
            //如果点击‘全选’则其它多选框都与‘全选’框的checked一样（选中或不选中）
            if(this.className=='check-all check'){
                for(var j=0;j<checkInputs.length;j++){
                    checkInputs[j].checked=this.checked;
                }
            }
            //如果其中某个多选框未被选中，则两个‘全选’框都要撤销选中状态
            if(this.checked==false){
                for(var k=0;k<checkAllInputs.length;k++){
                    checkAllInputs[k].checked=false;
                }
            }
            //当一个一个点击全部单选框后，‘全选’按钮被选中
            var flag=true;
            for(var k=1;k<checkInputs.length-1;k++){
                if(!checkInputs[k].checked){
                    flag=false;
                }
            }
            if(flag){
                for (var i = 0; i < checkAllInputs.length; i++) {
                    checkAllInputs[i].checked=true;
                };
            }
            getTotal();
        }
    };
    //切换显示已选商品弹层
    selected.onclick=function(){
        if(selectedTotal.innerHTML!=0){
            foot.className=(foot.className=='foot'?'foot show':'foot');
        }
    };
    //已选商品弹层中的取消选择按钮
    selectedViewList.onclick=function(e){
        var e=e || window.event;
        var el= e.srcElement;//srcElement会获得当前点击的对象，如是图片还是span标签
        if(el.className=='del'){
            var input=tr[el.getAttribute('index')].getElementsByTagName('input')[0];//获得当前被点击的行的第一列的input标签，再让其设为false，即不被选择上
            input.checked=false;
            input.onclick();//调用它便可实现在弹出层是否显示该商品
        }
    }
    //计算单行价格；小计
    function getSubTotal(tr){
        var tds=tr.cells;
        var price=parseFloat(tds[2].innerHTML);//单价
        var count=parseInt(tr.getElementsByTagName('input')[1].value);//数量
        var SubTotal=parseFloat(price*count);
        tds[4].innerHTML=SubTotal.toFixed(2);
        //小计处赋值
        /*subtotal.innerHTML=(parseInt(countInput.value)*parseFloat(price.innerHTML)).toFixed(2);
        //如果数目只有一个，把－号去掉
        if(countInput.value==1){
            span.innerHTML='';
        }else{
            span.innerHTML='-';
        }*/
    }
    //加减号那部分
    for(var i=0;i<tr.length;i++){
        tr[i].onclick=function(e){
            e=e || window.event;
            var el= e.srcElement;//事件代理机制，给父元素tr加点击事件，用e.srcElement可得到具体哪个被点击
            var cls=el.className;
            var input=this.getElementsByTagName('input')[1];
            var val=parseInt(input.value);
            var reduce=this.getElementsByTagName('span')[1];
            switch (cls){
                case 'add':
                    input.value=val+1;
                    reduce.innerHTML='-';//加后要显示出减号
                    getSubTotal(this);
                    break;
                case 'reduce':
                    if(val>1){
                        input.value=val-1;
                    }
                    if(input.value<=1){
                        reduce.innerHTML='';//小于1则把减号隐藏
                    }
                    getSubTotal(this);
                    break;
                case 'delete':
                    var conf=confirm('确定要删除吗？');
                    if(conf){
                        this.parentNode.removeChild(this);//tr的父结点为tabale，然后再把自己传给remove
                    }
                default :
                    break;
            }
            getTotal();
        }
        //加减处的键盘事件进行加减
        tr[i].getElementsByTagName('input')[1].onkeyup=function(){
            var val=parseInt(this.value);
            var tr=this.parentNode.parentNode;//td,tr
            var reduce=tr.getElementsByTagName('span')[1];
            if(isNaN(val) || val<1){
                val=1;//如果文本框中不是个数或输入的数小于1则让它为1
            }
            this.value=val;
            if(val<=1){
                reduce.innerHTML='';//如果值小于1则减号隐藏
            }else{
                reduce.innerHTML='-';
            }
            getSubTotal(tr);
            getTotal();//求总计
        }
    };
    //删除全部
    deleteAll.onclick=function(){
        if(selectedTotal.innerHTML !='0'){//如果有选中的多选框才能有弹出框
            var conf=confirm('确定删除全部吗？');
            if(conf){
                for(var i=0;i<tr.length;i++){
                    var input=tr[i].getElementsByTagName('input')[0];
                    if(input.checked){
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;//删除后数组中自动向前移，i也会++，便会漏掉，所以让i不增加
                    }
                }
                getTotal();
            }
        }
    }
    //刚进来页面要让所有商品被选中
    checkAllInputs[0].checked=true;//即让‘全部’按钮被选中
    checkAllInputs[0].onclick();
}