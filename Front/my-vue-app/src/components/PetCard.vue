<template>
  <div class="pet-profile-wrap">
    <div class="pet-info-wrap">
      <div class="pet-profile">
        <div class="pet-profile-title">
          <div>
            <h3 class="Heading1-SemiBold" v-if="isAddingNewPet">새 펫 추가하기</h3>
            <h3 class="Heading1-SemiBold" v-else>{{ pet.pet_name }}</h3>
          </div>
          <div class="actions">
            <div v-if="!isEditing" class="card-btn-wrap">
              <button class="cardBtn" @click="toggleEditMode">{{ isAddingNewPet ? '새 펫 추가' : '정보 수정하기' }}</button>
              <button v-if="!isAddingNewPet" class="cardBtn" @click="deletePet">삭제하기</button>
            </div>
            <div v-else class="card-btn-wrap">
              <button class="cardBtn" @click="saveChanges">{{ isAddingNewPet ? '추가하기' : '저장하기' }}</button>
              <button class="cardBtn" @click="cancelChanges">취소</button>
            </div>
          </div>
        </div>
        <div class="pet-profile-content-wrap">
          <div class="pet-profile-img-wrap">
            <div v-if="!pet.pet_image_url" class="pet-profile-img" @click="triggerFileInput">
              <div v-if="isEditing" class="img-upload-placeholder">
                <button class="img-upload-btn">
                  <p>+</p>
                  <p>사진 추가</p>
                </button>
                <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
              </div>
              <div v-else class="img-upload-placeholder-empty"></div>
            </div>
            <div v-else class="pet-profile-img" @click="triggerFileInput">
              <img :src="pet.pet_image_url || defaultImg" alt="Pet Image" class="pet-profile-img" />
              <button v-if="isEditing" class="img-change-btn" @click.stop="triggerFileInput">
                <img src="@/assets/images/icon/Icon/imgEdit.svg" alt="프로필 이미지 수정" />
              </button>
              <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
            </div>
          </div>
          <div class="pet-profile-content">
            <div class="info-item-text">
              <p class="item-label Body2-Medium title-text">이름</p>
              <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_name || '이름을 입력해주세요' }}</p>
              <input v-else v-model="editedPet.pet_name" type="text" placeholder="이름을 입력해주세요" class="card-edit-input" />
            </div>
            <div class="info-item-text gender-option-wrap">
              <p class="item-label Body2-Medium title-text">성별</p>
              <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.gender ? '남아' : '여아' }}</p>
              <div v-else class="gender-options">
                <button class="gender-Btn" :class="{ active: editedPet.gender === true }" @click="editedPet.gender = true">남아</button>
                <button class="gender-Btn" :class="{ active: editedPet.gender === false }" @click="editedPet.gender = false">여아</button>
              </div>
            </div>
            <div class="info-item-text">
              <p class="item-label Body2-Medium title-text">생년월일</p>
              <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.birth_date || 'YYYY-MM-DD' }}</p>
              <input v-else v-model="editedPet.birth_date" type="date" class="card-edit-input" />
            </div>
            <div class="info-item-text">
              <p class="item-label Body2-Medium title-text">견종</p>
              <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_breed || '견종을 입력해주세요' }}</p>
              <input v-else v-model="editedPet.pet_breed" type="text" placeholder="견종을 입력해주세요" class="card-edit-input" />
            </div>
            <div class="info-item-text">
              <p class="item-label Body2-Medium title-text">소개글</p>
              <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_intro || '소개글을 작성해 주세요' }}</p>
              <input v-else v-model="editedPet.pet_intro" type="text" class="card-edit-input" placeholder="소개글을 작성해 주세요" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    pet: {
      type: Object,
      required: true,
      default: () => ({
        pet_name: '',
        pet_breed: '',
        pet_intro: '',
        pet_image_url: '',
        birth_date: '',
        gender: null,
      }),
    },
  },
  data() {
    return {
      isEditing: false,
      isAddingNewPet: !('pet_id' in this.pet),  // pet_id가 없으면 새 펫 추가 모드
      editedPet: { ...this.pet },
      defaultImg: '/path/to/default/img.png',
    };
  },
  watch: {
    pet: {
      handler(newValue) {
        this.editedPet = { ...newValue };
        this.isAddingNewPet = !('pet_id' in newValue);  // pet_id가 없으면 새 펫 추가 모드
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    toggleEditMode() {
      this.isEditing = !this.isEditing;

      if (!this.isEditing) {
        this.editedPet = { ...this.pet };
        this.isAddingNewPet = !('pet_id' in this.pet);  // 모드 갱신
      }
    },
    async saveChanges() {
      if (this.isAddingNewPet) {
        await this.addPet();
      } else {
        await this.updatePet();
      }
    },
    async addPet() {
      try {
        const response = await axios.post('http://localhost:3000/api/myinfo/addpet', this.editedPet);
        console.log("Pet added successfully:", response.data);

        this.$emit('update-pet', response.data);  // 추가된 펫 데이터 반영
        this.isEditing = false;
        this.isAddingNewPet = false;

      } catch (error) {
        console.error("Error adding pet information:", error);
      }
    },
    async updatePet() {
      try {
        const response = await axios.post(`http://localhost:3000/api/myinfo/pet/${this.pet.pet_id}`, this.editedPet);
        console.log("Pet information updated successfully:", response.data);

        this.$emit('update-pet', this.editedPet);  // 수정된 펫 데이터 반영
        this.isEditing = false;

      } catch (error) {
        console.error("Error updating pet information:", error);
      }
    },
    cancelChanges() {
      this.editedPet = { ...this.pet };
      this.isEditing = false;
      this.isAddingNewPet = !('pet_id' in this.pet);  // 상태 갱신
    },
    triggerFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      }
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('petImage', file);

        if ('pet_id' in this.pet) {
          formData.append('pet_id', this.pet.pet_id);  // 수정 모드일 때만 pet_id를 전송
          console.log("Sending pet_id:", this.pet.pet_id);  // 디버깅용 로그
        } else {
          console.error('pet_id가 없습니다.');
          return;
        }

        try {
          const response = await axios.post('http://localhost:3000/api/profile/petupload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // 서버 응답에서 imageUrl이 존재하는지 확인
          if (response.data.success && response.data.imageUrl) {
            this.editedPet.pet_image_url = response.data.imageUrl;
            console.log('업로드된 이미지 URL:', response.data.imageUrl);
          } else {
            console.error('이미지 URL이 서버 응답에 포함되지 않았습니다.');
          }
        } catch (error) {
          console.error('파일 업로드 중 오류 발생:', error);
          console.log("에러 응답 데이터:", error.response?.data);  // 서버에서 반환된 에러 메시지 확인
        }
      }
    },
    async deletePet() {
  try {
    const response = await axios.post(`http://localhost:3000/api/myinfo/deletepet/${this.pet.pet_id}`);
    if (response.data.success) {
      alert(response.data.message);
      // 추가적인 작업을 여기에 추가할 수 있습니다 (예: 페이지 리로드, 데이터 업데이트 등)
    } else {
      alert('삭제 중 오류가 발생했습니다: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error deleting pet:', error);
    alert('서버와의 통신 중 오류가 발생했습니다.');
  }
},

  }
};
</script>

