<template>
<div>
    <h1>template page</h1>
    <p>ksdksjdksjdksjkdjskdjdlskdlskdls</p>
    <Calendar></Calendar>
</div>
</template>

<script>
import Calendar from '../components/calendar.vue'

export default {
  name: "IndexPage",
  components : {
    Calendar
  },
  async mounted(){
    const { data } = await $fetch('/api/hello/getInfo?category=APT');
    alert(data);
  }
};
</script>

<style scoped>

</style>