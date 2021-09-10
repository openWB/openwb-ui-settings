<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
    <a class="navbar-brand" href="/">
      <span>openWB</span>
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#collapsibleNavbar"
      ref="navbarButton"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div
      class="collapse navbar-collapse"
      id="collapsibleNavbar"
      ref="collapsibleNavbar"
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active disabled">
            Home
          </router-link>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Beispiele
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link
              to="/testing"
              class="dropdown-item"
              active-class="active disabled"
            >
              Testing
            </router-link>
            <router-link
              to="/testing-store"
              class="dropdown-item"
              active-class="active disabled"
            >
              VUEX Store
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "nav-bar",
  watch: {
    $route() {
      // imitate bootstraps close behaviour
      this.$refs["collapsibleNavbar"].classList.remove("show");
      this.$refs["navbarButton"].classList.add("collapsed");
      this.$refs["navbarButton"].setAttribute("aria-expanded", false);
    },
  },
};
</script>
