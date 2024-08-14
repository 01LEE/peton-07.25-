<template>
    <div class="form-wrap">
        <Form @submit="onSubmit" :validation-schema="schema">
            <div class="form-container">
                <div class="form-title">
                    <h2 class="Heading1-SemiBold">로그인</h2>
                </div>
                <div class="field-wrap">
                    <Field name="login_id" type="text" v-slot="{ field, errorMessage, meta }">
                        <div class="field">
                            <label for="login_id" class="form-label Body3-SemiBold">아이디</label>
                            <input class="form-control Body1-Medium" v-bind="field"
                                :class="{ 'is-invalid': !meta.valid && errorMessage }" placeholder="아이디를 입력해주세요" autocomplete="off"/>
                            <span class="errMsg Caption-Regular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
                        </div>
                    </Field>
                    <Field name="password" v-slot="{ field, errorMessage, meta }">
                        <div class="field">
                            <label for="password" class="form-label Body3-SemiBold">비밀번호</label>
                            <div class="password-wrap form-control"
                                :class="{ 'is-invalid': meta && meta.valid === false && errorMessage }">
                                <input :type="showPassword ? 'text' : 'password'" class="pw-input Body1-Medium"
                                    v-bind="field" placeholder="비밀번호를 입력해주세요" autocomplete="off"/>
                                <button type="button" class="toggle-btn" @click="togglePasswordVisibility">
                                    <img class="icon-img"
                                        :src="showPassword ? require('@/assets/images/icon/Icon/Normal/EyeSlash16.svg') : require('@/assets/images/icon/Icon/Normal/Eye16.svg')"
                                        alt="패스워드 확인">
                                </button>
                            </div>
                            <span class="errMsg Caption-Regular" v-if="errorMessage && meta && meta.valid === false">{{
                                errorMessage }}</span>
                        </div>
                    </Field>

                    <div class="auto-login-wrap">
                        <label for="consent" class="auto-login">
                            <input type="checkbox" id="consent" v-model="rememberMe">
                            <span class="Body2-Medium">자동 로그인</span>
                        </label>
                    </div>
                </div>
                <div class="loginErr" v-if="loginErr">로그인에 실패하였습니다.</div>
                <button type="submit" class="form-btn Body1-Medium">로그인</button>
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
import axios from 'axios';
import { Form, Field } from 'vee-validate';
import { object, string } from 'yup';

export default {
    name: 'Login',
    data() {
        return {
            showPassword: false,
            loginErr: false,
            rememberMe: false,  // rememberMe를 데이터로 추가
        }
    },
    components: {
        Form,
        Field
    },
    computed: {
        schema() {
            return object({
                login_id: string().matches(/^[a-zA-Z0-9]+$/, 'ID는 영문과 숫자만 포함해야 합니다.').required('아이디를 입력해주세요.'),
                password: string().required('비밀번호를 입력해주세요.')
            });
        },
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        async onSubmit(userData, actions) {
        try {
            const loginData = {
                login_id: userData.login_id,
                password: userData.password,
                rememberMe: this.rememberMe
            };

            const res = await axios.post('http://localhost:3000/api/login', loginData, { withCredentials: true }); // 서버 URL에 맞게 수정하세요.
            
            
            
            if (res.data.success) {
                alert('로그인 성공');
                console.log(res);
                this.$router.push('/'); // 예시로 대시보드로 이동

                localStorage.setItem('authToken', res.data.token);
                
            } else {
                console.log(res);
                this.loginErr = true;
                actions.setFieldError('login_id', '로그인에 실패하였습니다.');
            }
        } catch (err) {
            console.error('로그인 중 오류 발생:', err);
            this.loginErr = true;
            
            actions.setFieldError('login_id', '로그인 중 오류가 발생했습니다.');
        }
    }
    }
}
</script>

<style>
input {
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
    cursor: pointer;
    color: var(--text-light-reverse);
}

.form-container {
    min-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.form-wrap {
    width: 1280px;
    height: 100%;
    margin: 100px auto;
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
    padding: 12px 8px;
    border-radius: 8px;
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
    background: url(../assets/images/icon/warning.svg)no-repeat 97.5% 50%; 
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
    background: url(../assets/images/icon/checkbox.svg)no-repeat center;
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
.find_wrap>ul {
    display: flex;
    justify-content: space-around;
}

.find_wrap>ul>li>a {
    padding: 0 20px;
}

.find_wrap>ul>li:nth-child(2)::after,
.find_wrap>ul>li:nth-child(2)::before {
    content: '';
    position: absolute;
    background: var(--border-light-default);
    width: 1px;
    height: 20px;
} 
</style>
