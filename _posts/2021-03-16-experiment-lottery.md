---
title: "实验项目一 编写活动抽奖网页版程序"
date: "2021-03-16"
description: "本学期的综合项目的目标是开发一个完整的直播应用案例，其中涉及H5、Web服务端REST API，以及直播推拉流等方面的开发技术。其中技术的自检通过几个实验项目来实现。在实现实验项目时，遇到诸多问题，通过搜索资料学习，逐一解决遇到的问题。这个实验项目从零开始到最终实现，其中细节记录于此，以便日后回顾。"
summary: "从 PyQt5、Tornado 到前端抽奖效果的完整实验笔记。"
permalink: "/posts/experiment-lottery.html"
source_url: "https://www.cnblogs.com/h40y/p/14543868.html"
---

{% raw %}
<p>　　本学期的综合项目的目标是开发一个完整的直播应用案例，其中涉及H5、Web服务端REST API，以及直播推拉流等方面的开发技术。其中技术的自检通过几个实验项目来实现。在实现实验项目时，遇到诸多问题，通过搜索资料学习，逐一解决遇到的问题。这个实验项目从零开始到最终实现，其中细节记录于此，以便日后回顾。</p>

<p>　　<span style="font-size: 18pt"><strong>Part0 事前准备</strong></span></p>
<p>　　在pip install PyQt5时发现系统上整个python的环境稀烂，pip无法直接运行还需要从根目录才能调用，之前都是Pycharm上的pip管理勉强解决，现在Pycharm也无法顺利完成安装，加之pip显示的python版本过时，遂重新安装python并重新设置python环境。</p>
<p>　　安装完PyQt5后，完成了第一个页面的加载：</p>
<div class="cnblogs_code">
<div id="cnblogs_code_open_0395c135-044a-4453-bf63-e6e12ca7f7cb" class="cnblogs_code_hide">
<pre><span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> sys
</span><span style="color: rgba(0, 0, 255, 1)">from</span> PyQt5.QtCore <span style="color: rgba(0, 0, 255, 1)">import</span> *
<span style="color: rgba(0, 0, 255, 1)">from</span> PyQt5.QtGui <span style="color: rgba(0, 0, 255, 1)">import</span> *
<span style="color: rgba(0, 0, 255, 1)">from</span> PyQt5.QtWidgets <span style="color: rgba(0, 0, 255, 1)">import</span> *
<span style="color: rgba(0, 0, 255, 1)">from</span> PyQt5.QtWebEngineWidgets <span style="color: rgba(0, 0, 255, 1)">import</span> *

<span style="color: rgba(0, 0, 255, 1)">class</span><span style="color: rgba(0, 0, 0, 1)"> MainWindow(QMainWindow):
    </span><span style="color: rgba(0, 0, 255, 1)">def</span> <span style="color: rgba(128, 0, 128, 1)">__init__</span><span style="color: rgba(0, 0, 0, 1)">(self):
        super(MainWindow, self).</span><span style="color: rgba(128, 0, 128, 1)">__init__</span><span style="color: rgba(0, 0, 0, 1)">()
        self.setWindowTitle(</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">加载外部网页的例子</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">) 
        self.setGeometry(</span>5,30,1355,730<span style="color: rgba(0, 0, 0, 1)">) 
        self.browser</span>=<span style="color: rgba(0, 0, 0, 1)">QWebEngineView()
        self.browser.load(QUrl(</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">http://html5test.com</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">))
        self.setCentralWidget(self.browser)

</span><span style="color: rgba(0, 0, 255, 1)">if</span> <span style="color: rgba(128, 0, 128, 1)">__name__</span> == <span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">__main__</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">:
    app</span>=<span style="color: rgba(0, 0, 0, 1)">QApplication(sys.argv)
    win</span>=<span style="color: rgba(0, 0, 0, 1)">MainWindow()
    win.show()
    app.exit(app.exec_())</span></pre>
