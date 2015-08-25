---
layout: post
title: 玩转JavaScript this用法
description: 剖析JavaScript原理，以及this应该避免的坑
categories: [前端]
tags: [JavaScript]

---
<br/>
    在web项目中Javascript是一门必须要掌握的动态语言，基于Javascript的框架大多离不开不了最基础的Javascript的用法和原理。本文主要是总结一下Javascript中那万恶的this关键字。
开门见山，抛出一个观点：

>“Javascript中this永远是指向调用它的对象”。
>

下面我会举3个最有代表性的例子来验证我的这个观点。

# 例一 对象方法调用

{% highlight javascript %}
    var x = 1;
    function testThis(){
        console.log(this.x);
    } 

    testThis();

    // 这里声明了一个全局变量x,一个全局方法，这两个对象都绑定在Window上，所以当运行testThis()的结果就是取Window对象上的x成员，结果是1
    var o={};
    o.x = 5;
    o.method = testThis;
    o.method();

    // 此时，我们讲o对象的method指向了testThis, 当调用它的时候，this指向调用他的对象，这是x就是去o对象的x，结果是5

{% endhighlight %}

这个例子十分基础，也就是常见的对象调用方法的时候，方法里面的this就是指向调用他或者是拥有他的对象

# 例二 构造函数创建

{% highlight ruby %}
    var x = 2;    
    function test(){
        this.x = 1;
    }

    var o = new test();
    console.log(o.x);  // 1

    //这就是javascript中的构造函数，通过new来创建一个实例，这里取的值是绑定在对象o里面的x,所以是1

    //下面这个例子是Angular中的Service，你可以直接理解成他会通过第二个参数new一个单例对象
    app.service("MyService", function ($http, $modal) {
         this.test = function() {
               console.log(this);
               test2();
         }
          
         function test2() {
               console.log(this)
         }
    }        

    MyService.test() // 打印 MyService {test: function} 和 Window {}
    //这里log出来虽然test2()可以被test1()调用，但它其实并不属于Service, 所以如果test2里面调用this,就会出现常见的错误，哎呀妈呀，咋调不了自己的方法？！

{% endhighlight %}

这个例子我们项目中经常出现，而且很难解释清楚，就像还有人问我为什么controller中不直接使用this，而是要用$scope来绑定方法和变量，当然用this能够取代部分$scope，但是难免遇到this的上下文不同引起的一系列问题。这个问题的关键就是test2方法并不属于对象Service，但是由于在service闭包(closure)里面，他可以被Service调用，所以test2里面的this就不是指向Service，从而调用Service里面的其他方法就会报错。

# 例三 改变this指向

{% highlight ruby %}
    function test(){
        console.log(this.x);
    }
    var o={};
    o.x = 1;
    o.m = test;

    o.m.apply({x:5});   //5
    o.m.call()  // undefined

    //通过apply/call来指定调用函数的this作用上下文，都是指用参数对象来调用o对象的函数，默认参数是Global

{% endhighlight %}

其实通过这个例子，大家就已经可以看到this的指向是不确定的，this值在进入上下文时确定，并且在上下文运行期间永久不变。上面的例子改变this的上下文，导致两次结果不一致也是最好的证据。

# 最后

本文最大的作用就是如果看完本文你能够理解this为什么有时候会跟自己期望不一样，而且能得到一个避免这样问题发生的解决方案，那我的目的就达到了。很幸运你能看到这里，解决方案呈现给大家：就像Angular要将属性和方法给你提供一个$scope来绑定属性，也像coffeeScript会在对象一开头有这么个赋值“ _this = this”，我们在自己的js实践中不妨定义"val self = this"，在之后的作用域里面用self来操作对象的属性，这是解决之道。
