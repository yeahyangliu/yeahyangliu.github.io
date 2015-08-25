---
layout: post
title: 玩转JavaScript module pattern精髓
description: 介绍JavaScrip模块化，了解不同方式的模块化方式
categories: [前端]
tags: [JavaScript]

---
<br/>
<br/>
    JavaScript module pattern是一种常见的javascript编码模式。这种模式本身很好理解，但是有很多高级用法还没有得到大家的注意。本文，我们将回顾这种设计模式，并且介绍一些高级的用法，其中一个是我原创的。

# 我的问题

在我的项目中经常会在一个jsp中import包含下面这样的JavaScript代码的文件：

{% highlight javascript %}
    var myBrand = {
        name:"xxx"
    };
    
    var isBrand = function(brand) {
        return brand === "xxx"
    }

{% endhighlight %}

在和我们公司一位非常senior的同事陈显军结对编程的时候，得知：定义在所有函数最外边，使用或不使用var关键字定义的变量都是全局变量。而且最终合并成一个js文件，也就是说这种方式定义方法和变量是非常危险而且非常容易污染一些其他框架中的全局变量。这也就是为什么我会翻译这篇JavaScript module pattern。一些常用的框架像JQuery和Underscore都是采用这种模块化的方式来实现的。

# 基础用法

我们会先从介绍module模式，如果你对module模式比较熟悉，可以直接跳到高级用法处。

### 1.匿名闭包

这是一种基本的javascipt构造方法，也是javascipt中最好的特性，我们申明一个匿名函数，并且立即执行这个函数。函数中所有的代码都生活在一个闭包里，这个闭包让私有方法和成员成为现实，并且仅能够存在我们应用程序的整个生命周期。

{% highlight ruby %}
    (function () {
        // ... all vars and functions are in this scope only
        // still maintains access to all globals
    }());

{% endhighlight %}

请注意()包着的这个匿名函数。这是语言需要，如果没有()包着函数，javasript会认为这是一个函数声明。由于括弧()和JS的&&，异或，逗号等操作符是在函数表达式和函数声明上消除歧义的，所以一旦解释器知道其中一个是表达式，其他的也都默认成为了表达式。

### 2.全局引入

javascipt有一种特性叫隐式全局变量。就是当有一个变量被使用时，解释器会遍历作用域链来寻找var声明的这个变量，如果没有找到，这个变量就是默认成为了隐式全局变量。同时这也说明了在匿名闭包中创建全局变量也是非常容易的。不幸的是这样的做法让代码变得很难管理，因为我们很难知道哪个变量的声明周期是全局的。
<br/>
幸运的是，我们的匿名函数提供了一个简单的选择。通过全局变量作为参数，通过这种方式引入全局变量比我们自己定义的隐式全局变量而言，更清晰更快速。这有一个例子：

{% highlight ruby %}
    (function ($, YAHOO) {
        // now have access to globals jQuery (as $) and YAHOO in this code
    }(jQuery, YAHOO));

{% endhighlight %}

现在很多类库里都有这种使用方式，比如jQuery源码。

### 3.模块导出

有时候，如果你不仅想传入全局变量 ，而且你想声明一些全局变量，我们这里提供了一个简单的方法来导出他们，而这个方法就是匿名函数的返回值。这样做就是最基本的模块模式。示例如下：

{% highlight ruby %}

var MODULE = (function () {
    var my = {},
        privateVariable = 1;

    function privateMethod() {
        // ...
    }

    my.moduleProperty = 1;
    my.moduleMethod = function () {
        // ...
    };

    return my;
}());

{% endhighlight %}


请注意，我们声明了一个全局的模块叫MODULE，它包含两个属性，一个成员变量moduleProperty和一个成员方法moduleMethod。除此之外，它还使用匿名函数的闭包维护了私有内部状态，我们也可以通过第二条规则轻松的传入我们需要传入的全局变量。

# 高级用法 

上面的功能对我们日常开发来说已经很实用了，但是我们还是基于此模式可以设计出更强大，更易于拓展的结构。

