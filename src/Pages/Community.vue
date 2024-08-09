<template>
    <nav class="navbar">
        <div class="community-nav-wrap">
            <ul class="community-nav-item">
                <li :class="{ NavActive: $route.path === '/Community/Peton/All' }">
                    <router-link to="/Community/Peton/All">
                        <img class="icon-img" src="../assets/images/icon/community-nav01.svg" alt="">
                        <h2 class="Heading2-Medium">펫온 커뮤니티</h2>
                    </router-link>
                </li>

                <li :class="{ NavActive: $route.path === '/Community/Gathering/All' }">
                    <router-link to="/Community/Gathering/All">
                        <img class="icon-img" src="../assets/images/icon/community-nav02.svg" alt="">
                        <h2 class="Heading2-Medium">모임</h2>
                    </router-link>
                </li>
                <li :class="{ NavActive: $route.path === '/Community/Aboption/All' }">
                    <router-link to="/Community/Aboption/All">
                        <img class="icon-img" src="../assets/images/icon/community-nav03.svg" alt="">
                        <h2 class="Heading2-Medium">입양</h2>
                    </router-link>
                </li>
                <li>
                    <router-link to="">
                        <img class="icon-img" src="../assets/images/icon/community-nav04.svg" alt="">
                        <h2 class="Heading2-Medium">정보공유</h2>
                    </router-link>
                </li>

            </ul>
        </div>
    </nav>
    <div class="Comm-content-wrap">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    data(){
        return{

        }
    }
}
</script>

<style>
.navbar {
    z-index: 1;
    width: 100%;
    position: fixed;
    top: 70px;
    background: var(--background-light-default);
}

.community-nav-wrap {
    height: 86px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--border-light-default);
    /* box-shadow: 0px 0px 15px 0px rgba(26, 115, 232, 0.13); */
}

.community-nav-item {
    display: flex;
    gap: 100px;
}

.community-nav-item>li {
    position: relative;
    height: 86px;
    line-height: 100px;
    display: flex;
    align-items: center;
}

.community-nav-item>li>a {
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
}

.NavActive>a {
    color: var(--primary-normal);
}

.NavActive:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: var(--primary-normal);
}

.icon-img {
    display: block;
}

/* 메인 */

.Comm-content-wrap {
    display: flex;
    gap: 30px;
    justify-content: space-between;
    padding-top: 210px;
    width: 1280px;
    margin: 0 auto;
}




/* 필터 */


</style>