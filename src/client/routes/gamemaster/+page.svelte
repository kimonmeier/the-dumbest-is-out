<script lang="ts">
	import GameMasterGameTab from '@client/lib/components/gamemaster/GameMasterGameTab.svelte';
	import GameMasterPlayerTab from '@client/lib/components/gamemaster/GameMasterPlayerTab.svelte';
	import { GameMasterTabs } from '@client/lib/components/gamemaster/GameMasterTabs';
	import Tabs from '@client/lib/components/tabs/Tabs.svelte';
	import type { TabInfo } from '@client/lib/components/tabs/Tabs.types';

	let tabs: TabInfo<GameMasterTabs>[] = [
		{
			label: 'Spieler',
			value: GameMasterTabs.Player,
			component: GameMasterPlayerTab
		},
		{
			label: 'Game',
			value: GameMasterTabs.Game,
			component: GameMasterGameTab
		}
	];
</script>

<Tabs items={tabs} activeTabValue={GameMasterTabs.Player}></Tabs>
