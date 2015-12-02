---
layout: post
title: 你不知道的10种高性能Javascript（上）
description: 10种高性能最佳实践
categories: [前端]
tags: [JavaScript]

---
![pseudo](/assets/image/effective-js-01.jpg)

<br/>
想必大家都知道，JavaScrip是全栈开发语言，浏览器，手机，服务器端都可以看到JS的身影。
本文会分享一些高效的JavaScript的最佳实践，提高大家对JS的底层和实现原理的理解。

#数据存储

可能大家已经开始困惑了，什么是无用的DOM，为什么不存在的元素却能够让显示发生变化。OK，我们先从用法开始讲起。

`:before`， `:after`用法十分简单，它的作用是在元素前后插入新的内容，必须有content属性，外加一些样式。比如：
{% highlight javascript %}
    div:before {
        content: open-quote;
    }
    div:after {
        content: open-quote;
    }

    <div>This is Alex</div>
{% endhighlight %}

你会看到“This is Alex”，前后两个引号就是通过before和after添加上去的，如果你审查元素，你会发现DOM中找不到这两个引号的HTML。

伪元素一般用于改变它们的前景颜色，增加背景色/图，调整字体大小，调整对齐方式等等。那么对于上图而言，我们可以采用两种方式实现：

 - 使用两个div，一个放背景图，一个放黑色背景，然后让两个重叠，产生这种效果
 - 使用一个黑色背景，然后使用伪元素，把图片背景添加上去

如果你能还不能知道如何使用着两种方案实现这样的效果，[可以参考我的做法](https://jsfiddle.net/Alex___Yang/g0o1u6nb/1/)。
对于这两种方案，你是否有自己的看法呢，很明显，第一种做法会有一些没有意义的HTML，像这种时候，我们就该考虑使用伪元素啦。


