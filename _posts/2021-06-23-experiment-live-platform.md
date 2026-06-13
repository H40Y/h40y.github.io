---
title: "实验项目四 直播平台"
date: "2021-06-23"
description: "最后一项——一个直播平台。额外功能不提了，核心还是推拉流。 Part1 在Python上用ffmpeg进行推流 参考：CSDN，Python的ffmpy貌似只能指定文件路径的输出，所以想要在Python上用ffmpeg进行推流，只能用subprocess模块启动一个新进程，并连接到它们的输入/输出/"
summary: "最后一项，一个围绕推拉流展开的直播平台实验记录。"
permalink: "/posts/experiment-live-platform.html"
source_url: "https://www.cnblogs.com/h40y/p/14922904.html"
---

{% raw %}
<p>　　最后一项——一个直播平台。额外功能不提了，核心还是推拉流。</p>

<p>　　<span style="font-size: 18pt"><strong>Part1 在Python上用ffmpeg进行推流</strong></span></p>
<p>　　参考：<a href="https://blog.csdn.net/rainweic/article/details/94666527" target="_blank" rel="noopener nofollow">CSDN</a>，Python的ffmpy貌似只能指定文件路径的输出，所以想要在Python上用ffmpeg进行推流，只能用subprocess模块启动一个新进程，并连接到它们的输入/输出/错误管道，从而获取返回值。关于subprocess也可参见<a href="https://www.runoob.com/w3cnote/python3-subprocess.html" target="_blank" rel="noopener nofollow">Runoob</a>。</p>
<p>　　最后是构建了一个pushHelper类，用于满足不同的推送需求。subprocess部分的核心代码见下：</p>
<div class="cnblogs_code">
<pre><span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> subprocess as sp

process </span>= sp.Popen(command, shell=False, stdout=sp.PIPE, stderr=sp.STDOUT, encoding=<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">utf-8</span><span style="color: rgba(128, 0, 0, 1)">"</span>, text=<span style="color: rgba(0, 0, 0, 1)">True)

</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> do something</span></pre>
</div>
<p>　　此外这部分也用到了OpenCV这个三方库，主要用它获取摄像头帧，核心代码见下：</p>
<div class="cnblogs_code">
<pre>camera_path = <span style="color: rgba(128, 0, 0, 1)">""</span><span style="color: rgba(0, 0, 0, 1)">
cap </span>=<span style="color: rgba(0, 0, 0, 1)"> cv.VideoCapture(camera_path)

</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 获取摄像头帧</span>
fps = int(cap.get(cv.CAP_PROP_FPS))</pre>
</div>

<p>　　<span style="font-size: 14pt"><strong>Part1.1 获取本地视频设备列表</strong></span></p>
<p><strong>　　</strong>关键：遍历标准输出，正则匹配即可。</p>
<div class="cnblogs_code">
<pre>cmd = []  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 指令</span>
process = subprocess.Popen(cmd, [opt])  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 运行</span>

<span style="color: rgba(0, 0, 255, 1)">for</span> line <span style="color: rgba(0, 0, 255, 1)">in</span> process.stdout:  <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 读取标准输出</span>
    <span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)">匹配需要的内容</span></pre>
</div>

<p>　　<span style="font-size: 18pt"><strong>Part2 浏览器拉流</strong></span></p>
<p>　　主要是读官方flv.js中的脚本代码理解如何运作的，之后重新写脚本。不过我用的是魔改源代码的方式就是了……</p>
<p style="text-align: center"><img width="500" src="/assets/posts/experiment-live-platform/live-platform.png">&nbsp;</p>
<p style="text-align: center">图1 效果如图所示</p>
<p style="text-align: left">　　使用的时候遇到一个问题尚未解决：一个浏览器智能运行一个播放器。</p>

<p>　　<span style="font-size: 18pt"><strong>Part3 系统集成</strong></span></p>
<p>　　系统集成遇到的最大的问题是一个py文件下只能运行一个程序，比如说运行着Tornado的文件不能推流，推流的进程不能创建PyQt5窗口……吗？</p>
<p>　　毋庸置疑是可以的，要用到python的多线程技术，具体内容可参考<a href="https://www.runoob.com/python/python-multithreading.html" target="_blank" rel="noopener nofollow">Runoob</a>。</p>
<p>　　处理线程的启动和中止即可，由于平台实际上很简陋，暂时用不上同步&amp;死锁相关内容。</p>

<p>　　<span style="font-size: 18pt"><strong>Part4 结束语</strong></span></p>
<p>　　三天做完了，都可以发个B站视频了（bushi&nbsp;</p>
<p>　　还有很多很简单的功能没做，比如说白板、数据库连接，或者说用户注册、用户中心之类的页面，都没做，不过倒是积累了很多经验。比如这次实验第一次接触的编译文件，第一次接触的多线程功能，当然还有这次实践的主题：直播（也即推拉流）。确实是很有收获的一次课程实践，要不然也不会专门写几篇文字，希望以后也能记录下去，哈哈。</p>
<hr>
<p style="text-align: right">2021年6月23日</p>
<p style="text-align: right">15点33分</p>
<p style="text-align: right">H40Y</p>
{% endraw %}
