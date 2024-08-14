<template>
  <div class="ErrorPage-wrap">
    <h2>페이지를 찾을 수 없습니다</h2>
    <img src="@/assets/images/icon/search.svg" alt="" class="icon-img">
    <p>죄송합니다. 에러가 발생하였습니다.<br>잠시 후 다시 시도해주세요.</p>
    <button class="Btn" @click="goMainPage">메인페이지로 되돌아가기</button>
  </div>
</template>

<script>
export default {
    name: 'ErrorPage',
    methods:{
        goMainPage(){
            this.$router.push('/');
        }
    }
}
</script>

<style>
    .ErrorPage-wrap{
        width: 1280px;
        height: 70vh;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;    
        gap: 40px;
    }
</style>