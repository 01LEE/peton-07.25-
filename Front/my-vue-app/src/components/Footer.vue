<template>
    <footer>
        <div class="footer-inner">
            <div class="footer-nav">
                <ul>
                    <li class="Body1-SemiBold"><router-link to="">개인정보처리방침</router-link></li>
                    <li class="Body1-Medium"><router-link to="">이용약관</router-link></li>
                    <li class="Body1-Medium"><router-link to="">이용안내</router-link></li>
                    <li class="Body1-Medium"><router-link to="">운영정책</router-link></li>
                    <li class="Body1-Medium"><router-link to="">위치기반서비스 이용약관</router-link></li>
                </ul>
            </div>
            <div class="footer-area">
                <div class="footer-logo">
                    <img src="../assets/images/logo/logo.svg" alt="Logo">
                </div>
                <p class="Body2-SemiBold sub-text">서울 서초구 양재동 헌릉로 12 </p>
                <p class="Body3-Medium copy-text">COPYRIGHT 2024. PetOn. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style>
footer {
    /* margin-top: 80px; */
    box-sizing: border-box;
    padding: 20px;
    height: 210px;
    background-color: var(--blue-100);
}

.footer-inner {
    display: flex;
    gap: 22px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1280px;
    margin: 0 auto;
}
.footer-logo{
    margin-bottom: 10px;
}
.footer-nav {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.footer-nav>ul {
    display: flex;
    gap: 24px;
}

.footer-nav>ul>li>a {
    padding: 8px 0px;
}

.footer-area {
    text-align: center;
}
.footer-area>p:nth-child(2){
    margin-bottom: 22px;
}
.copy-text{
    color: var(--text-light-info);
}
</style>