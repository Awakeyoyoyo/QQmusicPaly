(function(Window){
    function Player(audio,$audio){
        return new Player.prototype.init(audio,$audio);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        currentindex:-1,
        init:function(audio,$audio){
            this.audio=audio;
            this.$audio=$audio;
        },
        playMusic:function(index,music){
                // 判断是否是同一首音乐
                if(this.currentindex==index)
                {
                    //同一首
                    if(this.audio.paused)
                    {
                        this.audio.play();
                    }
                    else{
                        this.audio.pause();
                    }
                }else{
                    // 不是同一手
                    this.audio.pause();
                    this.$audio.attr("src",music.link_url);
                    this.audio.play();
                }
                this.currentindex=index;
        },
        preIndex:function(){
            var index=this.currentindex-1;
            if(index<0){
                index=this.musicList.length-1;
            }
            return index;
        },
        nextIndex:function(){
            var index=this.currentindex+1;
            if(index>this.musicList.length-1){
                index=0;
            }
            return index;
        },
        changeMusic:function(index){
            //删除对应数据
            this.musicList.splice(index,1);
            if(index<this.currentindex){
                this.currentindex--;
            }
        },
      
        musicTimeUpdate:function(callBack){
           var $this=this;
            this.$audio.on("timeupdate",function(){
                var duration=$this.audio.duration;
                var currentTime=$this.audio.currentTime;
                var timeStr=$this.formatDate(currentTime,duration);
                callBack(currentTime,duration,timeStr)
            })
        },
        formatDate:function(ctime,dtime){
            var endMin=parseInt(dtime/60);
            var endSec=parseInt(dtime%60);
            if(endMin<10){
                endMin="0"+endMin;
            }
            if(endSec<10){
                endSec="0"+endSec;
            }
    
            var doMin=parseInt(ctime/60);
            var doSec=parseInt(ctime%60);
            if(doMin<10){
                doMin="0"+doMin;
            }
            if(doSec<10){
                doSec="0"+doSec;
            }
            return doMin+":"+doSec+"/"+endMin+":"+endSec;
        },
        musicSeekTo:function(value){
            if(isNaN(value)) return;
            if(value<0||value>1) return;
            this.audio.currentTime=this.audio.duration*value;
        },
        musicVoiceSeeTo:function(value){
            //0~1
            this.audio.volume=value;
        }
    }
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(Window);