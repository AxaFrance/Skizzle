<script>
	import Profile from '../../components/Profile';
	import MainView from '../../components/MainView';
	import { isSidebarHidden, language, event } from '../../shared/store';

	let className = '';

	const toggleSidebar = () => {
		isSidebarHidden.update(isHidden => !isHidden);
	};

	$: className = $isSidebarHidden ? ' skz-sidebar--hidden' : '';
</script>

<style src="./Home.scss">
</style>

<div class="skz-container">
	<nav class={`skz-sidebar${className}`}>
		<Profile />
	</nav>
	<button class="skz-sidebar-overlay" on:click={toggleSidebar}>
		{language.getWord('HideMenu')}
	</button>
	<main class="skz-content">
		<MainView />
	</main>
</div>
