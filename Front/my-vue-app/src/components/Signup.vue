<template>
  <div class="form-wrap">
    <Form @submit="onSubmit" :validation-schema="schema">
      <div class="form-container">
        <div class="form-title">
          <h2 class="Heading1-SemiBold">회원가입</h2>
        </div>
        <div class="field-wrap">
          <Field name="id" type="id" v-slot="{ field, errorMessage, meta }">
            <div class="field">
              <label for="id" class="form-label Body3-SemiBold">아이디</label>
              <input class="form-control Body1-Medium" v-bind="field"
                :class="{ 'is-invalid': !meta.valid && errorMessage }" placeholder="아이디를 입력해주세요" autocomplete="off"/>
              <span class="errMsg Caption-Ragular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
            </div>
          </Field>

          <Field name="password" v-slot="{ field, errorMessage, meta }">
            <div class="field">
              <label for="pwd" class="form-label Body3-SemiBold">비밀번호</label>
              <div class="password-wrap form-control" :class="{ 'is-invalid': !meta.valid && errorMessage }">
                <input :type="showPassword ? 'text' : 'password'" class="pw-input Body1-Medium" v-bind="field"
                  placeholder="비밀번호를 입력해주세요" autocomplete="off"/>
                <button type="button" class="toggle-btn" @click="togglePasswordVisibility">
                  <img class="icon-img"
                    :src="showPassword ? require('@/assets/images/icon/Icon/Normal/EyeSlash16.svg') : require('@/assets/images/icon/Icon/Normal/Eye16.svg')"
                    alt="패스워드 확인">
                </button>
              </div>
              <span class="errMsg Caption-Ragular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
            </div>
          </Field>

          <Field name="confirmPassword" v-slot="{ field, errorMessage, meta }">
            <div class="field">
              <label for="confirmPwd" class="form-label Body3-SemiBold">비밀번호 확인</label>
              <div class="password-wrap form-control" :class="{ 'is-invalid': !meta.valid && errorMessage }">
                <input :type="showPassword ? 'text' : 'password'" class="pw-input Body1-Medium" v-bind="field"
                  placeholder="비밀번호를 입력해주세요" autocomplete="off"/>
                <button type="button" class="toggle-btn" @click="togglePasswordVisibility">
                  <img class="icon-img"
                    :src="showPassword ? require('@/assets/images/icon/Icon/Normal/EyeSlash16.svg') : require('@/assets/images/icon/Icon/Normal/Eye16.svg')"
                    alt="패스워드 확인">
                </button>
              </div>
              <span class="errMsg Caption-Ragular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
            </div>
          </Field>

          <Field name="email" type="email" v-slot="{ field, errorMessage, meta }">
            <div class="field email-field">
              <label for="email" class="form-label Body3-SemiBold">이메일</label>
              <div class="email-input-wrap">
                <input  id="emailInput" class="form-control Body1-Medium" v-bind="field" v-model="email"
                  :class="{ 'is-invalid': !meta.valid && errorMessage }" placeholder="이메일을 입력해 주세요" autocomplete="off"/>
                <!-- sendVerificationCode 메소드를 호출 -->
                <button type="button" class="email-btn" @click="sendVerificationCode" :disabled="isTimerActive">전송</button>
              </div>
              <span class="errMsg Caption-Ragular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
            </div>
          </Field>

          <div v-if="isTimerActive" class="timer">
            {{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }} </div>

              <Field name="emailCode" type="text" v-slot="{ field, errorMessage, meta }">
                <div class="field email-code-field">
                  <label for="emailCode" class="form-label Body3-SemiBold">이메일 인증코드</label>
                  <div class="email-code-input-wrap">
                    <input class="form-control Body1-Medium" v-bind="field"
                      :class="{ 'is-invalid': !meta.valid && errorMessage }" placeholder="인증코드를 입력해 주세요" autocomplete="off"/>
                    <button type="button" class="email-btn" @click ="verifyCode">확인</button>
                  </div>
                  <span class="errMsg Caption-Ragular" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
                </div>
              </Field>j
          </div>

          <button type="submit" class="form-btn Body1-Medium" @click="onSubmit">완료</button>
        </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';
