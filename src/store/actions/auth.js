import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	};
};

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		localId: userId,
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error,
	};
};

export const logout = () => {
	return {
		type: actionTypes.AUTH_INITIATE_LOGOUT,
	};
};

export const logoutSucceed = () => {
	return {
		type: actionTypes.AUTH_LOGOUT,
	};
};

export const checkTimeout = (time) => {
	return {
		type: actionTypes.AUTH_CHECK_TIMEOUT,
		expirationDate: time,
	};
};

export const setAuthRedirectionPath = (path) => {
	return {
		type: actionTypes.AUTH_REDIRECTION_PATH,
		path: path,
	};
};

export const auth = (email, password, isSignUp) => {
	return (dispatch) => {
		dispatch(authStart());
		const data = {
			email: email,
			password: password,
			returnSecureToken: true,
		};
		let url =
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBiml70SkxviJ7MRh9iR5DKKVcw3UwNfuQ";
		if (!isSignUp) {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBiml70SkxviJ7MRh9iR5DKKVcw3UwNfuQ";
		}
		axios
			.post(url, data)
			.then((res) => {
				const expirationDate = new Date(
					new Date().getTime() + res.data.expiresIn * 1000
				);
				localStorage.setItem("token", res.data.idToken);
				localStorage.setItem("userId", res.data.localId);
				localStorage.setItem("expirationDate", expirationDate);
				dispatch(authSuccess(res.data.idToken, res.data.localId));
				dispatch(checkTimeout(res.data.expiresIn));
			})
			.catch((err) => {
				dispatch(authFail(err.response.data.error));
			});
	};
};

export const authCheck = () => {
	return (dispatch) => {
		const token = localStorage.getItem("token");
		if (!token) {
			dispatch(logout());
		} else {
			const expirationDate = new Date(localStorage.getItem("expirationDate"));
			if (expirationDate <= new Date()) {
				dispatch(logout());
			} else {
				const userId = localStorage.getItem("userId");
				dispatch(authSuccess(token, userId));
				dispatch(
					checkTimeout((expirationDate.getTime() - new Date().getTime()) / 1000)
				);
			}
		}
	};
};
