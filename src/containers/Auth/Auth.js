import React, { useState, useEffect } from "react";

import { Redirect } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { updateObject, checkValidity } from "../../shared/utility";

const auth = (props) => {
	const [controls, setControls] = useState({
		email: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "E-mail Address",
			},
			value: "",
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		password: {
			elementType: "input",
			elementConfig: {
				type: "password",
				placeholder: "Password",
			},
			value: "",
			validation: {
				required: true,
				minLength: 6,
			},
			valid: false,
			touched: false,
		},
	});

	const [isSignUp, setIsSignUp] = useState(true);

	const { redirectionPath, burgerBuilding, onSetAuthRedirectionPath } = props;

	useEffect(() => {
		if (redirectionPath === "/checkout" && !burgerBuilding) {
			onSetAuthRedirectionPath();
		}
	}, [redirectionPath, burgerBuilding, onSetAuthRedirectionPath]);

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(controls, {
			[controlName]: updateObject(controls[controlName], {
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation
				),
				touched: true,
			}),
		});
		setControls(updatedControls);
	};

	const submitHandler = (event) => {
		event.preventDefault();
		props.onAuth(controls.email.value, controls.password.value, isSignUp);
	};

	const switchFrom = () => {
		setIsSignUp(!isSignUp);
	};

	const formElementsArray = [];
	for (let key in controls) {
		formElementsArray.push({
			id: key,
			config: controls[key],
		});
	}

	let form = formElementsArray.map((el) => (
		<Input
			key={el.id}
			elementType={el.config.elementType}
			elementConfig={el.config.elementConfig}
			value={el.config.value}
			invalid={!el.config.valid}
			shouldValidate={el.config.validation}
			touched={el.config.touched}
			changed={(event) => inputChangedHandler(event, el.id)}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.redirectionPath} />;
	}
	return (
		<div className={classes.Auth}>
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">Submit</Button>
			</form>
			{props.error ? (
				<p style={{ color: "red" }}>{props.error.message}</p>
			) : null}
			<Button clicked={switchFrom} btnType="Danger">
				switch to {isSignUp ? "Sign in" : "Sign up"}
			</Button>
			{authRedirect}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		redirectionPath: state.auth.authRedirectionPath,
		burgerBuilding: state.burgerBuilder.building,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(actions.auth(email, password, isSignUp)),
		onSetAuthRedirectionPath: () =>
			dispatch(actions.setAuthRedirectionPath("/")),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);
