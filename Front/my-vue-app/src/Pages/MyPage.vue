<template>
  <div class="mypage-wrap">
    <div class="user-info-wrap">
      <div class="mypage-user-profile">
        <div class="mypage-user-profile-img-wrap">
          <img :src="user.profile_image_url || 'default-image-url'" alt="" class="mypage-user-profile-img">
          <button v-if="isEditing" @click="triggerFileInput" class="img-change-btn">
            <img src="@/assets/images/icon/Icon/imgEdit.svg" alt="프로필 이미지 수정">
          </button>
          <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
          <button v-if="isImageChanged" @click="saveProfileImage" class="img-save-btn">이미지 저장하기</button>
        </div>
        <div class="">
          <h2 class="Heading1-SemiBold">{{ user.nick_name }}</h2>
        </div>
      </div>
      <div class="user-profile-content">
        <div class="info-item-text">
          <p class="item-label Body2-SemiBold title-text">기본정보</p>
        </div>
        <div class="info-item-text">
          <p class="item-label Body2-Medium title-text">아이디</p>
          <p class="value-text Body2-Medium sub-text">{{ user.login_id }}</p>
        </div>
        <div class="info-item-text">
          <p class="item-label Body2-Medium title-text">닉네임</p>
          <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ user.nick_name }}</p>
          <input v-else v-model="user.nick_name" type="text" class="edit-input" />
        </div>
        <div class="info-item-text">
          <p class="item-label Body2-Medium title-text">소개글</p>
          <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ user.user_intro }}</p>
          <input v-else v-model="user.user_intro" type="text" class="edit-input" />
        </div>
      </div>
      <div class="">
        <button v-if="!isEditing" @click="toggleEditMode" class="Btn Btn Body1-Medium">정보 수정하기</button>
        <div v-else class="save-btn-wrap">
          <button @click="saveChanges" class="Btn Btn Body1-Medium">저장하기</button>
          <button @click="cancelChanges" class="Btn Btn Body1-Medium">취소</button>
        </div>
      </div>
    </div>
    <div class="pet-card-container">
      <PetCard v-for="pet in pets" :key="pet"></PetCard>
      <div class="Pet-card-create-wrap" @click="pets++">
        <div class="Pet-card-create">
          <img src="/img/plus.32aef565.svg" alt="플러스">
          <p>펫 정보 추가하기</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PetCard from '@/components/PetCard.vue';
import axios from 'axios';

export default {
  name: 'MyPage',
  data() {
    return {
      isEditing: false, 
      user: {
        profile_image_url: '', 
        login_id: '',
        nick_name: '',
        user_intro: '', // 빈 문자열로 초기화
      },
      originalUser: {}, 
      pets: 0,
      isLoading: false,
      isImageChanged: false, 
    };
  },
  methods: {
    async fetchUserInfo() {
      try {
        this.isLoading = true;
        const response = await axios.get('http://localhost:3000/api/myinfo/getmyinfo');
        console.log("받아온 myinfo 부분:", response.data);

        if (response.data.success) {
          this.user = response.data.userInfo;
          this.originalUser = { ...this.user };
        } else {
          console.error("사용자 정보를 불러오지 못했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 조회 중 오류 발생:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveProfileImage() {
      try {
        this.isLoading = true;

        const formData = new FormData();
        formData.append('profileImage', this.$refs.fileInput.files[0]); 

        const response = await axios.post('http://localhost:3000/api/profile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          console.log("프로필 이미지 수정 성공:", response.data.message);
          alert('프로필 이미지가 성공적으로 수정되었습니다.');
          this.user.profile_image_url = response.data.imageUrl; 
          this.isImageChanged = false; 
        } else {
          console.error("프로필 이미지 수정 실패:", response.data.message);
        }
      } catch (error) {
        console.error("프로필 이미지 수정 중 오류 발생:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveChanges() {
      try {
        this.isLoading = true;

        const dataToSend = {
          login_id: this.user.login_id,
          nick_name: this.user.nick_name,
          user_intro: this.user.user_intro || '',  // null일 경우 빈 문자열로 대체
        };

        console.log("Sending data to server:", JSON.stringify(dataToSend, null, 2));

        const response = await axios.post('http://localhost:3000/api/myinfo/updatemyinfo', dataToSend);

        if (response.data.success) {
          console.log("정보 수정 성공:", response.data.message);
          alert('정보가 성공적으로 수정되었습니다.');
          this.isEditing = false;
          this.fetchUserInfo(); 
        } else {
          console.error("정보 수정 실패:", response.data.message);
        }
      } catch (error) {
        console.error("정보 수정 중 오류 발생:", error);
      } finally {
        this.isLoading = false;
      }
    },
    cancelChanges() {
      this.user = { ...this.originalUser }; 
      this.isEditing = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.profile_image_url = e.target.result;
          this.isImageChanged = true; 
        };
        reader.readAsDataURL(file);
      }
    },
    toggleEditMode() {
      if (this.isEditing) {
        this.saveChanges();
      } else {
        this.originalUser = { ...this.user }; 
        this.isEditing = true;
      }
    }
  },
  created() {
    this.fetchUserInfo();
  },
  components: {
    PetCard,
  }
}
</script>


<style>
.mypage-wrap {
  display: flex;
  width: 1280px;
  margin: 50px auto 140px;
  gap: 30px;
  justify-content: center;
}
.user-info-wrap {
  position: sticky;
  top: 100px;
  display: flex;
  width: 350px;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-emphasize);
  border-radius: 10px;
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
  flex: 1;
  height: 40px;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* user-profile */
.mypage-user-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  align-items: center;
}
.mypage-user-profile-img-wrap{
  position: relative;
}
.mypage-user-profile-img {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

button.img-change-btn>img {
  width: 100%;
}

.img-change-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  right: 6px;
  bottom: 6px;
  background: none;
  cursor: pointer;
  box-shadow: var(--shadow-emphasize);
}

.item-label {
  width: 120px;
}

.value-text {
  flex: 1;
  text-align: right;
  text-overflow: ellipsis;
  box-sizing: border-box;
  overflow: hidden;
}

.save-btn-wrap {
  display: flex;
  gap: 10px;
}

/* 펫정보 추가 */
.Pet-card-create-wrap {
  display: flex;
  width: 800px;
  height: 478px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-emphasize);
  cursor: pointer;
}
.Pet-card-create {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
}
</style>