</div>
<span class="cnblogs_code_collapse">加载外部网页的例子</span></div>
<p>　　效果如图：</p>
<p><img width="500" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-lottery/qt-webengine.png"></p>

<p>　　加载该网页是为了看出QT中的WebEngine并不支持H264和AAC编码，因此需要重新编译QT源代码。 ←PPT上写的</p>
<p>　　准备就绪，接下来准备网页。</p>

<p>　　<span style="font-size: 18pt"><strong>Part1 网页</strong></span></p>
<p>　　网页的样式沿用了之前一个项目的样式，并且只设置了最简单基础的功能，基本的框架搭建好后，剩下的细节（如怎么抽奖、如何增加抽奖过程中的悬念）由于与上传的名单挂钩，思考了一下等完成服务端之后再同步解决了。</p>
<p>　　网页样式如下：</p>
<p><img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-lottery/lottery-page.png"></p>
<p>　　本来网页的配色是沿用之前项目的浅绿的，但是在美化选择文件按钮时直接复制了<a href="https://www.haorooms.com/post/css_input_uploadmh" target="_blank" rel="noopener nofollow">网上</a>的代码，发现配色害挺好看，就整个网页都改成图标的配色了。</p>

<p>　　<span style="font-size: 18pt"><strong>Part2 Tornado</strong></span></p>
<p>　　说实话看见这个词汇完全没有头绪（除了之前因为某个浏览器记住了它的涵义外），百度上得到的结果也只是一个文档，尝试去B站搜索后发现相关教程（BV1kA41187TD），虽然看评论评价一般，但尚且只是入门，就看下去了。看完前3p之后发现讲的内容足够完成本次项目了，用到的代码如下：</p>
<div class="cnblogs_code">
<div id="cnblogs_code_open_54755d67-8e5f-4eb2-ba93-80df09957b3d" class="cnblogs_code_hide">
<pre><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> coding = utf-8</span>

<span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> tornado.web
</span><span style="color: rgba(0, 0, 255, 1)">import</span><span style="color: rgba(0, 0, 0, 1)"> tornado.ioloop

</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 创建处理类</span>
<span style="color: rgba(0, 0, 255, 1)">class</span><span style="color: rgba(0, 0, 0, 1)"> IndexHandle(tornado.web.RequestHandler):
    </span><span style="color: rgba(0, 0, 255, 1)">def</span> get(self, *args, **<span style="color: rgba(0, 0, 0, 1)">kwarfs):
        self.write(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">hello tornado!</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">)
 
</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 创建Application对象</span>
app = tornado.web.Application([(r<span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">/</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">, IndexHandle)])

</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 绑定监听端口号</span>
app.listen(8888<span style="color: rgba(0, 0, 0, 1)">)

</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 启动监听</span>
tornado.ioloop.IOLoop.instance().start()  </pre>
</div>
<span class="cnblogs_code_collapse">创建服务器</span></div>
<p>　　看完视频后的理解：用Handler类处理匹配到的网页，Handler类中的get/post()读取/向网页输出内容，Application对象匹配域名并监听端口，最后启动监听，服务器就启动了。理解完毕后，就将三个页面简单的拼接在了一起。输完代码运行后发现两个问题：1、网页加载不出来css样式；2、无法跳转到下一个网页。</p>
<p>　　对于问题1，主要是没有配置好网页模板和静态资源的路径，添加到app对象里即可。代码如下：</p>
<div class="cnblogs_code">
<pre><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 设置静态路径，不设置的话会出现无法加载css/js的问题</span>
template_path = os.path.join(os.path.dirname(<span style="color: rgba(128, 0, 128, 1)">__file__</span>), <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">templates</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">),
static_path </span>= os.path.join(os.path.dirname(<span style="color: rgba(128, 0, 128, 1)">__file__</span>), <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">static</span><span style="color: rgba(128, 0, 0, 1)">"</span>),</pre>
</div>
<p>　　此外还有一个方便后续编辑的版本，当时没有及时保存，之后找到了再编辑吧……</p>
<p>　　对于问题2，就是app对象的参数中间没有加逗号的问题了，毕竟是很少这么用的分行写参数的写法……</p>

