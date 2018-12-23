$(function(){
    //自定义滚动条
    $(".content_left_bottomlist").mCustomScrollbar();
  
    var $audio=$("audio");
    var audio=document.getElementById('music_do');
    var player=new Player(audio,$audio);
    var lyric;
    var progress;
    var voiceProgress;
    var lyricTlen=new Array();
  
    getPlayList();
    initProgress();
    initEvent();

    //1.加载歌曲列表
    function getPlayList(){
        $.ajax({
            url:"./source/musiclist.json",
            dataType:"json",
            success:function(data){
                    player.musicList=data;
                    var $musitList=$(".content_left_bottomlist ul");
                //    3.遍历获取到的数据，创建灭一条音乐
                      var index=0;
                    $.each(data,function(index,ele){
                            
                            var $item=createMusicItem(index,ele);
                            $musitList.append($item);
                            
                    }) 
                    // 初始化歌曲信息
                    initMusicinfo(data[0]);
                    //初始化歌词信息
                    initMusicLyric(data[0]);
            },
            error:function(){}
        
        });
    }
    //1.初始化歌词信息
    function initMusicLyric(music){
        lyric=new Lyric(music.link_lrc);
        var $lryicContainer=$(".song_lyric");
        //清空上一首歌词
        var temp=0;
        $lryicContainer.html("");
        lyric.loadLyric(function(){
            //创建歌词列表
          
        //    $.each(lyric.lyrics,function(index,ele){
        //         var $item=$("<li class=\"song_lyric_li\"></li>");
        //         $item.text(ele);
        //         $lryicContainer.append($item);
        //         var x=$item.height()+temp;
        //         // console.log("x"+x)
        //         lyricTlen.push(x);
        //         temp=$item.height()+temp;
        //         // console.log(lyricTlen[index]),
             
        //    })
        // console.log(lyric.lyrics.length)
           for(var n=0,m=0;n<lyric.lyrics.length;n++){
               if(lyric.lyrics[n]==null){
                   continue;
               }
            var $item=$("<li class=\"song_lyric_li\"></li>");
            $item.text(lyric.lyrics[n]);
            $lryicContainer.append($item);
            var x=$item.height()+temp;
            // console.log("11111111111111111111temp"+temp+"xxx"+n)
            // console.log("111111111111111111x"+x)
            lyricTlen[m]=x;
            m++;
            temp=x;
           }
        });
    }
    //2.初始化歌曲信息
    function  initMusicinfo(music){
        var $musicImage=$(".song_info_pic img");
        var $musicName=$(".song_info_name a");
        var $musicSinger=$(".song_info_singer a");
        var $musicAblum=$(".song_info_ablum a");
        var $musicProgressName=$(".music_progress_name");
        var $musicProgressTime=$(".music_progress_time");
        var $musciBg=$(".mask_bg")

        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name+" / "+music.singer);
        $musicProgressTime.text("00:00/"+music.time);
        $musciBg.css("background","url("+music.cover+")")
    };
    // 3.初始化进度条
    function initProgress(){
          //歌曲进度拖拽
    var $progressBar=$(".music_progress_bar");
    var $progressLine=$(".music_progress_line");
    var $progressDot=$(".music_progress_dot");
    progress=Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function(value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value);
        progress.isOn=true;
    });
    //声音拖拽
    var $voiceBar=$(".music_voice_bar");
    var $voiceLine=$(".music_voice_line");
    var $voiceDot=$(".music_voice_dot");
    voiceProgress=Progress($voiceBar,$voiceLine,$voiceDot);
    voiceProgress.progressClick(function(value){
        player.musicVoiceSeeTo(value)
    });
    voiceProgress.progressMove(function(value){
       player.musicVoiceSeeTo(value);
        voiceProgress.isOn=true;
    });
    }
    4.
    function initEvent(){
        
     
        //搞一手代理先，毕竟动态创建的标签=。= 会导致无法监听的问题
        $(".content_left_bottomlist").delegate(".list_music","mouseenter",function(){
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
             //隐藏示长
             $(this).find(".list_time span").stop().fadeOut(100);
        })
        $(".content_left_bottomlist").delegate(".list_music","mouseleave",function(){
              //隐藏子菜单
              $(this).find(".list_menu").stop().fadeOut(100);
              $(this).find(".list_time a").stop().fadeOut(100);
               //显示示长
               $(this).find(".list_time span").stop().fadeIn(100);
        })
    
        //2.监听复选框的点击
        $(".content_left_bottomlist").delegate(".list_check","click",function(){
            $(this).toggleClass("list_checked")
        })
    
    
        var $musicPlay=$(".music_play img")
        //3.监听子菜单播放按钮的监听
        $(".content_left_bottomlist").delegate(".list_menu_go","click",function(){
            var $img=$(this).find("img");
            var $item=$(this).parents(".list_music");
            if($img.attr("src").indexOf("bo")>-1){
                //播放
               //切换图标
                $img.attr("src","img/bf3.png");
                //让文字高亮
                $(this).parents(".list_music").find("div").css("color","#fff");
                //让其他文字不高梁
                $(this).parents(".list_music").siblings().find("div").css("color","rgba(255, 255, 255,0.5)")
                //复原其他图标
                $img.parents(".list_music").siblings().find(".list_menu_go img").attr("src","img/bofang.png")
    
                $musicPlay.attr("src","img/zt.png");
            }
            else{
              //暂停
                $img.attr("src","img/bofang.png");
                // $img.parents(".list_music").siblings().find(".list_menu_go img").attr("src","img/bf3.png")
                 //让文字不高亮
                 $(this).parents(".list_music").find("div").css("color","rgba(255, 255, 255,0.5)")
                $musicPlay.attr("src","img/bf.png");
            }
            //3.4切换序号状态
            $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
            $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");
            //切花歌曲
            player.playMusic($item.get(0).index,$item.get(0).music);

            //切换歌曲信息
            initMusicinfo($item.get(0).music)

            //切换歌词
            initMusicLyric($item.get(0).music)
        });
        //4.监听底部控制区域播放按钮的点击
        $(".music_play").click(function(){
            if(player.currentindex==-1){
                //无播放音乐
                $(".list_music").eq(0).find(".list_menu_go").trigger("click");
            }else{
                //播放过音乐
                $(".list_music").eq(player.currentindex).find(".list_menu_go").trigger("click");
            }
        })
        //5.监听底部控制区上一首按钮的点击
        $(".music_prc").click(function(){
            $(".list_music").eq(player.preIndex()).find(".list_menu_go").trigger("click");
        })
        //6.监听底部控制区下一首按钮的点击
        $(".music_next").click(function(){
            $(".list_music").eq(player.nextIndex()).find(".list_menu_go").trigger("click");
        })
        //7. 监听删除按钮的点击
        $(".content_left_bottomlist").delegate(".list_menu_delete","click",function(){
            //找到被点击的音乐
            var $item=$(this).parents(".list_music");
            //判断时候删除的是正在播放的
            if($item.get(0).index==player.currentindex){
                $(".music_next").trigger("click");
            }
            
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            // each(一个参数)  代表index   each(两个参数) index 和 dom元素本身
            $(".list_music").each(function(index,ele){
                ele.index=index;
                $(ele).find(".list_number").text(index+1);

            })
        })

        //8.监听播放的进度
        player.musicTimeUpdate(function(currentTime,duration,timeStr){
            //同步时间
            if(currentTime==duration){
                $(".music_next").trigger("click");
            }
            $(".music_progress_time").text(timeStr);
            //同步进度条
            //计算播放比例
            var value=currentTime / duration*100;
            progress.setProgress(value);
            //歌词同步！！！！！！！！
            var index1=lyric.currentIndex(currentTime);
            var $item=$(".song_lyric li").eq(index1);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");
            var margintt=0;
            if(index1>=3){
               margintt= lyricTlen[index1-3];
            // console.log(lyricTlen[index1-2])
            }
            // console.log("22222222222222---"+lyricTlen[index1-3])
            // console.log("2222222222x"+index1)
            // console.log(margintt+"mar"+"index"+index1)
            $(".song_lyric").css({
               
                marginTop:-margintt
                
            })



            // $.each(lyricTlen,function(index,ele){
            //     if(index>=index1) return false;  //防止到达 歌曲同步就停了
            //     margintt=ele+margintt;
            // })
            // if(scrollTop-conTop<20){
            //     margintt=-20+margintt;
            // }
           
            // $(".song_lyric").css({
               
            //     marginTop:-margintt
                
            // })
            
        })
        //9监听声音进度
        $(".music_voice_icon").click(function(){
            if($(this).find("img").attr("src").indexOf("sy")>-1){
                //图标切换
                $(this).find("img").attr("src","img/jy.png")
                //声音没了
                player.musicVoiceSeeTo(0);
            }else{
                //图标切换
                $(this).find("img").attr("src","img/sy.png")
                player.musicVoiceSeeTo(0.8);
                  //声音由了
            }
        })
        
   
    }
            ///定义一个方法创建一条影月
    function createMusicItem(index,music){
        var $item=$(
        "<li class=\"list_music\">"+
        "<div class=\"list_check\"><i></i></div>"+
        "<div class=\"list_number\">"+(index+1)+"</div>"+
        "<div class=\"list_name\">"+music.name+""+
            "<div class=\"list_menu\">"+
                "<a href=\"javacript::\" title=\"播放\" class=\"list_menu_go\" ><img src=\"img/bofang.png\"  x=1 ></a>"+
                "<a href=\"javacript::\" title=\"添加\"><img src=\"img/tianjia.png\" ></a>"+
                "<a href=\"javacript::\" title=\"下载\"><img src=\"img/xiazai.png\" ></a>"+
                "<a href=\"javacript::\" title=\"分享\"><img src=\"img/fenxiang.png\" ></a>"+
           " </div>"+
       "</div>"+
       "<div class=\"list_singer\">"+music.singer+"</div>"+
        "<div class=\"list_time\"><span>"+music.time+"</span><a href=\"javascript::\" title=\"删除\" class=\"list_menu_delete\"><img src=\"img/delete.png\"></a></div>"+
"</li>")
    $item.get(0).index=index;
    $item.get(0).music=music;

    return $item;
    }

   
})