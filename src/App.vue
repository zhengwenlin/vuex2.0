<template>
  <div id="app">
    <!-- <div>age: {{$store.state.age}}</div>

    <div>同步修改: <button @click="$store.commit('changeAge', 5)">同步点击</button></div>

    <div>异步修改： <button @click="$store.dispatch('changeAge', 10)">异步点击</button></div>

    <hr>
    <div>模块age: {{$store.state.a.age}}</div>
    <div>模块a： <button @click="$store.commit('changeAge', 20)">同步点击</button></div>
    <div>模块a： <button @click="$store.dispatch('changeAge', 20)">异步点击</button></div>
    <div>模块bname: {{$store.state.b.bname}}</div>
    <div>模块b： <button @click="$store.commit('changeAge', 30)">同步点击</button></div>
    <div>模块b： <button @click="$store.dispatch('changeAge', 30)">异步点击</button></div> -->
  </div>
</template>

<script>
export default {
  mounted(){
    console.log(this.$store)
  }
};
</script>
<style>
  #app{
    font-size: 20px;
  }
</style>