<style scoped>
  .pet-profile-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 20px 30px 45px;
    box-shadow: var(--shadow-emphasize);
    border-radius: 10px;
    background: var(--background-light-default);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  
  .pet-profile {
    width: 100%;
    text-align: left;
  }
  
  .pet-profile-img-wrap {
    width: 240px;
    height: 240px;
    position: relative;
    display: flex;
    justify-content: center;
  }
  
  .pet-profile-title {
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light-default);
    margin-bottom: 30px;
  }
  
  .pet-profile-content-wrap {
    display: flex;
    gap: 30px;
  }
  .pet-profile-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 20px;
  }
  .pet-profile-img {
    width: 240px;
    height: 240px;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .img-upload-placeholder,
  .img-upload-placeholder-empty {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 1px solid var(--border-light-default);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .img-upload-placeholder {
    cursor: pointer;
  }
  
  .img-upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
  }
  .card-edit-input{
    flex: 1;
    height: 48px;
    box-sizing: border-box;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .img-change-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .info-item-text label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .gender-option-wrap{
    justify-content: left;
  }
  .gender-options {
    flex: 1;
    display: flex;
    gap: 10px;
  }
  .gender-Btn{
    flex: 1;
    height: 48px;
    border-radius: 8px;
    background: var(--text-light-disable);
    color: var(--text-light-info);
  }
  
  .gender-options .active {
    background: var(--primary-normal);
    color: var(--text-light-reverse);
  }
  
  .actions {
    display: flex;
    justify-content: right;
    gap: 10px;
  }
  
  .card-btn-wrap {
    display: flex;
    gap: 6px;
  }
  .cardBtn {
    padding: 7px 10px;
    background: var(--background-light-default);
    color: var(--text-light-default);
    border: 1px solid var(--border-light-default);
    border-radius: 4px;
  }
  
  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 24px;
    color: #333;
  }
</style>
