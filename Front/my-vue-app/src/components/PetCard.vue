<template>
    <div class="pet-profile-wrap">
      <div class="pet-info-wrap">
        <div class="pet-profile">
          <div class="pet-profile-title">
            <div>
              <h3 class="Heading1-SemiBold" v-if="!pet?.pet_name">펫카드</h3>
              <h3 class="Heading1-SemiBold" v-else>{{ pet.pet_name }}</h3>
            </div>
            <div class="actions">
              <div v-if="!isEditing" class="card-btn-wrap">
                <button class="cardBtn" @click="toggleEditMode">정보 수정하기</button>
                <button class="cardBtn" @click="deletePet">삭제하기</button>
              </div>
              <div v-else class="card-btn-wrap">
                <button class="cardBtn" @click="saveChanges">저장하기</button>
                <button class="cardBtn" @click="cancelChanges">취소</button>
              </div>
            </div>
          </div>
          <div class="pet-profile-content-wrap">
            <div class="pet-profile-img-wrap">
              <div v-if="!pet.pet_image_url" class="pet-profile-img" @click="triggerFileInput">
                <div v-if="isEditing" class="img-upload-placeholder">
                  <button class="img-upload-btn" @click.prevent="triggerFileInput"> <!-- prevent 기본 동작 차단 -->
                    <img src="/img/plus.32aef565.svg" alt="플러스" />
                    <p>사진 추가</p>
                  </button>
                  <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
                </div>
                <div v-else class="img-upload-placeholder-empty"></div>
              </div>
              <div v-else class="pet-profile-img">
                <img :src="pet.pet_image_url || defaultImg" alt="Pet Image" class="pet-profile-img" />
                <button v-if="isEditing" class="img-change-btn" @click="triggerFileInput">
                  <img src="@/assets/images/icon/Icon/imgEdit.svg" alt="프로필 이미지 수정" />
                </button>
                <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
              </div>
            </div>
            <div class="pet-profile-content">
              <div class="info-item-text">
                <p class="item-label Body2-Medium title-text">이름</p>
                <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_name || '이름을 입력해주세요' }}</p>
                <input v-else v-model="pet.pet_name" type="text" placeholder="이름을 입력해주세요" class="card-edit-input"/>
              </div>
              <div class="info-item-text gender-option-wrap">
                <p class="item-label Body2-Medium title-text">성별</p>
                <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.gender ? '남아' : '여아' }}</p>
                <div v-else class="gender-options">
                  <button class="gender-Btn" :class="{ active: pet?.gender === true }" @click="pet.gender = true">남아</button>
                  <button class="gender-Btn" :class="{ active: pet?.gender === false }" @click="pet.gender = false">여아</button>
                </div>
              </div>
              <div class="info-item-text">
                <p class="item-label Body2-Medium title-text">생년월일</p>
                <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.birth_date || 'YYYY-MM-DD' }}</p>
                <input v-else v-model="pet.birth_date" type="date" class="card-edit-input"/>
              </div>
              <div class="info-item-text">
                <p class="item-label Body2-Medium title-text">견종</p>
                <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_breed || '견종을 입력해주세요' }}</p>
                <input v-else v-model="pet.pet_breed" type="text" placeholder="견종을 입력해주세요" class="card-edit-input"/>
              </div>
              <div class="info-item-text">
                <p class="item-label Body2-Medium title-text">소개글</p>
                <p v-if="!isEditing" class="value-text Body2-Medium sub-text">{{ pet?.pet_intro || '소개글을 작성해 주세요' }}</p>
                <input v-else v-model="pet.pet_intro" type="text" class="card-edit-input" placeholder="소개글을 작성해 주세요"/>
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
          pet_id: null,
          pet_name: '',
          pet_breed: '',
          pet_age: '',
          pet_intro: '',
          pet_image_url: '',
          birth_date: '',
          gender: null
        })
      }
    },
    data() {
      return {
        isEditing: false,
        editedPet: { ...this.pet },
        defaultImg: '/path/to/default/img.png'
      };
    },
    watch: {
      pet: {
        handler(newValue) {
          this.editedPet = { ...newValue };
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      toggleEditMode() {
        if (this.isEditing) {
          this.saveChanges();
        } else {
          this.editedPet = { ...this.pet };
          this.isEditing = true;
        }
      },
      async saveChanges() {
        try {
          if (!this.editedPet.pet_image_url) {
            console.error('이미지 URL이 설정되지 않았습니다.');
            return;
          }
  
          if (this.editedPet.gender === undefined) {
            this.editedPet.gender = null;
          }
  
          const dataToSend = {
            pet_id: this.editedPet.pet_id,
            pet_name: this.editedPet.pet_name,
            pet_breed: this.editedPet.pet_breed,
            pet_age: this.editedPet.birth_date,
            pet_intro: this.editedPet.pet_intro,
            pet_image_url: this.editedPet.pet_image_url,
            birth_date: this.editedPet.birth_date,
            gender: this.editedPet.gender
          };
          console.log('들어간 값: ', dataToSend);
  
          const response = await axios.post('http://localhost:3000/api/myinfo/addpet', dataToSend);
          console.log("Pet information updated successfully:", response.data);
  
        } catch (error) {
          console.error("Error updating pet information:", error);
        }
      },
      async onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('petImage', file);
          formData.append('pet_id', this.editedPet.pet_id);
  
          try {
            const response = await axios.post('http://localhost:3000/api/profile/petupload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
  
            this.editedPet.pet_image_url = response.data.imageUrl;
            console.log('업로드된 이미지 URL:', response.data.imageUrl);
  
          } catch (error) {
            console.error('파일 업로드 중 오류 발생:', error);
          }
        }
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      cancelChanges() {
        this.editedPet = { ...this.pet };
        this.isEditing = false;
      },
      deletePet() {
        this.$emit('delete-pet', this.pet.pet_id);
      }
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
  