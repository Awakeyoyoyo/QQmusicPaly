(function(Window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype={
        constructor: Progress,
        init:function($progressBar,$progressLine,$progressDot){
           this.$progressBar=$progressBar;
           this.$progressLine=$progressLine;
           this.$progressDot=$progressDot;
        },
        isMove:false,
        isOn:true,
        progressClick:function(callBack){
                //监听背景的点击
          
                var $this=this;
                this.$progressBar.click(function(event){
                    //获取背景距离窗口距离
              
                var normalLeft=$(this).offset().left;
                    // console.log(normalLeft)
                     //获取点击距离窗口的距离
                var eventLeft=event.pageX;
                // console.log(eventLeft)
                // 设置前景的长度
                $this.$progressLine.css("width",eventLeft-normalLeft);
                 // 设置按钮的长度
                $this.$progressDot.css("left",eventLeft-normalLeft);
                //计算进度条比例
                var value=(eventLeft-normalLeft)/$(this).width();
                callBack(value);
              
            });
                
        },
        progressMove:function(callBack){
                
                var $this=this;
                var length=this.$progressBar.width();
                var normalLeft=this.$progressBar.offset().left;
                var eventLeft;
                //监听鼠标的按下事件
                this.$progressBar.mousedown(function(){
                    $this.isMove=true;
                    $this.isOn=false;
                    ////监听鼠标移动事件
                    $(document).mousemove(function(event){
                         //获取点击距离窗口的距离
                        //  console.log(3)
                    eventLeft=event.pageX;
                    if(eventLeft-normalLeft>length)
                    {
                        eventLeft=normalLeft+length;
                    }
                    if(eventLeft<normalLeft){
                        eventLeft=normalLeft;
                    }
                    // console.log(eventLeft)
                    // 设置前景的长度
                    $this.$progressLine.css("width",eventLeft-normalLeft);
                     // 设置按钮的长度
                    $this.$progressDot.css("left",eventLeft-normalLeft);  
                    
                    });
                  
                });
                  //监听鼠标抬起事件
                $(document).mouseup(function(){
                    $(document).off("mousemove");
                    $this.isMove=false;
                   // console.log(2)
                   // 计算进度条比例
                   if($this.isOn) return;
                   var value=(eventLeft-normalLeft)/$this.$progressBar.width();
                   callBack(value);
                   });
        },
        setProgress:function(value){

                if(this.isMove) {
                   
                    return;}

                if(value<0||value>100) {return;}
                this.$progressLine.css({
                    width:value+"%"
                }) ;
                this.$progressDot.css({
                    left:value+"%"
                })
                    
                
        }
    }
    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;
})(Window);