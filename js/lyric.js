(function(Window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype={
        constructor:Lyric,
    
        init:function(path){
           this.path=path;
        },
  
        times:[],
        lyrics:[],
        index:-1,
        lindex:-1,
        loadLyric:function(callBack){
            //加载歌词
            var $this=this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function(data){
                   
                    $this.parseLyric(data)
                    callBack()
                },
                error:function(){}
            });
        },
        parseLyric:function(data){
            //解析歌词
            var $this=this;
            var array=data.split("\n")
            
            $this.times=[];
            $this.lyrics=new Array();
            $this.index=-1;
            $this.lindex=-1;
            // console.log(array)
            //正则表达式匹配时间
            //[00:00.92]
            var tiemReg=/\[(\d*:\d*\.\d*)\]/
            //遍历取出每一条歌词
            $.each(array,function(index,ele){

                 
                var lrc=ele.split("]")[1];
                if(lrc.length==0) return true; //排除没有歌词的
                // console.log(lrc+"aaa"+index)
                $this.lyrics[index]=lrc;
                // console.log(lrc +"index"+index)
                var res=tiemReg.exec(ele);
                if(res==null) return true;
                var tiemStr=res[1]; 
                var res2=tiemStr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));
                $this.times.push(time);
               
            });
            // console.log($this.times);
            // console.log($this.lyrics);
        },
        currentIndex:function(currentTime){
            // console.log(currentTime);
            // if(currentTime>=this.times[0]){
            //     this.index++;
            //     this.times.shift();
            // }
            var $this=this;
            var dowmtiems=$this.down($this.times);
            $.each(dowmtiems,function(index,ele){
             
                if(currentTime>=ele){
                   
                    $this.index=$this.times.length-index;
                    return false;
                }
            })
            return $this.index; 
        },
        down:function(pp){
            var temp=[];
            for(var m=pp.length;m>=0;m--){
                temp.push(pp[m]);
            }
            return temp;
        }
    }
    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;
})(Window);