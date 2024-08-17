// src/store/index.js
import { createStore } from 'vuex';
import socket from '@/plugins/socket';

const store = createStore({
  state: {
    messages: [],
    notifications: [],
  },
  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
  },
  actions: {
    sendMessage({ commit }, message) {
      socket.emit('sendMessage', message);
    },
    receiveMessage({ commit }) {
      socket.on('message', (message) => {
        commit('ADD_MESSAGE', message);
      });
    },
    receiveNotification({ commit }) {
      socket.on('notification', (notification) => {
        commit('ADD_NOTIFICATION', notification);
      });
    },
  },
  getters: {
    messages: (state) => state.messages,
    notifications: (state) => state.notifications,
  },
});

export default store;
