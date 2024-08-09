<!-- <template>
  <PostItem v-for="PostData in PostData" :key="PostData" :PostData="PostData"></PostItem>
</template> -->
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
  
<!-- <script>
import PostData from '@/assets/Data/PostsData';
import PostItem from '@/components/Posts/PostItem.vue';

export default {
    name: 'PostListView',
    data(){
        return{
            PostData : PostData,
            
        }
    },
    components:{
        PostItem,
    },
    methods:{
        
    }
}
</script> -->
<script>
import PostData from '@/assets/Data/PostsData';
import PostItem from '@/components/Posts/PostItem.vue';

export default {
  name: 'PostListView',
  data() {
    return {
      PostData: PostData,
    };
  },
  components: {
    PostItem,
  },
  methods: {
    goPage(postId) {
      this.$router.push(`/Community/Peton/Post/${postId}`);
    }
  }
}
</script>

<style>
  .PostList{
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>