<p>　　处理网页表单中输入的文字着实简单，然而文件就没有那么温柔了，谁能想到request.files.get()返回的若空是空字典，若非空则是字典集合呢（虽然也能理解）？</p>
<div class="cnblogs_code">
<pre>name_list = self.request.files.get(<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">nameList</span><span style="color: rgba(128, 0, 0, 1)">"</span>)[0][<span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(128, 0, 0, 1)">body</span><span style="color: rgba(128, 0, 0, 1)">'</span><span style="color: rgba(0, 0, 0, 1)">].decode().split()
</span><span style="color: rgba(0, 128, 0, 1)">#</span><span style="color: rgba(0, 128, 0, 1)"> 注意这个0，获取到的数据是一个列表里装着字典</span></pre>
</div>
<p>　　<span style="background-color: rgba(255, 255, 255, 1); font-family: &quot;PingFang SC&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 14px">get()返回的字典里面有很多诸如文件名之类的信息，需要的只有body中的正文，decode()用于将二进制转为字符串，split()切分为数组便于处理。</span></p>
<p>　　基础的框架搭建好了，要着手准备最重要的核心功能——抽奖了。</p>

<p>　　<span style="font-size: 18pt"><strong>Part3 抽奖</strong></span></p>
<p>　　抽奖部分在python中完成，虽然只是一个简单的Random就能解决的问题，首先是按照课件上numpy的要求，使用了np.random.randint(quantity, size=)来生成一组随机数，这组随机数是用Array装起来的，第一次调用起来磕磕绊绊。虽然前期的测试没有出现问题，但后续发现的一个数组中重复数字的问题让我苦恼了很久，最后发现random可以直接生成不重复的list，岂不美哉？想了下能少导一个第三方包不是更好，最后还是用自带的Random解决了。代码如下：</p>
<div class="cnblogs_code">
<pre>prize = random.sample(range(quantity), len)</pre>
</div>
<p>　　抽奖完后，首先要考虑的问题就是怎么将数据传给网页，搜索后发现self.render()可以直接传递参数，就美滋滋地把人数和名单（<strong>列表</strong>）传过去了。</p>
<p>　　抽奖方式就用最初的想法：滚动的名字条（虽然在后面搜索的过程中产生了很多花里胡哨的想法，但因为认为实现难度大放弃了哈哈哈），网上搜索到两个相关案例，最后选择了效果最接近的<a href="https://www.cnblogs.com/jdWu-d/p/14277377.html" target="_blank">一个</a>，出于前一个项目养成的优良传统（强迫症），遂把js和网页分离，带来了无尽的折磨……</p>
<p>　　首先是&lt;br&gt;无法正常显示，改成&lt;br /&gt;&lt;/br&gt;都不行，改成"\n"却可以，想了想可能是js和html的差别？但是我参考的代码就是使用&lt;br&gt;的，着实迷惑，不过这个问题先放一边了。</p>
<p>　　其次是传递来的参数怎么调用，网上能匹配到的关键词也只有<a href="https://www.kancloud.cn/kancloud/python-basic/41712" target="_blank" rel="noopener nofollow">在html里</a>可以直接用{{}}绑定数据，但是js里怎么调用是个谜；再往前一步，这个数据是以怎样的形式存在内存里的我也不知道（虽然现在也不知道！！）网上找了半天，终于找到了<a href="https://www.cnpython.com/qa/102235" target="_blank" rel="noopener nofollow">解决方案</a>（后面发现这个问题竟然就在我做代码前几天问的，地球上的另一个我~）：在js定义一个getter()，在html调用getter()。参数成功的传给了js，网页也顺利加载了出来，正当我准备兴奋的完结这个项目的时候，又出问题了：页面显示的内容是诸如[,0&amp;#的单个数字或者字符。测试的时候发先直接在js中使用预设的数组是能正确显示结果的，在html直接显示{{nameArray}}也是能够显示出来的，html不方便debug着实难住了我，正当我一筹莫展之际，突然想到再做一个按钮显示js里的东西：</p>
<div class="cnblogs_code">
<pre><span style="color: rgba(0, 128, 0, 1)">&lt;!--</span><span style="color: rgba(0, 128, 0, 1)">&lt;button type="button" class="operbtn" onclick="showinfo()"&gt;信息展示&lt;/button&gt;</span><span style="color: rgba(0, 128, 0, 1)">--&gt;</span></pre>
</div>
<p>　　显示出来后，人愣住了，&amp;<span class="hljs-preprocessor">#39是什么东西，仔细观察结构后发现，这玩意儿好像是方括号，应该是js转义了，遂去找避免转义的方法，结果找到的方法均不能使用。原因为何？调用typeof发现{{}}保存的其实是字符串，那么也许在传输给html的时候就已经进行转义了。在我放弃使用正则匹配出所有的内容的时候（我的正则实在是太垃圾了），突然想到，不如从根源上解决这个问题：既然js这边难以处理方括号，那在python那边就干脆不要传<strong>列表</strong>好了（其实一开始就应该这么做的）。处理好数据，传到js，split()切分，输出，这一次的显示一次实现，十分完美（？），夜已深，赶紧睡觉。</span></p>

<p><span class="hljs-preprocessor">　　<span style="font-size: 14pt"><strong>Part3.1 修bug</strong></span></span></p>
<p><span class="hljs-preprocessor">　　第二天打开，突发奇想想要改一下用例（之前人数设置都是123，改成222），一改就出问题了，抽奖的过程还是123，结果是正常输出的。一番寻找后发现，js设置的就是两/三个拼在一起，自然是没法显示222的。于是在生成数据的时候用for函数循环，不行；那么修改成含参的函数，调用的时候加上数量作为参数，还是不行。在网上找了很多for循环的用法，也用过for(…in…)，甚至还差点去搜索了抖动，结果往上一拉，哦，没传参数。加上参数，至此，网页项目正式完成。</span></p>
<p><span class="hljs-preprocessor">　　抽奖效果如图：</span></p>
<p><span class="hljs-preprocessor"><img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-lottery/lottery-result.png"></span></p>

<p>　　<span style="font-size: 18pt"><strong>Part4 收尾</strong></span></p>
<p>　　最后想整合PyQt5和tornado，在一个程序中直接创建服务器，并创建窗口打开。但是无论怎么修改代码顺序，要么无法打开窗口，要么无法加载服务器，要么窗口卡死。分开两个py文件里是可以正常运行并显示网页的，想了想本来服务器和前端就是两个程序把，一起运行真是妄想。不过就算可以，也交给以后的我了。</p>

<p>　　<span style="font-size: 14pt"><strong>Part4.1 追加需求（20210318）</strong></span></p>
<p>　　发给老师审核，老师建议最好能增加个控制抽奖次数的设置，刚好之前的网页就有没能增加弹窗功能的遗憾，就顺手一起做了。经搜索得到了满意的结果，将<a href="https://hcshow.blog.csdn.net/article/details/103124624" target="_blank" rel="noopener nofollow">悬浮窗＋页面遮罩</a>一起做了。最终实现的效果如图：</p>
<p><img width="250" style="display: block; margin-left: auto; margin-right: auto" src="/assets/posts/experiment-lottery/lottery-settings.png"></p>

<p>　　默认是全部一起抽取，也增设了逐级抽取的选项（逐一抽取没有做，也想不到应用场景），做出来也只是用if语句区分开来，没有做更细致的改动。</p>

<hr>

<p style="text-align: right">2021年3月16日</p>
<p style="text-align: right">15点37分</p>
<p style="text-align: right">H40Y</p>
{% endraw %}
