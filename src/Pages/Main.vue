<template>
    <div class="wrap">
        <section class="section01">
            <div class="section01-inner">
                <div class="mainText">
                    <h1 class="Display1-Bold"><span class="logoFont">PetOn</span>으로 연결되는 <br>나와 반려동물</h1>
                </div>
            </div>
        </section>
        <section class="section02">
            <div class="section02-inner">
                <div class="section02-title">
                    <p class="info-text Title3-Bold">커뮤니티</p>
                    <h2 class="title-text Display2-Bold">펫온과 공유하는 일상</h2>
                    <p class="sub-text Heading1-Regular">커뮤니티를 통해 반려동물과의 일상을 공유해보세요</p>
                </div>
                <div class="section02-content">
                    <div class="content01">
                        <h3 class="Title2-Bold">커뮤니티</h3>
                        <p class="Heading1-Medium sub-text">반려동물 종류 별, 고민, 정보를 나눌 수 있어요.</p>
                    </div>
                    <div class="content02">
                        <h3 class="Title2-Bold">1:1 쪽지</h3>
                        <p class="Heading1-Medium sub-text">1:1 쪽지로 입양 문의, 정보 문의를 나눌 수 있어요.</p>
                    </div>
                    <div class="content03">
                        <h3 class="Title2-Bold">펫 백과</h3>
                        <p class="Heading1-Medium sub-text">반려동물에 대한 정보를 제공해 드려요.</p>
                    </div>
                    <div class="content04">
                        <h3 class="Title2-Bold">훈련팁</h3>
                        <p class="Heading1-Medium sub-text">반려동물별 훈련 팁을 제공해 드려요.</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="section03">
            <section class="section03-inner">
                <div class="section03-title">
                    <p class="info-text Title3-Bold">산책 모임</p>
                    <h2 class="title-text Display2-Bold">펫온과 함께하는 모임</h2>
                    <p class="sub-text Heading1-Regular">전국 어디든! 원하는 시간대에 <br><span class="Heading1-SemiBold">함께 산책할
                            파트너</span>를 구해보세요!</p>
                    <button class="section-button"><router-link to="/" class="Btn Body1-SemiBold">이동하기</router-link></button>
                </div>
            </section>
        </section>
        <section class="section04">
            <section class="section04-inner">
                <div class="section04-title">
                    <h2 class="title-text Display2-Bold">오늘의 펫</h2>
                </div>
                <div class="section04-content">
                    <div class="section04-lf">
                        <img src="../assets/images/section04Bg.svg" alt="">
                    </div>
                    <div class="section04-rt">
                        <ul>
                            <li class="Title2-Bold"><span class="Heading1-Medium sub-text">견종</span>보더콜리</li>
                            <li class="Title2-Bold"><span class="Heading1-Medium sub-text">지능</span>똑똑이 중의 똑똑이!</li>
                            <li class="Title2-Bold"><span class="Heading1-Medium sub-text">활동성</span>에너지가 넘치는 작은 운동 마니아
                            </li>
                            <li class="Title2-Bold"><span class="Heading1-Medium sub-text">사교성</span>사람을 좋아하는 친화력 만렙
                            </li>
                        </ul>
                        <button class="section04-btn-wrap">
                            <router-link to="/" class="Title3-Bold reverse-text section04-btn">보더콜리의 자세한 정보가 궁금하시다면?</router-link>
                        </button>
                    </div>
                </div>
            </section>
        </section>
        <section class="section05">
            <section class="section05-inner">
                <div class="section05-title">
                    <h2 class="title-text Display2-Bold">공지사항</h2>
                    <div class="section05-title-rt">
                        <router-link to="" class="Heading1-Medium sub-text">더보기</router-link>
                    </div>
                </div>
                <NoticeList></NoticeList>
            </section>
        </section>
        <!-- <section class="section06">
            <div class="section06-inner">
                <PetList></PetList>
            </div>
        </section> -->
    </div>
</template>

<script>
import NoticeList from '../components/NoticeList.vue';
import PetList from '../components/PetList.vue';
export default {
    name: 'Main',
    components:{
        NoticeList,
        PetList,
    }
}
</script>

<style>
@font-face {
    font-family: 'RixInooAriDuriR';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2207-01@1.0/RixInooAriDuriR.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}
