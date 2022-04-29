import axios from "axios";
import {GET_ALL_PRODUCTS_A} from "./actionsAdmin";
import {LOADING} from "./actions";
import {SEARCH_PRODUCT_A} from "./actionsAdmin";
const getAllProductsAdmin = (token) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const {data} = await axios.get(
      `http://localhost:3001/allFootwear/allForAdmin`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    dispatch({type: GET_ALL_PRODUCTS_A, payload: data});
    dispatch({type: LOADING, payload: false});
  };
};

const searchProduct = (token, param) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const {data} = await axios.get(
      "http://localhost:3001/allFootwear?footwear=" + param,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    dispatch({type: SEARCH_PRODUCT_A, payload: data});
    dispatch({type: LOADING, payload: false});
  };
};

const postProduct = (token, newShoe) => {
  console.log("Soy el nuevo shoe=>>", newShoe);
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    await axios.post(`http://localhost:3001/allFootwear`, newShoe, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    dispatch(getAllProductsAdmin(token));
    dispatch({type: LOADING, payload: false});
  };
};

const editShoe = (token, editedShoe) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    axios.put(
      `http://localhost:3001/allFootwear/${editedShoe.id}`,
      editedShoe,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    dispatch(getAllProductsAdmin(token));
    dispatch({type: LOADING, payload: false});
  };
};

const deleteShoe = (token, id) => {
  return async (dispatch, getState) => {
    dispatch({type: LOADING, payload: true});
    await axios.delete(`http://localhost:3001/allFootwear/${id}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let oldData = getState().admin.allDataCopy;
    console.log(oldData);
    let newData = oldData.filter((el) => {
      return el.id !== id;
    });
    console.log(newData);
    dispatch(getAllProductsAdmin(token));
    dispatch({type: LOADING, payload: false});
  };
};
export {postProduct, editShoe, deleteShoe, getAllProductsAdmin, searchProduct};
