<template>
    <div class="custom-select" @click.stop>
        <div class="select-box" @click="toggleDropdown">
            <div class="selected-item">
                <span class="Body2-Medium title-text">{{ selectedItem }}</span>
                <img src="@/assets/images/icon/input/Icon/Normal/Chevron Down.svg" alt="드롭다운" class="icon-img">
            </div>
            <div class="dropdown" v-if="isOpen">
                <div v-for="(option, index) in options" :key="index" @click="selectItem(option)"
                    class="dropdown-item Body2-Medium title-text">
                    {{ option }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CustomSelect",
    props: {
        options: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selectedItem: this.options.length > 0 ? this.options[0] : null,
            isOpen: false,
            isActive:false,

        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        selectItem(option) {
            event.stopPropagation();
            this.selectedItem = option;
            this.isOpen = false;  // 리스트를 닫기 위해 isOpen을 false로 설정
            this.$emit('select', option);
        }
    },
    

};
</script>

<style scoped>
.custom-select {
    position: relative;
    border: 1px solid var(--border-light-default);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    border-radius: 8px;
}

.select-box {
    cursor: pointer;
}

.selected-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dropdown {
    overflow: hidden;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-radius: 8px;
    border: 1px solid var(--border-light-default);
    background: var(--background-light-default);

}

.dropdown-item {
    padding: 12px 18px;
    cursor: pointer;
}

.dropdown-item:hover {
    background: var(--blue-100);
    color: var(--primary-normal);
}
.SelectActive{
    border: 1px solid #000;
}
</style>