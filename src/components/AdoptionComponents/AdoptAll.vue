<template>
    <div class="content-wrap">
        <Filter :FilterData="FilterData"></Filter>
        <div class="cotent-title">
            <h2 class="content-title Title2-Bole">전체</h2>
        </div>
        <!-- <div class="ListHeader">
            <select name="" id="">
                <option value="작성일 순"></option>
                <option value="조회수 순"></option>
            </select>
        </div> -->
        <PostListView></PostListView>
    </div>
</template>

<script>
import Filter from '../CommunityComponents/Filter.vue';
import FilterData from '@/assets/Data/FilterData.js';
import PostListViewVue from '../Posts/PostListView.vue';
export default {
    name: 'CommAll',
    data() {
        return {
            FilterData: FilterData.adoptionFilters,
        }
    },
    components: {
        Filter,
        PostListViewVue,
    }
}
</script>

<style scoped>
.content-wrap {
    display: flex;
    gap: 30px;
    width: 1030px;

}
</style>