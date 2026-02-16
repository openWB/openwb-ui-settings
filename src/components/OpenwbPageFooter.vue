<template>
  <footer
    id="footer"
    class="footer bg-dark text-light font-small"
  >
    <div class="container text-center">
      <small>
        Du befindest dich hier: Einstellungen /
        {{ $route.meta.heading }}
      </small>
    </div>
  </footer>
</template>

<script>
export default {
  name: "OpenwbPageFooter",
};
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
  /* fixed height of footer */
  line-height: 30px;
  /* vertically center the text there */
  z-index: 1030;
  /* same as menu */
  box-shadow: 0 -4px 8px 4px rgba(0, 0, 0, 0.15);
}

.container {
  padding-right: 15px;
  padding-left: 15px;
}
</style>