/* .wrap{
    padding-top: 70px;
} */
.section01 {
    width: 100%;
    height: 800px;
    background: var(--primary-normal) url(../assets/images/MainBg.svg) no-repeat 100% 100%;
}

.section01-inner {
    width: 1280px;
    height: 100%;
    display: flex;
    margin: 0 auto;
}

.mainText {
    display: flex;
    justify-content: left;
    align-items: center;
}

.mainText>h1 {
    color: var(--text-light-reverse);
}

.logoFont {
    font-family: 'RixInooAriDuriR';
    letter-spacing: 2px;
}

/* section02 */


.section02 {
    margin-top: 100px;
}

.section02-inner {
    width: 1280px;
    margin: 0 auto;
}

.section02-title {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 64px;
}

.section02-title>p:nth-child(1),
.section03-title>p:nth-child(1) {
    margin-bottom: 8px;
}

.section02-title>h2,
.section03-title>h2 {
    margin-bottom: 20px;
}

.section02-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 30px;
    padding: 20px;
}

.content01,
.content02,
.content03,
.content04 {
    box-sizing: border-box;
    padding: 40px;
    border-radius: 40px;
}

.content03,
.content04 {
    min-width: 300px;
    min-height: 300px;
}

.content01>h3,
.content02>h3,
.content03>h3,
.content04>h3 {
    margin-bottom: 8px;
}

.content01 {
    grid-column: 1 / 2;
    grid-row: 1 / 4;
    background-color: #f0f4ff;
}

.content02 {
    height: 300px;
    grid-column: 2 / 4;
    grid-row: 1 / 2;
    background: #f0f4ff url(../assets/images/icon/쪽지.svg) no-repeat 95% 85%;
}

.content03 {
    grid-column: 2 / 3;
    grid-row: 2 / 4;
    background: #f0f4ff url(../assets/images/icon/파일.svg) no-repeat 95% 85%;
}

.content04 {
    grid-column: 3 / 3;
    grid-row: 2 / 4;
    background: #f0f4ff url(../assets/images/icon/박수.svg) no-repeat 95% 85%;
}

/* section03 */

.section03 {
    margin-top: 100px;
    display: flex;
    height: 700px;
    background-color: var(--neutral-99);

}

.section03-inner {
    display: flex;
    align-items: center;
    width: 1280px;
    margin: 0 auto;
    background-image: url(../assets/images/community.svg);
    background-repeat: no-repeat;
    background-position: 80%;
}

.section03-title {
    margin-left: 100px;
}

/* section04 */
.section04{
    margin-top: 100px;
}
.section04-inner {
    width: 1280px;
    margin: 0 auto;
    /* display: flex; */
}
.section04-title{
    margin-bottom: 48px;
}
.section04-title>h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.section04-title>h2::before {
    content: '';
    position: absolute;
    top: 3px;
    right: 43%;
    background-color: #FFAB2D;
    width: 20px;
    height: 20px;
    border-radius: 100px;
    z-index: -1;

}

.section04-content {
    display: flex;
    justify-content: space-between;
}

.section04-rt>ul {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.section04-rt>ul>li>span {
    display: inline-block;
    width: 100px;
    margin-right: 38px;
}

.section04-rt {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #FFF5E0;
    padding: 80px;
    border-radius: 40px;
}
.section04-btn-wrap{
    background-color: #FFAB2D;
    border-radius: 20px;
}
.section04-btn{
    display: flex;
    justify-content: center;
    
    padding: 24px;
}
/* section05 */

.section05{
    margin-top: 100px;
    height: 700px;
    background-color: var(--neutral-99);
    display: flex;
    justify-content: center;
    align-items: center;
}
.section05-inner{
    width: 1280px;
    margin: 0 auto;
}
.section05-title{
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
}

.section05-title-rt {
    display: flex;
    align-items: center;
}







/* 공통 */
.info-text {
    color: var(--primary-normal);
}

.title-text {
    color: var(--text-light-default);
}

.sub-text {
    color: var(--text-light-sub);
}
.reverse-text{
    color: var(--text-light-reverse);
}
button{
    border: none;
    background-color: none;
}
.section-button {
    margin-top: 64px;
}

.Btn {
    display: flex;
    padding: 12px 38px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    color: var(--text-light-reverse);
    background-color: var(--primary-normal);
}
</style>