import { object, string, ref } from 'yup';
import axios from 'axios';

export default {
  components: {
    Form,
    Field
  },
  data() {
    return {
      showPassword: false,
      isTimerActive: false,
      timer: null,
      minutes: 5,
      seconds: 0,
    };
  },
  computed: {
    schema() {
      return object({
        id: string().matches(/^[a-zA-Z0-9]{6,16}$/, '6~16자의 영소문자, 숫자만 사용 가능합니다.')
          .required('아이디를 입력해주세요.'),
        password: string().required('비밀번호를 입력해주세요.')
          .matches(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[A-Za-z0-9#?!@$%^&*-]{8,16}$/, '8~16자의 영문, 숫자, 특수문자만 사용 가능합니다.'),
        confirmPassword: string().oneOf([ref('password')], '비밀번호가 일치하지 않습니다.').required('비밀번호 확인을 입력해주세요.'),
        email: string().email('유효한 이메일 주소를 입력해주세요.').required('이메일을 입력해주세요.'),
        emailCode: string().matches(/^[0-9]+$/, '숫자만 입력 가능합니다.')
      });
    }
  },
  methods: {
  async sendVerificationCode() {
    try {
      const emailData = { email: this.email }; // 사용자가 입력한 이메일
      console.log(emailData);
      const res = await axios.post('http://localhost:3000/api/signup/send-verification-code', emailData);
      
      
      if (emailData) {
        alert('인증 코드가 전송되었습니다.');
        this.isVerificationCodeSent = true; // 인증 코드 입력 필드를 활성화
      } else {
        alert('인증 코드 전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('인증 코드 전송 중 오류 발생:', err);
    }
  },

  async verifyCode() {
    try {
      const codeData = { email: this.email, code: this.emailCode }; // 사용자가 입력한 이메일과 인증 코드
      const res = await axios.post('http://localhost:3000/api/signup/verify-code', codeData);
      
      if (codeData) {
        alert('이메일 인증이 완료되었습니다.');
        this.isEmailVerified = true; // 이메일 인증 완료 상태로 변경
      } else {
        alert('이메일 인증에 실패했습니다.');
      }
    } catch (err) {
      console.error('이메일 인증 중 오류 발생:', err);
    }
  },
  async onSubmit(userData, actions) {
    try {
      if (!this.isEmailVerified) {
        actions.setFieldError('email', '이메일 인증을 완료해 주세요.');
        return;
      }

      const res = await axios.post('http://localhost:3000/api/signup/createuser', userData);
      console.log('userDate : ',userData);
      console.log('actions :',);
      
      
      
      if (userData) {
        console.log(userData);
        this.$router.push('/login'); // 회원가입 성공 후 로그인 페이지로 이동
      } else {
        actions.setFieldError('id', '이미 사용중인 아이디 입니다.');
      }
    } catch (err) {
      console.error('회원가입 중 오류 발생:', err);
      actions.setFieldError('id', '회원가입 중 오류가 발생했습니다.');
    }
  }
},
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>

<style>
input::placeholder{
  color: var(--text-light-assistive);
}
.form-title {
  text-align: center;
  margin-bottom: 20px;
}

.field-wrap .field {
  margin-bottom: 15px;
}

.password-wrap {
  display: flex;
}

.password-wrap input {
  flex: 1;
}

.toggle-btn {
  /* margin-right: 20px; */
  background: none;
  cursor: pointer;
}

.email-input-wrap,
.email-code-input-wrap {
  display: flex;
  gap: 6px;
}

.email-input-wrap input,
.email-code-input-wrap input {
  flex: 1;
}

.email-btn {
  width: 93px;
  border-radius: 8px;
  color: var(--text-light-reverse);
  background-color: var(--primary-normal);
  cursor: pointer;
}


.timer {
  text-align: center;
  font-size: 1.2em;
  margin-top: 10px;
  color: #e53e3e;
}

.pw-input {
  border: none;
}
</style>
