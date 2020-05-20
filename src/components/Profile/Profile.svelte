<script>
    import { onMount } from 'svelte';
    import Modal from '../Modal';
    import Projects from '../Projects';
    import Settings from '../Settings';
    import Loader from '../Loader';
    import { profile, organizations, isFetchingProfile, isSidebarHidden, theme } from '../../shared/store';
    import { getProfile } from '../../shared/requester';
    import { addItem } from '../../shared/storage';
    
    let currentTabIndex = 1;
    let projects = [];

    const onTabChange = (index) => {
        currentTabIndex = index
    }

    onMount(() => {
        if(!$profile) {
            getProfile()
        }
    })

    organizations.subscribe(organizationsList => {
        projects = organizationsList.reduce((acc, cur) => {
            if(cur.checked) {
                acc.push(cur);
            }
            return acc;
        }, [])
    })

    const getSelectedOrganizationProjects = (acc, curr) => {
        if(curr.checked) {
            acc.push(...curr.projects)
        }
        return acc;
    }

    $:projects = $organizations
        .reduce(getSelectedOrganizationProjects, [])
        .sort((a, b) => (a.name > b.name) ? 1 : -1);

    const toggleSidebar = () => {
        isSidebarHidden.update(isHidden => !isHidden)
    }

    const setFocus = (e, index) => {
        currentTabIndex = index;
        document.getElementById(e.detail).focus();
    }
</script>

<style src="./Profile.scss"></style>

<div class="skz-profile">
    {#if !$profile || $isFetchingProfile}
        <Loader/>
    {:else}
        <div class="skz-avatar__gradient skz-avatar__gradient--{$theme}"></div>
        <div class="skz-avatar">
            {#await $profile.avatar}
            <img
                class="skz-avatar__image"
                alt={$profile.displayName}
                src="./assets/user.svg"
            />
            {:then avatar}
                <img 
                    class="skz-avatar__image" 
                    alt={$profile.displayName} 
                    src="data:image/jpeg;base64,{avatar.value}" />
            {:catch error}
            <img
                class="skz-avatar__image"
                alt={$profile.displayName}
                src="./assets/user.svg"
            />
            {/await}
            <button class="skz-profile-toggle" on:click={toggleSidebar}>Menu</button>
        </div>
        <p class="skz-profile-name">{$profile.displayName}</p>
        <nav class="skz-profile-nav skz-profile-nav--{currentTabIndex}">
        <button on:click={() => onTabChange(1)} class="skz-profile-nav__item skz-profile-nav__item--projects">Projets</button>
        <button on:click={() => onTabChange(2)} class="skz-profile-nav__item skz-profile-nav__item--settings">Réglages</button>
        <span class="skz-profile-nav__indicator"></span>
        </nav>
        <div class="skz-profile-content skz-profile-content--{currentTabIndex}">
            <div class="skz-profile-content__item">
                <Projects projects={projects} on:focus={e => setFocus(e, 1)} />
            </div>
            <div class="skz-profile-content__item">
                <Settings />
            </div>
        </div>
    {/if}
</div>