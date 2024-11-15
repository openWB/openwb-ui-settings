<template>
  <div class="mt-3 alert alert-dark text-center">
    Open Source made with love!<br />
    Jede Spende hilft die Weiterentwicklung von openWB voranzutreiben<br />
    <form
      action="https://www.paypal.com/cgi-bin/webscr"
      method="post"
      target="_blank"
    >
      <input
        type="hidden"
        name="cmd"
        value="_s-xclick"
      />
      <input
        type="hidden"
        name="hosted_button_id"
        value="2K8C4Y2JTGH7U"
      />
      <button
        type="submit"
        class="btn btn-primary"
      >
        Spenden
        <font-awesome-icon :icon="['fab', 'paypal']" />
      </button>
    </form>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPaypal);

export default {
  name: "OpenwbDonationBanner",
  components: {
    FontAwesomeIcon,
  },
};
</script>
