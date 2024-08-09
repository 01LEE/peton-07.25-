<template>
  <div class="">
    <div class="">
        <img src="" alt="">
    </div>
    <div class="">
        <h4>{{ PetData.name }}</h4>
        <ul>
            <li>{{ PetData.species }}</li>
            <li>{{ PetData.gender }}</li>
            <li>{{ PetData.age }} / {{ PetData.weigth }} / {{ PetData.feature }}</li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: 'petCard',
    props:{
        PetData:Array,
    }

}
</script>

<style>

</style>