<template>
    <div class="content-wrap">
        <Filter :FilterData="FilterData"></Filter>
        <div class="cotent-title">
            <h2 class="content-title Title2-Bole">전체</h2>
        </div>
        <div>
      <label for="city">시/도 선택:</label>
      <select id="city" v-model="selectedCity" @change="updateDistricts">
        <option v-for="city in cities" :key="city.name" :value="city.name">
          {{ city.name }}
        </option>
      </select>
  
      <label for="district">구 선택:</label>
      <select id="district" v-model="selectedDistrict" @change="updateTowns">
        <option v-for="district in districts" :key="district.name" :value="district.name">
          {{ district.name }}
        </option>
      </select>
  
      <label for="town">동 선택:</label>
      <select id="town" v-model="selectedTown">
        <option v-for="town in towns" :key="town" :value="town">
          {{ town }}
        </option>
      </select>
    </div>
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
            FilterData: FilterData.gatheringFilters,
            cities: [
          { name: '서울특별시', districts: [
            { name: '강남구', towns: ['도곡동', '삼성동', '역삼동'] },
            { name: '서초구', towns: ['서초동', '양재동', '반포동'] }
          ]},
          { name: '부산광역시', districts: [
            { name: '해운대구', towns: ['우동', '중동', '좌동'] },
            { name: '사하구', towns: ['하단동', '감천동', '괴정동'] }
          ]}
        ],
        selectedCity: '',
        selectedDistrict: '',
        selectedTown: '',
        districts: [],
        towns: []
        }
    },
    components: {
        Filter,
        PostListViewVue,
    },
    methods:{
        updateDistricts() {
        const city = this.cities.find(c => c.name === this.selectedCity);
        this.districts = city ? city.districts : [];
        this.selectedDistrict = '';
        this.towns = [];
        this.selectedTown = '';
      },
      updateTowns() {
        const district = this.districts.find(d => d.name === this.selectedDistrict);
        this.towns = district ? district.towns : [];
        this.selectedTown = '';
      }
    },
    mounted() {
      if (this.cities.length > 0) {
        this.selectedCity = this.cities[0].name;
        this.updateDistricts();
      }
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