<script setup lang="ts">
import { Calendar } from 'v-calendar';
</script>

<template>
  <div>
    <ClientOnly><Calendar /></ClientOnly>
  </div>
</template>
<script lang="ts"> 
console.log("loaded..")
</script>