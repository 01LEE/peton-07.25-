<template>
  <div class="PostForm">
      <div class="PostTitle">
          <h2 class="Title2-Bold title-text">글 수정</h2>
      </div>
      <form @submit.prevent="onSubmit">
          <div class="PostCategory-wrap">
              <h3 class="title-text Heading1-SemiBold">게시판</h3>
              <CustomSelect :options="options" v-model="selectedCategory"></CustomSelect>
          </div>
          <div class="PostTitle-wrap">
              <h3 class="title-text Heading1-SemiBold">제목</h3>
              <input type="text" name="PostTitle" id="PostTitle" placeholder="제목을 입력해 주세요" autocomplete="off"
              class="Body1-Medium" v-model="postTitle">
          </div>
          <div class="PostContent-wrap">
              <h3 class="title-text Heading1-SemiBold">내용</h3>
              <textarea id="PostContent" cols="30" rows="10"
              placeholder="특정인 또는 특정 기업명을 포함한 비방글 작성 시 명예훼손 등 법적인 처벌을 받을 수 있으며 모든 법적 책임은 작성자에게 있습니다. 바이러스 및 개인정보(주민등록번호, 여권 번호, 운전면허번호 등)가 포함된 이미지는 사전 안내 없이 삭제 또는 수정될 수 있습니다."
              class="Body1-Medium" v-model="postContent"></textarea>
          </div>
          <div class="PostImage-wrap">
              <h3 class="title-text Heading1-SemiBold">이미지</h3>
              <div class="PostImage">
                  <label for="UploadFile" class="image-upload-label"><img src="@/assets/images/icon/plus.svg"
                          alt="플러스"></label>
                  <input type="file" id="UploadFile">
                  <span class="UploadInfo Body1-Medium"><img src="@/assets/images/icon/Circle Exclamation.svg" alt="알림">이미지는 최대 5개, 400KB 이하의 GIF, JPEG, JPG 파일만 등록이 가능합니다.</span>
              </div>
          </div>
          <div class="PostFormBtn">
              <button @click="goBack" class="Btn Cancel Body1-Medium">취소</button>
              <button type="submit" class="Btn Body1-Medium">등록</button>
          </div>
      </form>
  </div>
</template>

<script>
import axios from 'axios';
import CustomSelect from '../CustomSelect.vue';

export default {
  name: 'PostForm',
  data() {
    return {
      postTitle: '',
      postContent: '',
      selectedCategory: '자유게시판', // default value
      options: ['자유게시판', 'BEST 인기글', '익명게시판', '건강 상담', '이벤트', '공지사항'],
      postId: null, // store post ID
    };
  },
  components: {
    CustomSelect,
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'PostDetail', params: { postId: this.postId } });
    },
    onSubmit() {
      axios.put(`http://localhost:3000/api/notice/edit/${this.postId}`, {
        title: this.postTitle,
        description: this.postContent
      })
      .then(response => {
        console.log('게시물 수정 성공:', response.data);
        this.goBack();
      })
      .catch(error => {
        console.error('게시물 수정 중 에러 발생:', error);
      });
    }
  },
  created() {
    const postId = this.$route.params.id;
    this.postId = postId;
    
    axios.get(`http://localhost:3000/api/notice/${postId}`)
      .then(response => {
        const data = response.data.post;
        this.postTitle = data.title;
        this.postContent = data.description;
      })
      .catch(error => {
        console.error('게시물 데이터 가져오기 오류:', error);
      });
  }
}
</script>

<style>
.PostForm {
  width: 1030px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.PostTitle {
  display: flex;
  padding: 24px;
  align-items: center;
  border-bottom: 1px solid var(--neutral-0);
  gap: 20px;
}

.PostCategory-wrap,
.PostTitle-wrap,
.PostContent-wrap,
.PostImage-wrap {
  display: flex;
  padding: 24px;
  align-items: center;
  border-bottom: 1px solid var(--background-light-alternative);
  gap: 20px;
}
.PostForm>div>h3 {
  width: 160px;
  margin: 0;
}

#PostTitle {
  padding: 12px;
}

#PostTitle,
#PostContent {
  flex: 1;
  border: 1px solid var(--border-light-default);
  outline: none;
  padding: 12px;
  border-radius: 8px;
}

#PostContent {
  height: 240px;
  resize: none;
}

#PostTitle::placeholder,
#PostContent::placeholder {
  color: var(--text-light-assistive);
}

input[type="file"] {
  border: none;
}

.PostFormBtn {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.Cancel {
  background: var(--neutral-99);
  color: var(--text-light-info);
}

.PostImage {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input[type="file"] {
  display: none;
}

.image-upload {
  display: flex;
  align-items: center;
}

.image-upload-label {
  display: flex;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--border-light-default);
  border-radius: 8px;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  background: var(--background-light-default);
}
.image-upload-label>img{
  display: block;
  width: 24px;
}
.image-upload-info {
  margin-left: 20px;
  color: var(--text-light-assistive);
}
.UploadInfo{
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  color: var(--text-light-assistive);
}
</style>