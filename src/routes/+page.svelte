<script lang="ts">
	import LightControl from '../components/LightControl.svelte';
	import type IHueLightGroupResponse from '$lib/types/IHueLightGroupResponse';

	import { config } from '$lib/config';
	import { onMount } from 'svelte';

	let getLightGroupsAvailable = async () => {
		let reqUrl = config.bridgeBaseURL + 'api/' + config.username;

		const res = await fetch(reqUrl).then((response) => response.text());

		return JSON.parse(await res)?.groups;
	};

	let validGroups: Array<IHueLightGroupResponse>;

	async function getAllValidGroups() {
		let _allGroups: object = await getLightGroupsAvailable();

		validGroups = [];

		for (const value of Object.entries(_allGroups)) {
			let _value: IHueLightGroupResponse = value[1];
			if (_value?.type !== 'Entertainment') {
				validGroups.push(_value);
			}
		}

		initialLightGroupsLoad = true;
	}

	let initialLightGroupsLoad = false;

	onMount(function () {
		getAllValidGroups();
	});
</script>

{#if initialLightGroupsLoad}
	<div class="lightListContainer">
		{#each validGroups as validGroup}
			<fieldset>
				<legend>
					{validGroup.name}
				</legend>
				{#each validGroup.lights as light}
					<LightControl LightID={light} />
				{/each}
			</fieldset>
		{/each}
	</div>
{/if}

<style>
	div.lightListContainer {
		width: fit-content;
	}

	fieldset > legend {
		text-align: center;
	}

	fieldset {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
