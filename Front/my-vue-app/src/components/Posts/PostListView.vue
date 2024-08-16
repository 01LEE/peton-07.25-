<template>
  <div class="PostList">
    <PostItem 
      v-for="post in PostData" 
      :key="post.id" 
      :postData="post" 
      @post-click="goPage"
    />
  </div>
</template>

<script>
import axios from 'axios';
import PostItem from '@/components/Posts/PostItem.vue';

export default {
  name: 'PostListView',
  data() {
    return {
      PostData: [],  // 초기 데이터는 빈 배열
    };
  },
  components: {
    PostItem,
  },
  methods: {
    goPage(postId) {
      this.$router.push(`/Community/Peton/Post/${postId}`);
    },
    fetchPosts() {
      axios.get('http://localhost:3000/api/notice')
        .then(response => {
          this.PostData = response.data.map(post => ({
            id: post.post_id,
            category: '자유게시판',  // 임의의 카테고리
            title: post.title,
            content: post.description,
            author: {
              name: post.nick_name,
              avatar: 'peton-07.25-/Front/my-vue-app/src/assets/images/cat01.png', // 기본 아바타 이미지
              time: new Date(post.write_time).toLocaleString()
            },
            views: post.view_count,  // 기본값
            likes: post.likeCount,  // 기본값
            comments: post.totalCommentsCount  // 기본값
          }));
        })
        .catch(error => {
          console.error("Error fetching posts:", error);
        });
    }
  },
  created() {
    this.fetchPosts();  // 컴포넌트가 생성될 때 API로부터 데이터 가져오기
  }
}
</script>

<style>
  .PostList {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
