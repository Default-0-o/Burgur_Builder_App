import reducer from "./auth";
import * as actionTypes from "../actions/actionTypes";

describe("auth reducer", () => {
	it("should equalize state with initialState", () => {
		expect(reducer(undefined, {})).toEqual({
			token: null,
			userId: null,
			error: null,
			loading: false,
			authRedirectionPath: "/",
		});
	});
	it("should equalize state with passed action", () => {
		expect(
			reducer(
				{
					token: null,
					userId: null,
					error: null,
					loading: false,
					authRedirectionPath: "/",
				},
				{
					type: actionTypes.AUTH_SUCCESS,
					idToken: "token",
					localId: "userId",
				}
			)
		).toEqual({
			token: "token",
			userId: "userId",
			error: null,
			loading: false,
			authRedirectionPath: "/",
		});
	});
});
