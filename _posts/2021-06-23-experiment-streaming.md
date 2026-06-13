---
title: "实验项目三 推流"
date: "2021-06-23"
description: "项目比较核心的一块，但主要内容在与软件的使用。直播项目分为采集、编码、推流、拉流、解码以及过程间的处理。这个项目的采集、编码、推流用ffmpeg实现，拉流、解码用B站开源的flv.js实现。 比较系统的ffmpeg的介绍见CSDN，下面还会提到。flv.js项目见GitHub。 Part1 Ngin"
summary: "用 ffmpeg、Nginx 和 flv.js 搭起推流与拉流链路。"
permalink: "/posts/experiment-streaming.html"
source_url: "https://www.cnblogs.com/h40y/p/14907012.html"
---

{% raw %}
<p>　　项目比较核心的一块，但主要内容在与软件的使用。直播项目分为采集、编码、推流、拉流、解码以及过程间的处理。这个项目的采集、编码、推流用ffmpeg实现，拉流、解码用B站开源的flv.js实现。</p>
<p>　　比较系统的ffmpeg的介绍见<a href="https://blog.csdn.net/Fandes_F/article/details/105127542" target="_blank" rel="noopener nofollow">CSDN</a>，下面还会提到。flv.js项目见<a href="https://github.com/bilibili/flv.js" target="_blank" rel="noopener nofollow">GitHub</a>。</p>

<p>　　<span style="font-size: 18pt"><strong>Part1 Nginx</strong></span></p>
<p>　　Nginx用来作流媒体服务器。流媒体再传播过程中的协议有许多种类，这个项目采用的是HTTP-FLV，理由很简单，RTMP用不了了，HLS受众小。</p>
<p>　　Nginx官网下载的包并不支持采用的HTTP-FLV，需要将第三方模块nginx-http-flv-module编译进去。该模块介绍见<a href="https://blog.csdn.net/winshining/article/details/74910586" target="_blank" rel="noopener nofollow">CSDN</a>，项目见<a href="https://github.com/winshining/nginx-http-flv-module" target="_blank" rel="noopener nofollow">GitHub</a>。</p>

<p>　　<span style="font-size: 14pt"><strong>Part1.1 编译支持nginx-http-flv-module的Nginx</strong></span></p>
<p>　　步骤参考<a href="https://blog.csdn.net/kaychangeek/article/details/105095844" target="_blank" rel="noopener nofollow">CSDN</a>。</p>
<p>　　遇到的问题：</p>
<p>　　▶auto/configure失败</p>
<p>　　　　▷版本号未对应，修改指令即可</p>
<p>　　▶warning C4047: “return”:“const char *”与“int”的间接级别不同</p>
<p>　　　　▷参考<a href="https://blog.csdn.net/GSzhan/article/details/53228075" target="_blank" rel="noopener nofollow">CSDN</a>，将return(cflags); 改成 &nbsp;return(CFLAGS);即可</p>
<p>　　▶error LNK2019: 无法解析的外部符号 ___iob_func，该符号在函数 _main 中被引用</p>
<p>　　　　▷原因经搜索应该是VS版本更新带来的包引用出问题，碍于软件水平不到位，暂用现成项目。</p>

<p>　　编译完成后，使用前需要对Nginx配置文件：Nginx.conf进行配置，详解见<a href="https://blog.csdn.net/weixin_42167759/article/details/85049546" target="_blank" rel="noopener nofollow">CSDN</a></p>
<div class="cnblogs_code">
<pre><span style="color: rgba(0, 0, 0, 1)">event{}<br>
http{}<br>
rtmp{　　#即rtmp服务器
　　paramerter
　　server{
　　　　listing
　　　　application{}
　　}
}</span></pre>
</div>

<p>　　服务器配置好并应用后，开启服务器即可进行推拉流的尝试了：</p>
<div class="cnblogs_code">
<pre>//<span style="color: rgba(0, 0, 0, 1)"> push
ffmpeg </span>-re -i test1.mp4 -vcodec h264 <span style="color: rgba(0, 128, 128, 1)">-f</span> flv rtmp://localhost:1935/http_flv/<span style="color: rgba(0, 0, 0, 1)">vedio<br>// -i 后面跟输入 最后是输出，其余都是参数。ffmpeg的退出指令是q，不过ctrl+c显示的也是正常退出。<br>
</span>//<span style="color: rgba(0, 0, 0, 1)"> pull
http:</span>//localhost:8080/live?port=1935&amp;app=http_flv&amp;stream=vedio<br>// 8080是Nginx的http服务监听的端口，live是http服务中location，port后面跟rtmp监听的端口，app对应rtmp服务中的应用，流名称自定义。<br>// or<br>rtmp://localhost:1935/http_flv/vedio<br>// 需要支持rtmp域</pre>
</div>

<p>　　<span style="font-size: 18pt"><strong>Part2 构建flv.js和flv.min.js</strong></span></p>
<p>　　详见<a href="https://github.com/Bilibili/flv.js" target="_blank" rel="noopener nofollow">Github</a>中Install和Build部分</p>
<p>　　遇到的问题</p>
<p>　　▶Assertion `args[1]-&gt;IsString()' failed.</p>
<p>　　　　▷参考<a href="https://blog.csdn.net/taizuduojie/article/details/83380997" target="_blank" rel="noopener nofollow">CSDN</a></p>
<p>　　　　▷gulp版本太低，故更新gulp版本npm install --save-dev gulp@4</p>
<p>　　▶AssertionError [ERR_ASSERTION]: Task function must be specified</p>
<p>　　　　▷参考<a href="https://www.jianshu.com/p/40b99bed3127" target="_blank" rel="noopener nofollow">简书</a>&nbsp;和 <a href="https://www.xinran001.com/frontend/47.html" target="_blank" rel="noopener nofollow">这个网站</a></p>
<p>　　　　▷gulp版本4.0更换源码，部分代码不符合规范，可修改代码块或者改用gulp3。<span style="text-decoration-line: line-through">大无语事件发生了！！！</span></p>
<p>　　▶ReferenceError:primordials is not defined</p>
<p>　　-node版本高，用nvm工具更换到11.15.0</p>
<p>　　▶Empty block statement　　no-empty</p>
<p>　　　　OR Missing whitespace after semicolon　　semi-spacing</p>
<p>　　　　OR Unnecessary semicolon　　no-extra-semi</p>
<p>　　　　▷打开对应js文件，修改错误问题即可</p>

<p>　　构造完毕后，在项目中导入flv.js即可使用了，可以通过魔改官方提供的<a href="http://bilibili.github.io/flv.js/demo/" target="_blank" rel="noopener nofollow">Demo</a>偷懒</p>

<p>　　<span style="font-size: 18pt"><strong>Part3 推流到flv.js</strong></span></p>
<p>　　可以直接再官方demo中适用。解析器不支持rtmp域所以需要用http开头的地址拉流。</p>
<p>　　推流若无audio不能开hasAudio按钮，否则无限加载</p>
<p>　　延迟3-10s都遇到过</p>

<hr>
<p style="text-align: right">2021年6月23日</p>
<p style="text-align: right">14点06分</p>
<p style="text-align: right">H40Y</p>
{% endraw %}
