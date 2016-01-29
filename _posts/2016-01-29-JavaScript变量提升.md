---
layout: post
title: JavaScript变量和函数提升
description: JavaScript hoisting机制
categories: [前端]
tags: [JavaScript]

---

<br/>
聊到变量和函数，我们不得不谈变量和函数的作用域，对于变量而言，我们知道的全局变量和局部变量。在JavaScript中，唯一能定义变量的作用域语块就是`函数`。所以我们会在函数内部使用闭包来创建局部变量，当然ES6提供了新的变量作用域块级作用域，更加优雅的解决了这一问题。
如图我们可以清楚的知道局部变量和全局变量的区别。
![pseudo](/assets/image/VariableScope.png)

既然我们知道了作用域的不同，那么我们看看下个代码中的变量如何取值
{% highlight javascript %}
   var name = "name variable";
   function test() {
     console.log(name);
     var name = 'name one';
   }
   test();
{% endhighlight %}

上面代码的打印结果是`undefined`。test()方法中的name并没有读取全局变量name，而是在其函数作用域内声明的name。
那么为什么没有打印“name one”呢？

我们来看看JavaScript解析器是如何阅读上面代码的吧
{% highlight javascript %}
   var name = 'global variable';
   function test() {
     var name;
     console.log(name);
     name = 'local one';
   }
   test();
{% endhighlight %}

秘密被揭开的时候，各种魔术把戏都会变得很愚蠢。JavaScript引擎在进行解析的时候会对代码进行两轮处理。
第一轮，初始化变量，第二轮，执行代码。如果你想知道具体细节，他会按如下步骤进行解析：

 - 声明并初始化函数参数
 - 声明局部变量，但不初始化他们，只是将变量提升到作用域最顶端
 - 声明初始化函数声明（不初始化函数表达式）

#总结
这里我们可以获取到关于变量和函数提升的重要信息
对于变量，变量提升发生在编译阶段，它把变量的声明提升至作用域的顶端，并不是提升到全局范围。
对于函数声明，JS解析器会在预解析阶段优先读取函数声明的代码，以确保函数能够被引用到；而对于函数表达式，只有在执行到相应的语句时才进行解析。在实际中，具体表现在：当使用函数声明的形式来定义函数时，可将调用放在函数声明之前，而使用函数表达式，这样做的话会报错。


