---
layout: post
title: Guava带Java飞
description: Google出品的Guava给冗余的Java带来一些函数式的清风
categories: [后端]
tags: [Java]

---
<br/>

Guava的前身是Google Collections，是Google开发出的一个开源Java常用类库，包含了一些集合的便捷操作API。本文通过一些常用的例子来剖析Guava的奇妙之处。

Guava是如何简化Java的for循环的呢，直接上一段例子来说明:

如果想要将一个字符数组中字符的元素剔除并且用逗号隔开，原始做法：

{% highlight java %}
    for(int i = 0; i < array.length; i++){
        if(array[i] != null){
           result.append(array[i]).append(',');
       }
    }

{% endhighlight %}

Guava类库极度简化次操作，以一种函数式编程思想链式的调用方法简化了实现

{% highlight java %}
    String s = Joiner.on(“,”).skipNulls().join(array);
{% endhighlight %}

Guava还有比着这强大的功能，闲话少说，下面介绍三种项目常用简化for循环的用法：

{% highlight java %}
     private List<Dog> dogs = ImmutableList.of(
                new Dog("Jeff", 0.6f, MALE, new DateTime(2013, 9, 1, 0, 0, 0, 0)),
                new Dog("Vivian", 1f, FEMALE, new DateTime(2013, 1, 2, 0, 0, 0, 0)));//初始化数据
{% endhighlight %}
<br/>

1.将一个集合元素的某一个或多个字段组成一个新的集合：
{% highlight java %}
     public Collection getNameList {
             return Collections2.transform(dogs, new Function<Dog, String>() {
                 @Override
                 public String apply(Dog dog) {
                     return dog.getName();
                 }
             });
         }
{% endhighlight %}
用法：可以将集合里的每个对象拿出来对其进行操作，并将操作结果作为新集合的元素，返回产生的新集合。

<br/>

2.筛选出集合中满足某些属性的对象
{% highlight java %}
    public Collection applyAge(final float from, final float to) {
            return Collections2.filter(dogs, new Predicate<Dog>() {
                @Override
                public boolean apply(Dog dog) {
                    return dog.getAge() > from && dog.getAge() < to;
                }
            });

        }
{% endhighlight %}
用法：在集合中找出满足某个条件的所有元素，返回一个满足条件的新集合

<br/>

3.在集合中找到一个满足条件的对象

{% highlight java %}
    public Object getBirthdayApplyMonthDog(final int month) {
            Optional<Dog> optional = Iterables.tryFind(dogs, new Predicate<Dog>() {
                @Override
                public boolean apply(Dog dog) {
                    return dog.getBirthday().getMonthOfYear() == month;
                }
            });
            if (optional.isPresent()) {
                return optional;
            } else {
                return "not found";
            }
        }
{% endhighlight %}
用法：在集合中找到第一个满足条件的元素，并且返回一个被Optional封装的对象，Optional对象可以避免开发人员没有判断是否为null而产生的空指针异常,是Guava提供用来包装任何对象的对象。

<br/>

4.在2和3的实例中，tryFind和filter方法都需要传一个Predicate的对象，这个对象是用来判断哪些符合条件的一个借口，需要自己实现，与此同时，Guava也提供了能够让多个条件并列或者同时满足的条件组合方法
{% highlight java %}
    public Object getFirstDogAppluAgeAndGender(float age, String gender) {
            Optional<Dog> optional = Iterables.tryFind(dogs, and(getApplyAge(age), applyGenderDog(gender)));
            if(optional.isPresent()) {
                return optional.get();
            }
            return Optional.absent();
        }

        private Predicate<Dog> getApplyAge(final float age) {
            return new Predicate<Dog>() {
                @Override
                public boolean apply(Dog dog) {
                    return dog.getAge() > age;
                }
            };
        }
{% endhighlight %}
用法：提供了 and（or）方法来组合一个判断条件，丰富了tryFind和filter的判断条件逻辑。

<br/>

总而言之，Guava给for循环带来了飞跃性的改进，让糟糕的for与if,else的冗余组合变得简单易懂，让代码变得更优美，可读性更高，确实值得所有java开发者的学习和亲睐。