<template>
    <div class="form-wrap">
        <Form @submit="onSubmit" :validation-schema="schema">
            <div class="form-container">
                <div class="form-title">
                    <h2 class="Heading1-SemiBold">로그인</h2>
                </div>
                <div class="field-wrap">
                    <Field name="id" type="id" v-slot="{ field, errorMessage, meta }">
                        <div class="field">
                            <label for="id" class="form-label Body3-SemiBold">아이디</label>
                            <input class="form-control" v-bind="field"
                                :class="{ 'is-invalid': !meta.valid && errorMessage }" />
                            <span class="errMsg" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
                        </div>
                    </Field>
                    <Field name="password" type="password">
                        <div class="field">
                            <label for="pwd" class="form-label Body3-SemiBold">비밀번호</label>
                            <input class="form-control" type="password" />
                            <span class="errMsg"></span>
                        </div>
                    </Field>
                    <div class="auto-login-wrap">
                        <label for="consent" class="auto-login">
                            <input type="checkbox" id="consent">
                            <span class="Body2-Medium">자동 로그인</span>
                        </label>
                    </div>
                </div>
                <div class="loginErr" v-if="loginErr">로그인에 실패하였습니다.</div>
                <button type="submit" class="form-btn ">로그인</button>
                <div class="find_wrap">
                    <ul>
                        <li><router-link to="" class="Body2-Medium">아이디 찾기</router-link></li>
                        <li><router-link to="" class="Body2-Medium">비밀번호 찾기</router-link></li>
                        <li><router-link to="" class="Body2-Medium">회원가입</router-link></li>
                    </ul>
                </div>
            </div>
        </Form>
    </div>
</template>

<script>
import { Form, Field, errorMessage } from 'vee-validate';
import { object, string } from 'yup';
export default {
    components: {
        Form,
        Field
    },
    computed: {
        schema() {
            return object({
                id: string().matches(/^[a-zA-Z0-9]+$/, 'ID는 영문과 숫자만 포함해야 합니다.').required('아이디를 입력해주세요.'),
                password: string().required('비밀번호를 입력해주세요.').matches(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])(?=.{8,})/, '영문자, 숫자, 특수문자를 조합하여 최소8자리를 입력해주세요.')
            });
        },
    },
    methods: {
        async onSubmit(userData, actions) {
            try {
                const res = await joinUser(userData); //API 통신
                if (!res.data.resultData.duplicatedId) {
                    this.showSuccessModal();
                } else {
                    actions.setFieldError('id', '이미 사용중인 아이디 입니다.');
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>

<style>
input{
    outline: none;
}
.form-btn {
    border: none;
    background-color: none;
    background: var(--primary-normal);
    border-radius: 8px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: var(--text-light-reverse);
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.form-wrap {
    width: 1280px;
    height: 70vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.form-title {
    text-align: center;
}

.form-control {
    border: 1px solid var(--primary-normal);
    width: 300px;
    padding: 12px 8px;
    border-radius: 8px;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    /* 150% */
    letter-spacing: -0.4px;
}

.form-label {
    margin-bottom: 6px;
}

.field {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.field-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.is-invalid {
    color: var(--danger-text);
    border: 2px solid var(--danger-base);
    background: url(../assets/images/icon/경고.svg)no-repeat 97.5% 50%;
}

.errMsg {
    margin-top: 6px;
    color: var(--danger-text);
}

.errMsg:active {
    border: 2px solid var(--danger-border);
}

/* 자동로그인 */
.auto-login {
    display: flex;
    align-items: center;
    gap: 4px;
}

#consent {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid var(--border-light-default);
    border-radius: 3px;
}

#consent:checked {
    border: none;
    background: url(../assets/images/icon/체크박스.svg)no-repeat center;
}

#consent:checked+span {
    transition: all 0.3s;
    color: var(--Text-Text_default);
}

.frm_grp input[type=checkbox] {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    vertical-align: middle;
    border: none;
    outline: none;
    cursor: pointer;
    /* opacity: 0; */
    z-index: 2;
}   
/* 찾기 */
.find_wrap>ul{
    display: flex;
    justify-content: space-around;
}
.find_wrap>ul>li>a{
    padding: 0 20px;
}
.find_wrap>ul>li:nth-child(2)::after,
.find_wrap>ul>li:nth-child(2)::before{
    content: '';
    position: absolute;
    background: var(--border-light-default);
    width: 1px;
    height: 20px;
}
</style>