<template>
	<div class="card" :class="'border-' + subtype">
		<div class="card-header" :class="'bg-' + subtype" @click="toggleBody">
			<div class="form-group mb-0">
				<div class="form-row vaRow mb-0">
					<div class="col">
						{{ title }}
					</div>
				</div>
			</div>
			<font-awesome-icon
				v-if="collapsible"
				fixed-width
				:icon="
					isCollapsed
						? ['fas', 'plus-square']
						: ['fas', 'minus-square']
				"
			/>
		</div>
		<div class="card-body" v-if="isCollapsed === false">
			<slot></slot>
		</div>
		<div v-if="$slots.footer" class="card-footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faPlusSquare as fasPlusSquare,
	faMinusSquare as fasMinusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasPlusSquare, fasMinusSquare);

export default {
	name: "Card",
	props: {
		title: { type: String, default: "# no title set #" },
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
		collapsible: { type: Boolean, default: false },
		collapsed: { type: Boolean, default: false },
	},
	data() {
		return {
			isCollapsed: this.collapsible && this.collapsed,
		};
	},
	methods: {
		toggleBody() {
			if (this.collapsible === true) {
				this.isCollapsed = !this.isCollapsed;
			}
		},
	},
	components: {
		FontAwesomeIcon,
	},
};
</script>

<style scoped>
.card {
	margin-bottom: 1rem;
}

.card .card-header {
	font-weight: bold;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.bg-primary,
.bg-secondary,
.bg-danger,
.bg-success {
	color: white;
}

.bg-warning,
.bg-info {
	color: #212529;
}

.card-header.bg-secondary .btn-outline-info:not(.active):not(:hover),
.card-header.bg-success .btn-outline-info:not(.active):not(:hover),
.card-header.bg-primary .btn-outline-info:not(.active):not(:hover) {
	background-color: white;
}

.card-header.bg-success .btn-outline-info.focus {
	box-shadow: 0 0 0 0.2rem white;
}

.card-header.bg-success .btn-outline-info.active,
.card-header.bg-success .btn-outline-info:hover {
	border-color: white;
}
</style>
