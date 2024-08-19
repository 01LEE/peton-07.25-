<template>
  <div class="post-wrapper" @click="goDetailPage">
    <div class="post-category">
      <span class="Caption-SemiBold">{{ postData.category }}</span>
    </div>
    <div class="post-content-preview">
      <h2 class="Heading1-SemiBold">{{ postData.title }}</h2>
      <p class="Body1-long-Medium">{{ postData.content }}</p>
    </div>
    <div class="post-info">
      <div class="user-profile">
        <div class="user-avatar">
          <img :src="postData.profile_image_url || 'default-image-url'" alt="User Avatar" class="icon-img"/>
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
            <p class="Body2-Medium">{{ postData.likes }}</p>
          </li>
          <li>
            <img src="@/assets/images/icon/Icon/Normal/Message.svg" alt="댓글">
            <p class="Body2-Medium">{{ postData.comments }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    postData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      profile_image_url: ''
    };
  },
  methods: {
    goDetailPage() {
      this.$emit('post-click', this.postData.id);
      this.postData.views++;  // 조회수 증가 (이건 로컬에서만 반영됨)
    }
  }
}
</script>

<style>
.post-wrapper {
    width: 1030px;
    display: flex;
    box-shadow: var(--shadow-emphasize);
    padding: 24px;
    box-sizing: border-box;
    flex-direction: column;
    gap: 24px;
    border-radius: 8px;
    cursor: pointer;
}

.post-content-preview {
    display: flex;
    flex-direction: column;
    height: 90px;
    gap: 8px;
}

.post-content-preview>p {
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.post-stats>ul {
    display: flex;
    gap: 8px;
    justify-content: right;
}

.post-stats>ul>li {
    display: flex;
    padding: 5px 12px;
    gap: 10px;
    background: var(--neutral-99);
    border-radius: 23px;
}

.post-category>span {
    display: inline-block;
    background: var(--blue-100);
    padding: 6px 12px;
    border-radius: 40px;
}

.post-stats>ul>li>img {
    display: block;
}
/* 유저 */
.post-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.user-profile {
    display: flex;
    gap: 10px;
}
.user-name{
    display: flex;
    flex-direction: column;
}
.user-avatar>img {
    object-fit: cover;
    width: 42px;
    height: 42px;
    border-radius: 50px;
}
</style>