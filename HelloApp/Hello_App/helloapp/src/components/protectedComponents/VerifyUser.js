import React from "react"; 
import useAuth from "../../hooks/usefulHooks/useAuth";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePostHook from "../../hooks/httpHooks/usePostHook";
import "./verifyUser.scss";

export const VerifyUser = () => {
  const { auth, setAuth } = useAuth();
  const POST = usePostHook();

  let [getValue, setValue] = useState({
    input: "",
    otpStatus: "",
    error: {},
  });
 
  let navigate = useNavigate();
  let from = "/";

  function validUser(data) { 
    let { user, accessToken } = data;
    setAuth({ user, accessToken });
    navigate(from, { replace: true });
  }

  async function submitData(e) {
    e.preventDefault();
    let response = await POST({ code: getValue.input }, "verify/user/account");
    if (response?.error) {
      const { message, status } = response.error;
      setValue((rest) => ({
        ...rest,
        error: {
          message: message,
          status: status,
        },
      }));
    } else {
      validUser(response?.data);
    }
  }

  async function resend(e) {
    e.preventDefault();
    let { email } = auth;
    let response = await POST({ email: email }, "resend");
    setValue((rest) => ({
      ...rest,
      otpStatus: response?.message,
    }));
  }

  return (
    <div>
      <div id="verify-info-container">
        <h2 className="verify_email verify_email_in_edit">
          Email Verificaiton
        </h2>
        <div id="hint">
          <p>We've sent a verificaion code to your email - {auth.email}</p>
        </div>

        <form onSubmit={submitData}>
          <div className="verificaion-input-box">
            <input
              className={
                getValue.error.message === "invalid verification code"
                  ? "verificaion-input formError"
                  : "verificaion-input"
              }
              type="input"
              name="code"
              value={getValue.input}
              onChange={(e) =>
                /(^[0-9]*$)/.test(e.target.value)
                  ? setValue((rest) => ({
                      ...rest,
                      input: e.target.value,
                      error: "",
                    }))
                  : ""
              }
              maxLength="6"
              required
            />

            {getValue.error.message === "invalid verification code" ? (
              <div className="errors">
                <i className="fas fa-exclamation-circle"></i>
                <span> {getValue.error.message}</span>
              </div>
            ) : (
              ""
            )}
            <input
              className="verificaion-input submit-form"
              type="submit"
              value="Submit"
            />

            <input
              type="button"
              onClick={resend}
              value={getValue.otpStatus ? getValue.otpStatus : "Resend OTP"}
              className="verificaion-input submit-form"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
