<template>
  <div class="PostDetail-wrap">
    <div class="PostDetail-container">
      <div class="post-category">
        <span class="Caption-SemiBold">{{ postData.category }}</span>
      </div>
      <div class="post-title">
        <h2 class="Title3-Bold">{{ postData.title }}</h2>
      </div>
      <div class="post-info">
        <div class="user-profile">
          <div class="user-avatar">
            <img :src="postData.author.avatar" alt="User Avatar" class="icon-img" />
          </div>
          <div class="user-name">
            <div class="Body1-Medium title-text">{{ postData.author.name }}</div>
            <div class="Caption-Ragular info-text">{{ postData.author.time }}</div>
          </div>
        </div>
        <div class="post-stats">
          <ul>
            <li>
              <img src="@/assets/images/icon/Icon/Normal/Eye.svg" alt="조회수">
              <p class="Body2-Medium">{{ postData.views }}</p>
            </li>
            <li>
              <img src="@/assets/images/icon/Icon/Normal/Like.svg" alt="좋아요">
              <!-- <p class="Body2-Medium">{{ postData.likes }}</p> -->
              <p class="Body2-Medium">{{ postData.likes }}</p>
            </li>
            <li>
              <img src="@/assets/images/icon/Icon/Normal/Message.svg" alt="댓글">
              <p class="Body2-Medium">{{ postData.comments }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="post-detail-content">
        <p class="Body1-long-Medium">{{ postData.content }}</p>
      </div>
      
      <div class="likeBtn-wrap">
        <button class="likeBtn" @click="toggleLike" :class="{ 'ActiveLike': isLikeActive }">
          <div class="likeBtn-item">
            <img src="@/assets/images/icon/Icon/Normal/Like.svg" alt="좋아요" class="icon20">
            <span class="Body2-Medium">추천</span>
            <span class="Body2-Medium">{{ postData.likes }}</span>
          </div>
        </button>
      </div>
    </div>
    <div class="post-detail-comments-section">
      <div class="comment-info-wrapper">
        <div class="Heading2-SemiBold">댓글 <span class="info-text">{{ postData.comments }}</span>개</div>
        <div class="comment-form-box">
          <textarea id="comment-editor" class="Body1-Medium" cols="30" rows="10" style="resize: none;" placeholder="댓글을 입력해 주세요"></textarea>
          <button class="Btn comment-btn" type="submit">등록</button>
        </div>
      </div>
    </div>
    <div class="goListPage">
      <button class="Btn" @click="goListPage">목록으로 돌아가기</button>
    </div>
  </div>
</template>
<script>
import postData from '@/assets/Data/PostsData';

export default {
  name: 'PostDetail',
  data() {
    return {
      postData: this.getPostData(),
      likeCount: 0,
      isLikeActive: false,
    };
  },
  methods: {
    getPostData() {
      const postId = this.$route.params.id;
      return postData.find(post => post.id === parseInt(postId));
    },
    goListPage() {
      this.$router.push({ name: 'PostList' });
    },
    toggleLike() {
      // this.likeCount > 0 ? this.likeCount-- : this.likeCount++;
      if (this.isLikeActive) {
        this.postData.likes--;
      } else {
        this.postData.likes++;
      }
      this.isLikeActive = !this.isLikeActive;
    }
  }
}
</script>

<style scoped>
.PostDetail-wrap {
  width: 1280px;
  margin: 0 auto;
  
}
.PostDetail-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}
.post-info {
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-light-default);
}

.likeBtn-wrap {
    padding: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--border-light-default);
}
.likeBtn {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 120px;
  padding: 12px;
  border-radius: 5px;
  transition: 0.1s;
  background: transparent;
  border: 1px solid var(--border-light-default);
  color: rgb(102, 102, 102);
  position: relative;
}

.ActiveLike,
.likeBtn:hover {
  border: 1px solid var(--primary-normal);
  color: var(--primary-normal);

}

.likeBtn:hover img {
  width: 20px;
  height: 20px;
  content: url('@/assets/images/icon/Icon/Normal/Like/Primary.svg');
}

.likeBtn-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ActiveLike:hover img,
.ActiveLike img {
  content: url('@/assets/images/icon/Icon/Normal/Like/active.svg');
}

.icon20 {
  display: block;
  width: 20px;
  height: 20px;
}

.goListPage{
  padding: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* comment */
.comment-form-box{
  display: flex;
  gap: 6px;
}
.comment-info-wrapper {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
#comment-editor{
  height: 128px;
    border: 1px solid var(--border-light-default);
    border-radius: 8px;
    padding: 12px;
    flex: 1;
    outline: none;
}
</style>