<template>
  <div class="PostDetail-wrap" v-if="postData">
    <div class="PostDetail-container">
      <div class="post-category">
        <span class="Caption-SemiBold">자유게시판</span> <!-- 카테고리는 하드코딩 -->
      </div>
      <div class="post-title">
        <h2 class="Title3-Bold">{{ postData.title }}</h2>
      </div>
      <div class="post-info">
        <div class="user-profile">
          <div class="user-avatar">
            <img :src="postData.profile_image_url || 'default-image-url'" alt="User Avatar" class="icon-img"/>
          </div>
          <div class="user-name">
            <div class="Body1-Medium title-text">{{ postData.author.name }}</div>
            <div class="Caption-Ragular info-text">{{ timeAgo(postData.author.time) }}</div>
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
          <textarea id="comment-editor" v-model="newComment" class="Body1-Medium" cols="30" rows="10" style="resize: none;" placeholder="댓글을 입력해 주세요"></textarea>
          <button class="Btn comment-btn" @click="submitComment" type="submit">등록</button>
        </div>
      </div>
      <!-- 댓글과 대댓글을 표시하는 부분은 추가로 구현 필요 -->
    </div>
    <div class="goListPage">
      <button class="Btn" @click="goListPage">목록으로 돌아가기</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PostDetail',
  data() {
    return {
      postData: null,  // 초기 상태는 null로 설정
      isLikeActive: false,
      newComment: '', // 새로운 댓글의 내용을 저장하기 위한 데이터
    };
  },
  methods: {
    fetchPostData() {
      const postId = this.$route.params.id;

      axios.get(`http://localhost:3000/api/notice/${postId}`)
        .then(response => {
          const data = response.data;
          this.postData = {
            id: data.post.post_id,
            profile_image_url: data.post.profile_image_url,
            category: '자유게시판',  // 카테고리는 하드코딩
            title: data.post.title,
            content: data.post.description,
            author: {
              name: data.post.nick_name,
              avatar: '@/assets/images/cat01.png',  // 기본 아바타 이미지
              time: data.post.write_time,  // 시간 데이터 그대로 저장
            },
            views: data.post.view_count,
            likes: data.likeCount,
            comments: data.totalCommentsCount,
            commentsWithRecomments: data.commentsWithRecomments
          };
          this.isLikeActive = data.userHasLiked; // 사용자가 이 게시글에 좋아요를 눌렀는지 상태를 설정
        })
        .catch(error => {
          console.error('Error fetching post details:', error);
        });
    },
    toggleLike() {
      const postId = this.postData.id;

      axios.post(`http://localhost:3000/api/notice/like/${postId}`)
        .then(response => {
          if (response.data.liked) {
            this.postData.likes++;
          } else {
            this.postData.likes--;
          }
          this.isLikeActive = response.data.liked;
        })
        .catch(error => {
          console.error('좋아요 처리 중 에러 발생:', error);
        });
    },
    submitComment() {
      const postId = this.postData.id;

      if (this.newComment.trim() === '') {
        alert('댓글을 입력해 주세요.');
        return;
      }

      axios.post(`http://localhost:3000/api/notice/comment/${postId}`, {
        c_description: this.newComment
      })
      .then(response => {
        alert('댓글이 성공적으로 등록되었습니다.');
        this.postData.comments++; // 댓글 수 증가
        this.newComment = ''; // 댓글 입력란 초기화
      })
      .catch(error => {
        console.error('댓글 등록 중 에러 발생:', error);
      });
    },
    timeAgo(date) {
      const now = new Date();
      const diff = now - new Date(date);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return days + '일 전';
      } else if (hours > 0) {
        return hours + '시간 전';
      } else if (minutes > 0) {
        return minutes + '분 전';
      } else {
        return seconds + '초 전';
      }
    },
    getAvatarUrl(avatarPath) {
      return require(`@/assets/images/cat01.png`);
    },
    goListPage() {
      this.$router.push({ name: 'PostList' });
    }
  },
  created() {
    this.fetchPostData();
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