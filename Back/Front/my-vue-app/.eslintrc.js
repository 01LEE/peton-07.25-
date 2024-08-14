module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      // 'plugin:prettier/recommended'  // 이 줄을 주석 처리하거나 제거하여 Prettier 관련 규칙을 비활성화할 수 있습니다
    ],
    parserOptions: {
      parser: '@babel/eslint-parser',
    },
    rules: {
      // Vue.js와 관련된 규칙 비활성화
      'vue/no-reserved-component-names': 'off',
      'vue/no-unused-components': 'off',
      'vue/no-mutating-props': 'off',
  
      // JavaScript와 관련된 규칙 비활성화
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
      'no-irregular-whitespace': 'off',
      
      // 기타 필요한 규칙 추가 또는 수정 가능
    },
  };
  