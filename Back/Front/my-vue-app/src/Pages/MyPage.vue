<template>
    <div class="mypage-wrap">
        <div class="user-info-wrap">
            <div class="user-profile">
                <img :src="user.img" alt="" class="user-profile-img">
                <!-- 수정 모드에서만 이미지 변경 버튼 표시 -->
                <button v-if="isEditing" @click="triggerFileInput">
                    <img src="@/assets/images/icon/Icon/ProfileEdit.svg" alt="프로필 이미지 수정">
                </button>
                <!-- 파일 입력을 위한 숨겨진 input -->
                <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
            </div>
            <div class="user-profile-content">
                <div class="info-item-text">
                    <p>기본정보</p>
                </div>
                <div class="info-item-text">
                    <p>아이디</p>
                    <p>{{ user.id }}</p>
                </div>
                <div class="info-item-text">
                    <p>닉네임</p>
                    <p v-if="!isEditing">{{ user.nickname }}</p>
                    <input v-else v-model="user.nickname" type="text" class="edit-input" />
                </div>
                <div class="info-item-text">
                    <p>소개글</p>
                    <p v-if="!isEditing">{{ user.info }}</p>
                    <input v-else v-model="user.info" type="text" class="edit-input" />
                </div>
            </div>
            <!-- "정보 수정하기" 또는 "저장하기" 버튼 -->
            <div class="">
                <button v-if="!isEditing" @click="toggleEditMode">정보 수정하기</button>
                <!-- <button v-else @click="saveChanges">저장하기</button> -->
                <div v-else>
                    <button @click="saveChanges">저장하기</button>
                    <button @click="cancelChanges">취소</button>
                </div>
            </div>

        </div>
        <div class="Pet-info-wrap">
            <PetInfo></PetInfo>
        </div>
    </div>
</template>

<script>
import PetInfo from '../components/PetInfo.vue';
export default {
    name: 'MyPage',
    data() {
        return {
            isEditing: false, // 수정 모드 상태
            user: {
                img: require('@/assets/images/cat01.png'), // 초기 프로필 이미지
                id: 'admin1',
                nickname: '시현',
                info: '배고프다'
            },
            originalUser: {} // 변경 전 사용자 정보
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click(); // 파일 입력 창 열기
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.user.img = e.target.result; // 선택된 이미지로 업데이트
                };
                reader.readAsDataURL(file);
            }
        },
        toggleEditMode() {
            if (this.isEditing) {
                this.saveChanges();
            } else {
                this.originalUser = { ...this.user }; // 원본 정보 저장
                this.isEditing = true;
            }
        },
        saveChanges() {
            this.isEditing = false;
            // 여기에서 서버로 데이터를 저장하는 로직을 추가할 수 있음
        },
        cancelChanges() {
            this.user = { ...this.originalUser }; // 원본 정보로 복원
            this.isEditing = false;
        }
    },
    components: {
        PetInfo,
    }
}
</script>

<style>
.user-info-wrap {
    display: flex;
    width: 350px;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.user-profile-content {
    width: 100%;
}

.info-item-text {
    min-height: 48px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.edit-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* user-profile */
.user-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    align-items: center;
}

.user-profile-img {
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
