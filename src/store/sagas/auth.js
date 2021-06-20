import * as actions from "../actions/index";

import { put } from "redux-saga/effects";
import { delay } from "redux-saga/effects";

export function* logoutSaga(action) {
	yield localStorage.removeItem("token");
	yield localStorage.removeItem("userId");
	yield localStorage.removeItem("expirationDate");

	yield put(actions.logoutSucceed());
}

export function* checkTimeoutSaga(action) {
	yield delay(action.expirationDate * 1000);
	yield put(actions.logout());
}
