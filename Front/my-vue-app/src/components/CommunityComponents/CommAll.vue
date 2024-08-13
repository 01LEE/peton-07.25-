<template>
  <div class="content-wrap">
    <div class="filter-wraper">
      <Filter :FilterData="FilterData"></Filter>
    </div>
    <div class="main-content">
      <div class="cotent-header-wrap">
        <h2 class="Title2-Bole">전체</h2>
        <div class="cotent-header-item">
          <CustomSelect :options="Options" @select="handleSelect"></CustomSelect>
          <div class="searchbar-wrap">
            <input type="text" name="searchbar" id="searchbar" placeholder="검색" class="Body2-Medium title-text" autocomplete="off">
            <button type="submit"><img src="@/assets/images/icon/searchbar/icon-search_glass-24_2.svg" alt="돋보기"></button>
          </div>
          <button @click="goPage" class="Btn Body1-Medium">글쓰기</button>
        </div>
      </div>
      <PostList></PostList>
    </div>
  </div>
</template>

<script>
import Filter from '../CommunityComponents/Filter.vue';
import FilterData from '@/assets/Data/FilterData.js';
import PostList from '@/components/Posts/PostListView.vue';
import CustomSelect from '../CustomSelect.vue';


export default {
  name: 'CommAll',
  data() {
    return {
      // isOpen: false,
      Options:['작성일 순','조회수 순'],
      FilterData: FilterData.communityFilters,
    }
  },
  components: {
    Filter,
    PostList,
    CustomSelect,
  },
  methods:{
    goPage(){
      this.$router.push('/Community/Peton/Post/Create');
    },
    handleSelect(selectedOption) {
      console.log('Selected option:', selectedOption);
    }
  }
}
</script>

<style scoped>
.content-wrap {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  width: 1280px;

}
.main-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.cotent-header-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;

}
.cotent-header-item{
  display: flex;
  gap: 10px;
}


/* 공통사용 */
#searchbar{
  padding: 12px;
  outline: none;
  border: none;
}
.searchbar-wrap{
  border: 1px solid var(--border-light-default);
  display: flex;
  /* gap: 10px; */
  padding: 0 12px;
  border-radius: 8px;
}
.searchbar-wrap>button{
  cursor: pointer;
  padding: 0 8px;
  background: none;
}
</style>