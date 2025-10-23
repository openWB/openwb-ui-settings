<template>
  <div class="w-100">
    <div class="form-row align-items-center">
      <div class="col-10">
        <div class="form-row">
          <div class="col-6">
            <slot name="start"></slot>
          </div>
          <div class="col-6">
            <slot name="end"></slot>
          </div>
        </div>
      </div>
      <div class="col-2 text-right">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeRow",
};
</script>
