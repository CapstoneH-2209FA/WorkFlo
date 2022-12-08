// import React from "react";
// import { connect } from "react-redux";
// import { authenticate } from "../store/authSlice";

/**
 * COMPONENT
 */

const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div
      style={{
        backgroundImage:
          "url('https://live.staticflickr.com/1292/5179290237_63633e1bd7_b.jpg')",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        height: "calc(100vh - 200px)",
        color: "white",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid black",
          width: "80%",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,.5)",
        }}
        onSubmit={handleSubmit}
        name={name}
      >
        {displayName === "Sign Up" && (
          <>
            <label htmlFor="firstName">
              <small>First Name</small>
            </label>
            <input name="firstName" type="text" />

            <label htmlFor="lastName">
              <small>Last Name</small>
            </label>
            <input name="lastName" type="text" />
          </>
        )}
        <>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />

          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </>
        <div>
          <button type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: "login",
    displayName: "Login",
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const firstName = evt.target.firstName?.value;
      const lastName = evt.target.lastName?.value;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      dispatch(
        authenticate({ email, password, formName, firstName, lastName })
      );
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
