import axios from "axios";
import {GET_ALL_USERS, SEARCH_USER_A} from "./actionsAdmin";
import {LOADING} from "./actions";

const URL = "http://localhost:3001/user/";
const getAllUsers = (token) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const {data} = await axios.get(URL + "allUsers", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    dispatch({type: GET_ALL_USERS, payload: data});
    dispatch({type: LOADING, payload: false});
  };
};
const searchUser = (token, searchParam) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const {data} = await axios.get(`${URL}allUsers?search=${searchParam}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    console.log(data);
    dispatch({type: SEARCH_USER_A, payload: data});
    dispatch({type: LOADING, payload: false});
  };
};
const filterUsers = (token, isAdmin) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const {data} = await axios.get(`${URL}allUsers?isAdmin=${isAdmin}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    dispatch({type: SEARCH_USER_A, payload: data});
    dispatch({type: LOADING, payload: false});
  };
};

const deleteUser = (token, user) => {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true});
    await axios.delete(`http://localhost:3001/user/deleteUser/${user.email}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let oldData = getState().admin.users;
    let newData = oldData.filter((el) => {
      return el.email !== user.email;
    });
    console.log("Soy el new Data: ", newData);
    dispatch(getAllUsers(token));
    dispatch({type: LOADING, payload: false});
  };
};
const changeUserRole = (token, user) => {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true});
    await axios.put(`http://localhost:3001/user/changeAdminState`, user, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let oldData = getState().admin.users;
    let newData = oldData.map((el) =>
      user.email === el.email ? {...el, isAdmin: user.adminState} : el
    );
    dispatch(getAllUsers(token));
    dispatch({type: LOADING, payload: false});
  };
};
const filterByName = (filter) => {
  return async (dispatch, getState) => {
    let filtered = [...getState().admin.users];
    switch (filter) {
      case "A-Z":
        filtered.sort((a, b) => {
          let c = a.userName.toLowerCase(),
            d = b.userName.toLowerCase();
          return c < d ? -1 : d > c ? 1 : 0;
        });
        break;
      case "Z-A":
        filtered.sort((b, a) => {
          let c = a.userName.toLowerCase(),
            d = b.userName.toLowerCase();
          return c < d ? -1 : d > c ? 1 : 0;
        });
        break;
      case "All":
        filtered = [...getState().admin.usersBackup];
        break;
      default:
        return [];
    }
    dispatch({type: SEARCH_USER_A, payload: filtered});
  };
};
export {
  deleteUser,
  getAllUsers,
  changeUserRole,
  searchUser,
  filterUsers,
  filterByName,
};
