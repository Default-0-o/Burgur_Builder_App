import { useState, useEffect } from "react";

export default (axiosProp) => {
	const [error, setError] = useState(null);

	const reqInterceptor = axiosProp.interceptors.request.use((req) => {
		setError(null);
		return req;
	});
	const resInterceptor = axiosProp.interceptors.response.use(
		(res) => res,
		(err) => {
			setError(err);
		}
	);

	useEffect(() => {
		return () => {
			axiosProp.interceptors.request.eject(reqInterceptor);
			axiosProp.interceptors.response.eject(resInterceptor);
		};
	}, [resInterceptor, reqInterceptor]);

	const errorConfirmedHandler = () => {
		setError(null);
	};

	return [error, errorConfirmedHandler];
};
