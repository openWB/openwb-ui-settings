<template>
	<draggable
		class="dragArea w-100 mb-0"
		tag="ul"
		:list="list"
		:group="{ name: 'g1' }"
		item-key="id"
		handle=".handle"
	>
		<template #item="{ element }">
			<li>
				<div class="element-titel" :class="classes(element)">
					<span>
						<font-awesome-icon
							class="handle"
							fixed-width
							:icon="['fas', 'arrows-alt']"
						/>
						{{ element.name ? element.name : element.id }}
					</span>
					<!-- <span class="element-actions">
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'edit']"
							@click="elementEdit(element.id)"
						/>
						<font-awesome-icon
							fixed-width
							:icon="['fas', 'trash']"
							@click="elementDelete(element.id)"
						/>
					</span> -->
				</div>
				<openwb-nested-list v-model="element.children" />
			</li>
		</template>
	</draggable>
</template>

<script>
import draggable from "vuedraggable";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowsAlt as fasArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fasArrowsAlt);

export default {
	name: "OpenwbNestedList",
	props: {
		list: {
			type: Object,
		},
	},
	components: {
		draggable,
		FontAwesomeIcon,
	},
	methods: {
		classes(element) {
			var myClasses = "";
			if (element.id == "counter0") {
				myClasses += "grid";
			} else if (element.id.startsWith("counter")) {
				myClasses += "counter";
			} else if (element.id.startsWith("cp")) {
				myClasses += "chargepoint";
			}
			return myClasses;
		},
		// elementEdit(id) {
		// 	console.log("edit Element:", id);
		// },
		// elementDelete(id) {
		// 	console.log("delete Element:", id);
		// },
	},
};
</script>

<style scoped>
.dragArea {
	min-height: 40px;
	color: #e9ecef;
	list-style-type: none;
	border: 1px solid var(--secondary);
	border-radius: 3px;
	padding: 0px;
}

.dragArea ul {
	background-color: var(--light);
}

.dragArea li {
	position: relative;
	top: 0px;
	left: 0px;
	padding-left: 40px;
	margin: 5px;
	border: 1px solid var(--dark);
	border-radius: 3px;
	background-color: var(--dark);
}

.handle {
	float: left;
	background-position: center center;
	background-repeat: no-repeat;
	margin-left: -35px;
	margin-right: 5px;
	font-size: 1.1em;
	color: var(--light);
	cursor: pointer;
}

.element-titel {
	display: flex;
	justify-content: space-between;
	padding: 7px;
	background: var(--info);
}

.element-titel.grid {
	background-color: var(--danger);
}

.element-titel.counter {
	background-color: var(--warning);
}

.element-titel.chargepoint {
	background-color: var(--primary);
}

.element-actions {
	cursor: pointer;
}
</style>
