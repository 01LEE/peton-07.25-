<template>
    <div class="Notice">
        <h4 class="Heading1-Medium">{{ NoticeData.title }}</h4>
        <p class="Heading2-Medium sub-text">{{ NoticeData.date }}</p>
    </div>
</template>

<script>
export default {
    name: 'NoticeItem',
    props:{
        NoticeData:Array,
    },
}
</script>

<style scope>
.Notice{
    background-color: var(--background-light-default);
    padding: 22px 30px;
    display: flex;
    border-radius: 8px;
    justify-content: space-between;
}
</style>