const state = {
  main: {
    name: "未登录",
    group: "匿名访问",
    createdAt: new Date(),
    wizard: 0,
    avatarUrl: ""
  }
};

const mutations = {
  loginInit(state, $message) {
    state.main.name = $message[0];
    state.main.group = $message[1];
    state.main.avatarUrl = $message[3];
  },
  logout(state) {
    state.main.name = "未登录";
    state.main.group = "匿名访问";
  },
  setWizard(state, $wizard) {
    state.main.wizard = $wizard;
  },
  setAvatar(state, $avatarUrl) {
    state.main.avatarUrl = $avatarUrl;
  }
};

export default {
  state,
  mutations
};
