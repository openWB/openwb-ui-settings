<template>
	<teleport to="body">
		<div :class="modalClasses" role="dialog" @click="handleClick">
			<div
				class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
				role="document"
			>
				<div class="modal-content">
					<!-- modal header -->
					<div class="modal-header" :class="'bg-' + subtype">
						<h4 class="modal-title">{{ title }}</h4>
						<button
							v-if="!preventClose"
							type="button"
							class="close"
							@click="handleClick"
						>
							&times;
						</button>
					</div>
					<!-- modal body -->
					<div class="modal-body">
						<slot># Body #</slot>
					</div>
					<!-- modal footer -->
					<div
						v-if="myButtons.length > 0"
						class="modal-footer d-flex"
						:class="'justify-content-' + footerAlignment"
					>
						<button
							v-for="button in myButtons"
							:key="button.text"
							type="button"
							class="btn"
							:class="
								button.subtype
									? 'btn-' + button.subtype
									: 'btn-secondary'
							"
							data-dismiss="modal"
							:data-event="button.event ? button.event : 'close'"
							@click="handleClick"
						>
							{{ button.text }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script>
export default {
	name: "modal-dialog",
	emits: ["modal-result"],
	props: {
		title: String,
		subtype: {
			validator: function (value) {
				return (
					[
						"info",
						"success",
						"warning",
						"danger",
						"primary",
						"secondary",
						"light",
						"dark",
					].indexOf(value) !== -1
				);
			},
			default: "secondary",
		},
		buttons: undefined,
		footerAlignment: {
			validator: function (value) {
				return (
					["around", "between", "center", "end", "start"].indexOf(
						value
					) !== -1
				);
			},
			default: "end",
		},
		preventClose: { type: Boolean, default: false },
		show: { type: Boolean, default: false },
	},
	computed: {
		modalClasses() {
			let classes = ["modal", "fade"];
			if (this.show) {
				classes.push("d-block", "show");
			}
			return classes;
		},
		myButtons() {
			var buttons = [];
			if (this.buttons !== undefined) {
				buttons = this.buttons;
			}
			if (!this.preventClose) {
				buttons.push({ text: "Schließen", event: "close" });
			}
			return buttons;
		},
	},
	watch: {
		show(newState) {
			if (newState === true) {
				// show backdrop
				let backdrop = document.createElement("div");
				backdrop.classList = "modal-backdrop fade show";
				document.body.appendChild(backdrop);
			} else {
				// hide backdrop
				let backdrop = document.querySelector(".modal-backdrop");
				document.body.removeChild(backdrop);
			}
		},
	},
	methods: {
		handleClick(event) {
			// console.log(event);
			event.stopPropagation();
			let data = event.target.getAttribute("data-event");
			if (data === null) {
				data = "close";
			}
			if (data != "close" || !this.preventClose) {
				this.$emit("modal-result", data);
			}
		},
	},
};
</script>
