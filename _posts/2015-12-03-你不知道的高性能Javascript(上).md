---
layout: post
title: 你不知道的高性能Javascript
description: 10种高性能最佳实践
categories: [前端]
tags: [JavaScript]

---
![pseudo](/assets/image/effective-js-01.jpg)

<br/>
想必大家都知道，JavaScrip是全栈开发语言，浏览器，手机，服务器端都可以看到JS的身影。
本文会分享一些高效的JavaScript的最佳实践，提高大家对JS的底层和实现原理的理解。

#数据存储

计算机学科中有一个经典问题是通过改变数据存储的位置来获得最佳的读写性能，在JavaScript中，数据存储的位置会对代码性能产生重大影响。
 - 能使用{}创建对象就不要使用new Object，能使用[]创建数组就不要使用new Array。JS中字面量的访问速度要高于对象。
 - 变量在作用域链中的位置越深，访问所需实践越长。对于这种变量，可以通过缓存使用局部变量保存起来，减少对作用域链访问次数
 - 使用点表示法（object.name）和操作符（object[name]）操作并没有太多区别，只有Safari会有区别，点始终更快

#循环

在JS中常见的循环有下面几种：
{% highlight javascript %}
 for(var i = 0; i < 10; i++) { // do something}

 for(var prop in object) { // for loop object}

 [1,2].forEach(function(value, index, array) { // 基于函数的循环})
{% endhighlight %}
毋庸质疑，第一种方式是原生的，性能消耗最低的，速度也最快。第二种方式for-in每次迭代都回产生更多的开销（局部变量），它的速度只有第一种的1/7
第三种方式明显提供了更便利的循环方式，但是他的速度只有普通循环的1/8。所以可以根据自己项目情况，选择合适的循环方式。

#事件委托

试想一下页面上每一个A标签添加一个事件，我们会不会给每一个标签都添加一个onClick呢。
当页面中存在大量元素都需要绑定同一个事件处理的时候，这种情况可能会影响性能。每绑定一个事件都加重了页面或者是运行期间的负担。对于一个富前端的应用，交互重的页面上，过多的绑定会占用过多内存。
一个简单优雅的方式就是事件委托。它是基于事件的工作流：逐层捕获，到达目标，逐层冒泡。既然事件存在冒泡机制，那么我们可以通过给外层绑定事件，来处理所有的子元素出发的事件。
{% highlight javascript %}
    document.getElementById('content').onclick = function(e) {
        e = e || window.event;

        var target = e.target || e.srcElement;

        //如果不是 A标签，我就退出
        if(target.nodeNmae !=== 'A') {
            return
        }

        //打印A的链接地址
        console.log(target.href)
    }

{% endhighlight %}

#重绘与重排

浏览器下载完HTMl，CSS，JS后会生成两棵树：DOM树和渲染树。
当Dom的几何属性发生变化时，比如Dom的宽高，或者颜色，position，浏览器需要重新计算元素的几何属性，并且重新构建渲染树，这个过程称之为重绘重排。
{% highlight javascript %}
    bodystyle = document.body.style;
    bodystyle.color = red;
    bodystyle.height = 1000px;
    bodystyke.width = 100%;

{% endhighlight %}
上述方式修改三个属性，浏览器会进行三次重排重绘，在某些情况下，减少这种重排可以提高浏览器渲染性能。
推荐方式如下，只进行一次操作，完成三个步骤：
{% highlight javascript %}
    bodystyle = document.body.style;
    bodystyle.cssText 'color:red;height:1000px;width:100%';

{% endhighlight %}

#JavaScript加载

IE8，Firefox3.5，Chrome2都允许必行下载JavaScript文件。所以<script>不会阻塞其他标签下载。
遗憾的是，JS下载过程依然会阻塞其他资源的下载，比如图片。尽管最新的浏览器通过允许并行下载提高了性能，但是脚本阻塞任然是一个问题。
因此，推荐将所有的<script>标签放在<body>标签的底部，以尽量减少对整个页面渲染的影响，避免用户看到一片空白

#JS文件高性能部署

既然大家已经知道多个<script>标签会影响页面渲染速度，那么就不难理解“减少页面渲染所需的HTTP”是网站提速的一条经典法则。
所以，在产品环境下合并所有的JS文件会减少请求数，从而加快页面渲染速度。
除了合并JS文件，我们还可以压缩JS文件。压缩是指将文件中与运行无关的部分进行剥离。剥离内容包括空白字符，和注释。改过程通常可以将文件大小减半。
还有一些压缩工具会将局部变量的长度减小，比如：
{% highlight javascript %}
    var myName = "foo" + "bar"）

    //压缩后变成

    var a = "foobar"

{% endhighlight %}
