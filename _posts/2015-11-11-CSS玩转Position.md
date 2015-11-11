---
layout: post
title: CSS玩转Position
description: CSS中position的介绍和用法
categories: [前端]
tags: [CSS]

---
![position](/assets/image/css-position.jpg)

<br/>
    布局是前端开发必须要掌握的技能，我会详细介绍position的4种状态并且用实例演示如何使用他们。
<br/>
    position的四种状态分别是：`static`， `relative`， `absolute`， `fixed`。下面我将分别介绍这四种属性
    然后会使用实例来阐述介绍中的含义。

###static

        static是position的默认属性，他不会拥有任何其他属性，static的布局会根据html的默认布局进行排列。

###relative

        relative和static属性表现基本一样，元素会在保留在文档流中，并且占有原来文档流的位置始终不变。
        relative的特性是你可以给他添加四个属性top, left, right, bottom。例如top是使其距离它文档流的上边框的距离。
        其他元素不会调整位置来弥补他移动带来的空缺，因为元素所在文档的位置没有变化。

###absolute

        absolute的定于必须要根据距离他最近的祖先元素中状态为positioned（fixed, relative）的元素进行定位。
        使用这个属性会使元素脱离文档流，其他元素会来弥补他的移动带来的空缺，并且同样拥有top，left，right，bottom四个属性来调整位置。

###fixed

        fixed是指元素脱离文档流，并且位置相对视窗固定，这就意味着滚动页面不会影响该元素的位置和显示。他同样有四个属性进行调整他所相对视窗边距的位移。



如果你对我的描述感到困惑，不妨看我的一个示例，里面清晰简洁的使用了position这个属性。[如果你打不开，你就土了](http://jsfiddle.net/Alex___Yang/f9pvsdsc/)
