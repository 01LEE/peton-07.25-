<template>
    <div class="">
        <PetCard v-for="PetData in PetData" :key="PetData" :PetData="PetData"></PetCard>
    </div>
</template>

<script>
import PetData from '../assets/Data/PetData';
import PetCard from './PetCard.vue';
export default {
    name:'PetList',
    data(){
        return{
            PetData: PetData,
        }
    },
    components:{
        PetCard,
    }
}
</script>

<style>

</style>