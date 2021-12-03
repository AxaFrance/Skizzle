<script lang="ts">
	export let color = '#000';
	export let width: '2' | '4' | '8' | '16' | '24' | '32' | '64' = '24';
	export let height: '2' | '4' | '8' | '16' | '24' | '32' | '64' = '24';
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	fill={color}
	xmlns="http://www.w3.org/2000/svg"
>
	<g id="done_24px">
		<path
			id="icon/action/done_24px"
			d="M8.79995 15.9L4.59995 11.7L3.19995 13.1L8.79995 18.7L20.8 6.7L19.4 5.3L8.79995 15.9Z"
		/>
	</g>
</svg>
