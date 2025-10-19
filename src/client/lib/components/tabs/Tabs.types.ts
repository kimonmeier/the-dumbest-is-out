import type { Component } from 'svelte';

export interface TabInfo<T> {
	label: string;
	value: T;
	component: Component;
}
