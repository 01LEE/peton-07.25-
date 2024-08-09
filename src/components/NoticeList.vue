<template>
    <div class="NoticeWrap">
        <NoticeItem :NoticeData="NoticeData" v-for="NoticeData in NoticeData" :key="NoticeData"></NoticeItem>
    </div>
</template>

<script>
import NoticeItem from './NoticeItem.vue';
import NoticeData from '../assets/Data/NoticeData.js';
export default {
    name: 'NoticeList',
    data() {
        return {
            NoticeData: NoticeData,
        }
    },
    components: {
        NoticeItem,
    }
}
</script>

<style>
.NoticeWrap{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>