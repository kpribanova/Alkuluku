import http from "@/plugins/axios";
import Vue from "vue";
import i18n from "@/i18n";

export default {
  deleteBook: ({ commit, dispatch }, payload) => {
    commit("deleteBook", payload);
    return dispatch("postCountryData").then(() => {
      dispatch("toast", {
        text: "bookRemoved",
        type: "success",
      });
    });
  },
  addBook: ({ commit, dispatch }, payload) => {
    commit("addBook", payload);
    return dispatch("postCountryData").then(() => {
      dispatch("toast", {
        text: "bookAdded",
        type: "success",
      });
    });
  },
  postCountryData: ({ commit, state }) => {
    const data = {
      data: state.countryData,
    };
    return http.post("/country-data", data).then((res) => {
      commit("setCountryData", res.data.data);
    });
  },
  setSettings: ({ commit, dispatch }, payload) => {
    const data = {
      data: payload,
    };
    return http.post("/settings", data).then(() => {
      commit("setSettings", payload);
      dispatch("toast", {
        text: "settingsUpdated",
        type: "success",
      });
    });
  },
  getUserData: ({ commit, dispatch }) => {
    return http.get("/user-data").then((res) => {
      commit("setUserData", res.data.data);
      dispatch("getSettings");
      dispatch("getCountryData");
    });
  },
  getSettings: ({ commit }) => {
    return http.get("/settings").then((res) => {
      commit("setSettings", res.data.data);
    });
  },
  getCountryData: ({ commit }) => {
    return http.get("/country-data").then((res) => {
      commit("setCountryData", res.data.data);
    });
  },
  login: ({ dispatch }, payload) => {
    const data = {
      email: payload.email,
      password: payload.password,
    };
    return http
      .post("/login", data)
      .then(() => {
        dispatch("getUserData");
        dispatch("toast", {
          text: "loggedIn",
          type: "success",
        });
      })
      .catch(() => {
        dispatch("toast", {
          text: "loginFailed",
          type: "error",
        });
      });
  },
  register: ({ dispatch }, payload) => {
    const data = {
      email: payload.email,
      password: payload.password,
    };
    return http
      .post("/register", data)
      .then(() => {
        dispatch("getUserData");
        dispatch("toast", {
          text: "loggedIn",
          type: "success",
        });
      })
      .catch(() => {
        dispatch("toast", {
          text: "registerFailed",
          type: "error",
        });
      });
  },
  logout: () => {
    return http.post("/logout").then(() => {
      window.location.reload();
    });
  },
  toast: (_, payload) => {
    Vue.toasted.show(i18n.t(payload.text), {
      position: "top-center",
      theme: "bubble",
      duration: 1000,
      keepOnHover: true,
      type: payload.type,
      singleton: true,
    });
  },
};
