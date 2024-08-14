<template>
    <div class="filter-wrap">
        <ul>
            <li v-for="filter in FilterData" :key="filter.name">
                <router-link :to="filter.link">
                    <img :src="filter.icon" :alt="filter.name">
                    <span class="Heading2-SemiBold">{{ filter.name }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Filter',
    props: {
        FilterData: Array,
    }
}
</script>

<style>
.filter-wrap {
    position: sticky;
    top: 210px;
    width: 220px;
    box-sizing: border-box;
    padding: 24px 12px;
    border-radius: 10px;
    box-shadow: var(--shadow-emphasize);
    
    display: flex;
    flex-direction: column;
    background: var(--background-light-default);
    /* border: 1px solid var(--border-light-default); */

}

.filter-wrap>ul {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.filter-wrap>ul>li>a {
    display: flex;
    gap: 12px;
    padding: 12px 20px;
}

.filter-wrap>ul>li>a:hover {
    border-radius: 40px;
    background: var(--blue-100);
}
</style>