---
title: "实验项目二 编写多人网页版聊天程序"
date: "2021-04-05"
description: "很快到了第二个项目的DDL了。这个项目之所以一直拖是因为在Tornado文档中就有官方示例，不过一开始难以静下心读代码，所以先把网页的html解决了。 Part1 网页界面 参考了hack.chat，在放弃了许多想法后最后的成品长这样： 图1 登录界面 图2 输入框界面 聊天界面的输入框用的是tex"
summary: "从页面界面到 Tornado WebSocket 的多人聊天实验。"
permalink: "/posts/experiment-chat.html"
source_url: "https://www.cnblogs.com/h40y/p/14617292.html"
---

{% raw %}
<p>　　很快到了第二个项目<span style="text-decoration: line-through">的DDL</span>了。这个项目之所以一直拖是因为在Tornado文档中就有<a href="https://github.com/tornadoweb/tornado/tree/stable/demos/chat" target="_blank" rel="noopener nofollow">官方示例</a>，不过一开始难以静下心读代码，所以先把网页的html解决了。</p>

<p>　　<span style="font-size: 18pt"><strong>Part1 网页界面</strong></span></p>
<p>　　参考了<a href="https://hack.chat/" target="_blank" rel="noopener nofollow">hack.chat</a>，在放弃了许多想法后最后的成品长这样：</p>
<p><img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-chat/chat-page.png"></p>
<p style="text-align: center"><span style="font-size: 12px; color: rgba(136, 136, 136, 1)">图1 登录界面</span></p>
<p>&nbsp;<img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-chat/chat-login.png"></p>
<p style="text-align: center"><span style="font-size: 12px; color: rgba(136, 136, 136, 1)">图2 输入框界面</span></p>
<p style="text-align: left">　　聊天界面的输入框用的是textarea，做了随着文字量改变大小的效果，参考了<a href="http://caibaojian.com/textarea-autoheight.html" target="_blank" rel="noopener nofollow">ExpandingArea</a>。做这个项目的时候蹦出了“Cannot read property 'addEventListener' of null”的提示，之前也遇到过，把scipt部分代码放在网页代码下方就解决了，实际上就是网页与js的加载顺序问题一样，jQuery的加载也如此。</p>
<p style="text-align: left">　　放弃了（以后回顾的时候可以加上？）：</p>
<p style="text-align: left">　　　　1、输入框在上，形成类似微博事件流的聊天界面。</p>
<p style="text-align: left">　　　　2、气泡实现本地发言靠右，网络发言靠左的形式（最后放弃全边框，只保留了一边），以及更复杂的气泡（用户名+气泡的形式）。</p>
<p style="text-align: left">　　　　3、和Hack.chat一样的主题栏，可以切换css形式，虽然想到了实现方法（onmouseon+display+z-index等），临近ddl加上与需求无关，就没做了。</p>
<p style="text-align: left">　　　　4、回车键直接提交文本，这么做也美观，但耗时长感知性不强也没做了。</p>

<p>　　<span style="font-size: 18pt"><strong>Part2 Tornado 与 WebSocket</strong></span></p>
<p>　　根据<a href="http://www.voidcn.com/article/p-whoqshua-ym.html" target="_blank" rel="noopener nofollow">前人总结</a>先把框架写出来：</p>
<div class="cnblogs_code">
<div id="cnblogs_code_open_e48197e3-0fa2-49c7-b6ba-211165256a21" class="cnblogs_code_hide">
<pre><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> coding = utf-8</span>

<span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> tornado.web
</span><span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> tornado.ioloop
</span><span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> os.path
 
</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> WebSocket 实现轮询到双工的转变</span>
<span style="color: rgba(0, 0, 255, 1)">class</span> ChatHandler(tornado.websocket.WebSocketHandler):  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 继承Handler以处理来自WebSocket协议的请求</span>
<span style="color: rgba(0, 0, 0, 1)">   
    pool </span>= set()  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 用户池</span>
   
    <span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> open(self):
    self.pool.add(self)  
    </span><span style="color: rgba(0, 0, 255, 1)">for</span> _ <span style="color: rgba(0, 0, 255, 1)">in</span><span style="color: rgba(0, 0, 0, 1)"> self.pool:
        </span><span style="color: rgba(0, 0, 255, 1)">pass</span>  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 入场信息</span>
   
    <span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> on_close(self):
        self.pool.remove(self)
        </span><span style="color: rgba(0, 0, 255, 1)">for</span> _ <span style="color: rgba(0, 0, 255, 1)">in</span><span style="color: rgba(0, 0, 0, 1)"> self.pool:
            </span><span style="color: rgba(0, 0, 255, 1)">pass</span>  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 离场信息</span>

    <span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> on_message(self, message):
        </span><span style="color: rgba(0, 0, 255, 1)">pass</span> <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)">全场发送消息</span>
 
    <span style="color: rgba(0, 0, 255, 1)">class</span><span style="color: rgba(0, 0, 0, 1)"> IndexHandler(tornado.web.RequestHandler):
        </span><span style="color: rgba(0, 0, 255, 1)">def</span> get(self, *args, **<span style="color: rgba(0, 0, 0, 1)">kwags):
            self.render(</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">chat_room.html</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">)
 
