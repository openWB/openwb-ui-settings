<template>
  <div class="errorPage">
    <OpenwbBaseAlert subtype="danger">
      Die angeforderte Seite {{ $route.redirectedFrom ? `"${$route.redirectedFrom.fullPath}" ` : "" }} konnte nicht
      gefunden werden oder es fehlen Berechtigungen.
    </OpenwbBaseAlert>
  </div>
</template>

<script>
export default {
  name: "OpenwbErrorView",
};
</script>
