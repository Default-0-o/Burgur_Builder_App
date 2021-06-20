import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import { updateObject, checkValidity } from "../../shared/utility";

class Auth extends Component {
	state = {
		controls: {
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
		},
		isSignUp: true,
	};

	componentDidMount() {
		if (
			this.props.redirectionPath === "/checkout" &&
			!this.props.burgerBuilding
		) {
			this.props.onSetAuthRedirectionPath();
		}
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: updateObject(this.state.controls[controlName], {
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
				touched: true,
			}),
		});
		this.setState({ controls: updatedControls });
	};

	submitHandler = (event) => {
		event.preventDefault();
		this.props.onAuth(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignUp
		);
	};

	switchFrom = () => {
		this.setState((pervState) => {
			return {
				isSignUp: !pervState.isSignUp,
			};
		});
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
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
				changed={(event) => this.inputChangedHandler(event, el.id)}
			/>
		));

		if (this.props.loading) {
			form = <Spinner />;
		}

		let authRedirect = null;
		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={this.props.redirectionPath} />;
		}
		return (
			<div className={classes.Auth}>
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">Submit</Button>
				</form>
				{this.props.error ? (
					<p style={{ color: "red" }}>{this.props.error.message}</p>
				) : null}
				<Button clicked={this.switchFrom} btnType="Danger">
					switch to {this.state.isSignUp ? "Sign in" : "Sign up"}
				</Button>
				{authRedirect}
			</div>
		);
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