</span><span style="color: rgba(0, 0, 255, 1)">if</span> <span style="color: rgba(128, 0, 128, 1)">__name__</span> == <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">__main__</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">:
    app </span>=<span style="color: rgba(0, 0, 0, 1)"> tornado.web.Application(
        [
        ],
 
    </span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 设置静态路径，不设置的话会出现无法加载css/js的问题</span>
        template_path = os.path.join(os.path.dirname(<span style="color: rgba(128, 0, 128, 1)">__file__</span>), <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">templates</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">),
        static_path </span>= os.path.join(os.path.dirname(<span style="color: rgba(128, 0, 128, 1)">__file__</span>), <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">static</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">),
 
        debug </span>=<span style="color: rgba(0, 0, 0, 1)"> True
    )
 
    app.listen(</span>8888<span style="color: rgba(0, 0, 0, 1)">)
    tornado.ioloop.IOLoop.instance().start()
       </span></pre>
</div>
<span class="cnblogs_code_collapse"> 根据之前的知识和WS相关写的框架</span></div>
<p>　　最开始是模仿hack.chat那样<a href="https://www.runoob.com/js/js-popup.html" target="_blank" rel="noopener nofollow">弹窗输入</a>用户名的，但是貌似Tornado没办法直接从网页中读取DOM参数，最后还是只能做了一个登录界面提交表单。</p>
<p>　　后记：怎么不可以，jQuery可以，cookie也可以……</p>

<p>　　整个功能的前后端逻辑是：用户访问host:8888/ → Tornado匹配并转到index.html → 用户输入用户名，点击按钮访问/home → Tornado接受表单信息并转到chat_room.html → 用户开始聊天。而WebSocket是在chat_room.html创建一个WebSocket对象，并连接到ws://host:8888/ws，Tornado匹配/ws并用继承了WebSocketHandler的类处理来自WebSocket协议的请求。如此一来，根据上述内容补充代码即可。</p>
<div class="cnblogs_code">
<div id="cnblogs_code_open_8716565f-034f-47c3-be8d-6bb9ad6a0150" class="cnblogs_code_hide">
<pre><span style="color: rgba(0, 0, 255, 1)">var</span> ws = <span style="color: rgba(0, 0, 255, 1)">new</span> WebSocket("ws://127.0.0.1:8888/chat");  <span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 指向对应Handler</span>
<span style="color: rgba(0, 0, 0, 1)">
ws.onmessage </span>= <span style="color: rgba(0, 0, 255, 1)">function</span><span style="color: rgba(0, 0, 0, 1)">(e){
    </span><span style="color: rgba(0, 0, 255, 1)">var</span> data =<span style="color: rgba(0, 0, 0, 1)"> JSON.parse(e.data)
    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">$("#container").append("&lt;div id=\"msg\"&gt;" + data.uid + " says: " + data.msg + "&lt;/div&gt;")  最初版本</span>
    <span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">$("#container").append("&lt;div id=\"own_msg\"&gt; debug: 1." + data.uid + "2." + $("#username").text() + "&lt;/div&gt;")</span>
    <span style="color: rgba(0, 0, 255, 1)">if</span> (data.uid == $("#username").text()){  <span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 区分本机和网络信息</span>
        $("#container").append("&lt;div id=\"own_msg\"&gt; " + data.msg + "&lt;/div&gt;"<span style="color: rgba(0, 0, 0, 1)">)
    }</span><span style="color: rgba(0, 0, 255, 1)">else</span><span style="color: rgba(0, 0, 0, 1)">{
        $(</span>"#container").append("&lt;div id=\"msg\"&gt;" + data.uid + " : " + data.msg + "&lt;/div&gt;"<span style="color: rgba(0, 0, 0, 1)">)
    }
}

