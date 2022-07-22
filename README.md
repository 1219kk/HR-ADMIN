## vue 的核心、优点

- 组件化 可以实现页面上功能的复用
- 数据驱动 会让代码变得简单，不用去操作 DOM，只要更新数据，视图会跟着变化
- 虚拟 dom 不用频繁操作真实的 DOM（真实 DOM 操作性能很慢） 性能会高一些

## 双向数据绑定

- 数据 -> 视图
- 视图 -> 数据

vue 中普通指令都可以实现数据变了，视图会跟着变，但是有一个特殊的指令叫 v-model,它一般用于表单控件，它可以实现双向数据绑定 ，所谓的双向数据就是数据变了，视图会跟着变，反过来也是

提到 v-model 面试官就可能会问一句 v-model 原理

```html
<input v-model="msg" />
<input v-bind:value="msg" v-on:input="msg=$event.target.value" />
<input :value="msg" @input="msg=$event.target.value" />
```

## 单向数据流 (a 能到 b a->b 反过来不行)

- 父组件通过 props 向子组件传值 我们父组件中的数据变了，子组件中 props 数据也跟着变，反过来不行
- 特殊情况：如果是引用类似数据，子组件只要不修改数据的地址，是可以在子组件中修改的（可以改属性）
- props 是只读的

## MVVM

- MVVM 是三个单词的缩写 model(数据，一般来自 ajax 或本地存储) + view(视图 template) + viewmodel(vue 实例)
- model 数据变了，视图会跟着改变，视图变了，如果用的是 v-model,数据也会跟着变，viewmodel 在中间起一个桥梁作用
  - model 和 view 就像现实中房东和租客一样，他们是不认识，通过中介
- 好处
  - 数据驱动
    - 因为数据变了，视图会跟着变，所以在 vue 中不用操作 DOM
  - 解耦（降低了耦合性）
    - 由于 model 和 view 是没有关系的，是通过 viewmodel 结合在一起的，所以维护起来很方便，因为 model 逻辑代码改了，view 不用改

## 事件传参

- @click="fn" 在回调函数直接通过参数可以拿到事件对象
- @click="fn($event)" 这个时候$event 是固定写法

## 对$event 的理解

- 在原生 DOM 原生事件中，$event 指的是事件源对象
- 在组件自定义事件，$event 代表的是子组件抛出的数据

## 自定义指令：directive

- 你平时用过自定义指令

  - v-imgerror 我们公司项目中有的用户头像可能加载报错，可以给他一张默认图片， onerror this.img=默认图片
  - v-focus 打开带有搜索的页面的时候，想实现自动把光标定位到 input 中

- 自定义指令的钩子函数
  - bind 属性绑定的时候执行 只会有一次
  - inserted 当前指令所在的元素插入到页面中的时候执行一次
  - update 当前指令所在的组件中的 data 数据有更新就会执行，可以执行多次

```js
// 指令的钩子有三个 bind inserted update
// bind inserted 只会执行一次
// update 会反复执行
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  },
});

Vue.directive("red", {
  bind(el) {
    el.style.color = "red";
  },
});

Vue.directive("check", {
  update(el) {
    const reg = /^[a-zA-Z0-9]+$/;
    if (reg.test(el.value)) {
      el.style.color = "green";
    } else {
      el.style.color = "red";
    }
  },
});
```

继承方式一共有五种，第一种是原型链继承，具体操作是将父组件的实例对象赋值给子组件的原型，然后将子组件的原型使用 constructor 指回子构造函数，但是它存在缺点，就是继承父组件属性会被所以继承的子组件共享，一个属性发生变化，其他的也变。为了解决这个问题，就得使用第二种继承方式，构造函数继承，在子构造函数里面引入父构造函数，使用 call 改变 this 的指向，这种构造函数不能继承父构造函数的方法，所以将上述的两种继承方式结合在一起产生了第三种继承方式，组合继承。组合继承的缺点在于继承后在 new 子构造函之后，会导致子构造函数和原型对象中都有继承的属性，所以为了优化这个问题就产生了第四种继承的方式--寄生组合继承，就是将组合继承中赋值给子构造函数原型的原型对象改为 Object.create（父构造函数原型）来使用，它的缺点在于使用过于繁索，因此，为了完美解决上述四种继承的问题，同时实现继承的目的，es6 引入了 extends 方法，能够完美的继承父构造函数的属性和方法。

创建一个实例对象 将他赋值给
new 新实例的原型等于父类的实例。
子类原型指向了父类实例来完成关
