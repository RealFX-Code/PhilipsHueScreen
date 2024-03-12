<script lang="ts">
	import type IHueLightStateResponse from '$lib/types/IHueLightStateResponse';

	import { config } from '$lib/config';

	export let LightID: number;
	let lightState: IHueLightStateResponse;

	let getLightState = async (lightID: number) => {
		let reqUrl = config.bridgeBaseURL + 'api/' + config.username + '/lights/' + String(lightID);

		const res = await fetch(reqUrl).then((response) => response.text());

		return JSON.parse(await res);
	};

	let setLightOnState = async (lightID: number, lightOnState: boolean) => {
		await refreshLightState();

		let reqUrl =
			config.bridgeBaseURL + 'api/' + config.username + '/lights/' + String(lightID) + '/state';

		let req = new Request(reqUrl, {
			method: 'put',
			body: '{"on":' + lightOnState + '}'
		});

		const res = await fetch(req).then((response) => response.text());

		return JSON.parse(res);
	};

	async function refreshLightState() {
		await getLightState(LightID).then(function (value) {
			lightState = value;
		});
	}

	let initialLoadTaskDone: boolean = false;

	refreshLightState().then(function () {
		initialLoadTaskDone = true;
	});

	async function toggleButtonClicked() {
		await setLightOnState(LightID, !lightState.state.on).then(function () {
			refreshLightState();
		});
	}
</script>

{#if initialLoadTaskDone}
	<button on:click={toggleButtonClicked}>
		<p>
			{lightState.name} ({LightID}) : {lightState?.state?.on ? 'På' : 'Av'}
		</p>
	</button>
{/if}

<style>
	button {
		margin: 1vmin auto;
		width: 100%;
	}
</style>