</span><span style="color: rgba(0, 0, 255, 1)">function</span><span style="color: rgba(0, 0, 0, 1)"> sendMsg(){
    </span><span style="color: rgba(0, 0, 255, 1)">var</span> msg = $("#textarea"<span style="color: rgba(0, 0, 0, 1)">).val();
    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> $("#container").append("&lt;div id=\"msg\"&gt;" + $("#username").text() + " says: " + msg + "&lt;/div&gt;")</span>
    ws.send(msg);  <span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 向WebSocket发送消息，对应Handler类的on_message</span>
    $("#textarea").val(""<span style="color: rgba(0, 0, 0, 1)">);
}</span></pre>
</div>
<span class="cnblogs_code_collapse">JS部分</span></div>
<div class="cnblogs_code">
<div id="cnblogs_code_open_5322c083-9ca5-4614-8bab-9f8a4b6117fb" class="cnblogs_code_hide">
<pre><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> WebSocket 实现轮询到双工的转变</span>
<span style="color: rgba(0, 0, 255, 1)">class</span> ChatHandler(WebSocketHandler):  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 继承Handler以处理来自WebSocket协议的请求</span>
<span style="color: rgba(0, 0, 0, 1)">  
  pool </span>= set()  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 用户池</span>
  
  <span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> open(self):
    self.pool.add(self)
    </span><span style="color: rgba(0, 0, 255, 1)">print</span>(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">user login!</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">)
  
  </span><span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> on_close(self):
    self.pool.remove(self)
    </span><span style="color: rgba(0, 0, 255, 1)">print</span>(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">user logout!</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">)

  </span><span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> on_message(self, message):
    uid_t </span>= <span style="color: rgba(128, 0, 0, 1)">""</span><span style="color: rgba(0, 0, 0, 1)">
    uid </span>= self.get_cookie(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">uname</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">)
    </span><span style="color: rgba(0, 0, 255, 1)">print</span>(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">user {} send a message: {}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">.format(uid, message))
    </span><span style="color: rgba(0, 0, 255, 1)">for</span> u <span style="color: rgba(0, 0, 255, 1)">in</span><span style="color: rgba(0, 0, 0, 1)"> self.pool:
      </span><span style="color: rgba(0, 0, 255, 1)">print</span>(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">updating</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">)
      u.write_message(dict(
        uid </span>=<span style="color: rgba(0, 0, 0, 1)"> uid,
        msg </span>=<span style="color: rgba(0, 0, 0, 1)"> message,
        uid_t </span>=<span style="color: rgba(0, 0, 0, 1)"> uid_t
      ))

  </span><span style="color: rgba(0, 0, 255, 1)">def</span><span style="color: rgba(0, 0, 0, 1)"> check_origin(self, origin):
        </span><span style="color: rgba(0, 0, 255, 1)">return</span> True  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 允许WebSocket的跨域请求</span></pre>
</div>
<span class="cnblogs_code_collapse">Tornado部分</span></div>

<p>　　最终实现效果如图：</p>
<p><img width="500" style="display: block; margin-left: auto; margin-right: auto; -webkit-filter: grayscale(100%)" src="/assets/posts/experiment-chat/chat-result.png"></p>
<p style="text-align: center"><span style="font-size: 12px; color: rgba(136, 136, 136, 1)">图3 聊天界面</span></p>

<p style="text-align: left">　　<span style="font-size: 18pt"><strong>Part3 jQuery与其它</strong></span></p>
<p style="text-align: left">　　之前觉得jQuery是个麻烦的东西，用下来发现只用从公用网络导入包，就多了很多实用的功能。本次感触最深的就是js调用DOM时对script和html的加载顺序限制很大，要放之前我肯定还是老实的把script部分放下面，但因为做动态文本框的时候用到了jQuery，一搜才知道jQuery调用DOM过于方便了，以后我就是jQuery单推人了（bushi</p>
<p style="text-align: left">　　放两个值得学习的链接吧：</p>
<p style="text-align: left">　　　　1、<a href="https://www.w3school.com.cn/jquery/index.asp" target="_blank" rel="noopener nofollow">jQuery教程</a></p>
<p style="text-align: left">　　　　2、<a href="http://www.ruanyifeng.com/blog/2017/05/websocket.html" target="_blank" rel="noopener nofollow">WebSocket教程</a></p>
<p style="text-align: left">　　本次实验还有保存聊天记录的需求，因为数据都能在服务器端获取到，如下图所示。在python中用一个list保存，在下次登陆的时候匹配一下用户名并显示在网页上就可以了，然而跟我最开始构思的聊天室差距太大了，就不做了<span style="text-decoration: line-through">去赶原型图了</span>。</p>
<p><img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-chat/chat-final.png"></p>
<p style="text-align: center"><span style="font-size: 12px; color: rgba(136, 136, 136, 1)">图4 服务器端获取到的消息</span></p>

<hr>
<p style="text-align: right">2021年4月5日</p>
<p style="text-align: right">18点16分</p>
<p style="text-align: right">H40Y</p>
{% endraw %}
