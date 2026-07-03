<template>
  <div class="avatar">
    <slot>?</slot>
  </div>
</template>

<script>
export default {
  name: "OpenwbAvatar",
};
</script>

<style scoped>
.avatar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.1em;
  height: 2.1em;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
}
</style>
