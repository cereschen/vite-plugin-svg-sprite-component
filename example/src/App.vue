<template>
  <div id="app">
    <svg-icon class="icon" :icon-class="iconClass"></svg-icon>
    <svg-icon class="icon" :icon-class="iconClass"></svg-icon>
    <div style="margin:30px;">svg symbol:</div>
    <div>
      <svg-icon class="icon" icon-class="form"></svg-icon>
      <svg-icon class="icon" icon-class="link"></svg-icon>
      <svg-icon class="icon" icon-class="example"></svg-icon>
      <svg-icon class="icon" icon-class="dashboard"></svg-icon>
      <svg-icon class="icon" icon-class="nested"></svg-icon>
      <svg-icon class="icon" icon-class="password"></svg-icon>
      <svg style="width: 50px;height: 50px;margin-left: 50px;">
        <use xlink:href="#icon-user" />
      </svg>
      <div style="margin:30px;">components:</div>
      <div>
        <IconTable fill="green" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { IconTable } from "/@/icons/svg/table.svg"
export default {
  name: 'App',
  components: { IconTable },
  setup() {
    const iconClass = ref('eye')

    setTimeout(() => {
      iconClass.value = 'eye-open'
    }, 2000);

    return { iconClass }
  }

}
</script>


<style>
.icon {
  color: rebeccapurple;
  font-size: 50px;
  margin-left: 30px;
}
</style>
