---
layout: post
title: 玩转JavaScript Callback函数
description: 剖析JavaScript原理，以及callback的用法
categories: [前端]
tags: [JavaScript]

---
<br/>
    如果你对Jquery没有足够的经验，但是你又用过JQuery，这么来说没你已经用过了回调函数了。但是你可能不知道它是如何工作和实现的。
<br/>
    这篇文章主要基于我所了解的回调函数，我试图启发大家基于最常规的JavaScript技术之上。也许一些Javascript的专家可以告诉我那些遗漏了。

# 什么是回调函数？
下面是维基百科文章定义的回调函数：
    "A reference to executable code, or a piece of executable code, that is passed as an argument to other code."
下面是一段大家都熟悉的JQuery代码:

{% highlight javascript %}
    $('#element').fadeIn('slow', function() {
        // callback function
    });

{% endhighlight %}
这里是调用了JQuery里的fadeIn()方法，这个方法接受两个参数：
淡入的速度和一个可选的回调方法。在这个回调函数里你可以做任何你想干的事。
当fadeIn()方法执行完后，回调函数会被执行。你可以通过传入第一个参数的值来延迟回调函数的执行。


# 如何写回调函数？
如果自己在写一个方法或函数，你有可能会遇到需要一个回调函数。下面就是一个简单的常见回调函数例子：

{% highlight ruby %}
    function mySandwich(param1, param2, callback) {
        alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
        callback();
    }

    mySandwich('ham', 'cheese', function() {
        alert('Finished eating my sandwich.');
    });

{% endhighlight %}

我们有一个叫mySandwich的函数，它接受三个参数。第三个参数就是回调函数。当执行这个方法的时候，它会弹出一个对话框，然后才执行回调函数。
注意这里第三个参数是一段函数声明，这段声明在mySandwich里面被执行。这个参数就是回调函数。这个回调函数是定义在第三个参数被传入的，而且里面有一个alert来告诉这个函数被执行了。你可以看到下面这个例子，让一个函数作为传入，这使回调成为可能。例子a JSBin

# 让回调函数成为可选？

有一件事也许大家都知道，就是JQuery中的回调函数都是可选的，这就意味着如果一个方法接受回调函数，
当我们不传值给这个回调函数，它应该不会报错。但是在我们的下面例子里，如果没有传参：

{% highlight ruby %}
    function mySandwich(param1, param2, callback) {
        alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
        callback();
    }

    mySandwich('ham', 'cheese');

    控制台会报错：“undefined is not a function” 。为了让它不报错就有如下代码：
    function mySandwich(param1, param2, callback) {
        alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
        if (callback) {
            callback();
        }
    }

    mySandwich('ham', 'cheese');

{% endhighlight %}

现在我们检测了回调函数是否传入了，就不会报错了

# 让回调函数必须是一个Function？

如果你想让第三个参数无论如何都要传一个Functon，可以按下方法实现：

{% highlight ruby %}
    function mySandwich(param1, param2, callback) {
        alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
        if (callback && typeof(callback) === "function") {
            callback();
        }
    }

    mySandwich('ham', 'cheese', 'vegetables');

{% endhighlight %}

注意这里用到typeof运算符，来确保传入值是一个方法，如果不是就会抛异常

# 对于延时的注意
尽管回调函数总是最后被执行，但这不总是这样的。举个例子，如果含有回调函数里有一个异步的方法调用（AJAX or an animation）,这时候回调会在异步方法调用后执行，但也可能在异步方法返回之前返回。下面就是一个JQuery animate例子

{% highlight ruby %}
  function mySandwich(param1, param2, callback) {
      alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);

      $('#sandwich').animate({
          opacity: 0
      }, 5000, function() {
          // Animation complete.
      });

      if (callback && typeof(callback) === "function") {
          callback();
      }
  }

  mySandwich('ham', 'cheese', function() {
      alert('Finished eating my sandwich.');
  });

{% endhighlight %}

尽管回调在异步函数调用之后执行，但是在异步函数返回之前，回调函数就已经结束了。为了解决这种问题，我建议把回调
函数放入animate的回调函数里面。虽然这不能覆盖所有的方法，但是回调函数最基本的意义就在于最后执行。