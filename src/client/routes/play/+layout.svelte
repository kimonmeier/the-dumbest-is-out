<script lang="ts">
	import SettingsModal from '@client/lib/components/settings/SettingsModal.svelte';
	import Icon from '@iconify/svelte';

	let steuerungVisible = $state(false);

	let { children } = $props();
</script>

<button
	class="absolute z-0 w-12 h-12 top-0 left-0 hover:text-white text-transparent"
	onclick={() => (steuerungVisible = !steuerungVisible)}
>
	<Icon icon="mdi:cog" height="100%"></Icon>
</button>
<SettingsModal bind:showModal={steuerungVisible} />

{@render children?.()}
