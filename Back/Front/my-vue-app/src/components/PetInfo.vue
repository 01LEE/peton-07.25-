<template>
    <div class="pet-info-wrap">
        <h2>펫 정보</h2>
        <button @click="toggleEditing">정보 수정하기</button>
        <div class="">
            <p v-if="isEditing" class="p-value">{{ petInfo.name }}</p>
            <input type="text" v-if="!isEditing" v-model="petInfo.name">
            기업의 이미지를 대변해준다
            신뢰
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isEditing:false,
            petInfo:{
                name:'견순이',
                gender: '',
                birth:''
            }
        }
    },
    methods:{
        toggleEditing(){
            this.isEditing = !this.isEditing;
            
        }
    }
}
</script>

<style>

</style>