### 1.扩展（Augmentation）

对于模块模式而言，唯一一条限制就是我们的模块的代码都只能在一个文件中声明。任何在大项目中干过得人都体会到分文件的好处。幸运的是我们有一个非常好的办法来解决这一瓶颈。
<br/>
首先我们导入模块，然后添加属性，随后将其导出，如下面这个例子：

{% highlight ruby %}

var MODULE = (function (my) {
    my.anotherMethod = function () {
        // added method...
    };

    return my;
}(MODULE));

{% endhighlight %}

这里我们还是用var来保存这个返回值，虽然说这里不是必要。等解释玩段代码，新的方法会添加到MODULE中，这个拓文件中依然可以包含一些私有的方法和属性。

### 2.松耦合扩展（Loose Augmentation）

我们上面这个例子要求我们的模块被定义过，然后才有扩展。但这不总是必须的。对JavaScript而言，提高性能最好的方式就是异步加载js文件，我们在加载多个文件的时候希望能够解决加载顺序的问题，我们采用下面这种方式来声明所有的相同的模块：

{% highlight ruby %}

var MODULE = (function (my) {
    // add capabilities...

    return my;
}(MODULE || {}));//这是确保MODULE对象，在存在的时候直接用，不存在的时候直接赋值为{}，

{% endhighlight %}

在这种模式下，用var声明每个模块是必须的，不然其他文件无法读取不到这个模块。

### 3.紧耦合扩展（Tight Augmentation）

虽然说松耦合扩展很棒，能够帮你分文件定义，但是他不能帮你实现重载的功能，也不能在模块初始化的时候使用模块的属性。紧模式帮你拓展了加载顺序限制，还提供了重载机制：

{% highlight ruby %}

var MODULE = (function (my) {
    var old_moduleMethod = my.moduleMethod;

    my.moduleMethod = function () {
        // method override, has access to old through old_moduleMethod...
    };

    return my;
}(MODULE));

{% endhighlight %}

我们重载了moduleMethod方法，而且如果我们需要，可以将原来的方法保存了起来。

### 4.克隆与继承（Cloning and Inheritance）

{% highlight ruby %}

var MODULE_TWO = (function (old) {
    var my = {},
        key;

    for (key in old) {
        if (old.hasOwnProperty(key)) {
            my[key] = old[key];
        }
    }

    var super_moduleMethod = old.moduleMethod;
    my.moduleMethod = function () {
        // override method on the clone, access to super through super_moduleMethod
    };

    return my;
}(MODULE));

{% endhighlight %}

这种模式也许是最不易拓展的的选择了。虽然这种设计十分灵巧，但是也付出了巨大代价。正如我所写的，模块的方法或属性没有被复制，而是对同一个对象多了一个引用而已。改变一个模块的实现，也会影响到另一个。如果用递归来实现克隆可以解决这一问题，但递归对function函数的赋值也不好用，所以我们在递归的时候eval相应的function。不管怎样还是告诉大家这一点。

### 5.子模块（Sub-modules）

我们最后一个模式是这几个当中最简单的模式，我们有很多场景会用到它：

{% highlight ruby %}

MODULE.sub = (function () {
    var my = {};
    // ...

    return my;
}());

{% endhighlight %}

这其实也是module pattern中的高级用法之一，同时，我们也可以将上面的一些模式应用在子模块上。

# 总结

大多数高级用法可以和其他设计模式结合其他使用，如果对于设计复杂的项目，我个人倾向使用：松耦合扩展，私有状态和子模块三种模式。在这里我完全没有提到性能，但这里我还是提一下：这些模式对性能都有提升，松耦合允许并行下载，提高下载速度。代码初始化可能会比原来慢一点，但是由于全局变量的减少，子模块在获取局部变量的速度链变短，所有运行时JavaScript速度是会有显著提升。

(原文中高级模式中的多文件访问私有成员还未能理解，所以没有翻译，望请谅解)

本文翻译自：http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth