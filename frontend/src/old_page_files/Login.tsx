'use client';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    return (
        <Fragment>
            <div className="main-wrap">
                <div className="nav-header bg-transparent shadow-none border-0">
                    <div className="nav-top w-100">
                        <Link to="/"><i className="feather-zap text-success display1-size me-2 ms-0"></i><span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">Sociala. </span> </Link>
                        <button className="nav-menu me-0 ms-auto"></button>

                        <Link to="/login" className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl">Login</Link>
                        <Link to="/register" className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl">Register</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{ backgroundImage: `url("assets/images/login.svg")` }}></div>
                    <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                        <div className="card shadow-none border-0 ms-auto me-auto login-card">
                            <div className="card-body rounded-0 text-left">
                                <h2 className="fw-700 display1-size display2-md-size mb-3">Login into <br />your account</h2>
                                <form>

                                    <div className="form-group icon-input mb-3">
                                        <i className="font-sm ti-email text-grey-500 pe-0"></i>
                                        <input type="text" className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address" />
                                    </div>
                                    <div className="form-group icon-input mb-1">
                                        <input type="Password" className="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password" />
                                        <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                                    </div>
                                    <div className="form-check text-left mb-3">
                                        <input type="checkbox" className="form-check-input mt-2" id="exampleCheck5" />
                                        <label className="form-check-label font-xsss text-grey-500">Remember me</label>
                                        <Link to="/forgot" className="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</Link>
                                    </div>
                                </form>

                                <div className="col-sm-12 p-0 text-left">
                                    <div className="form-group mb-1"><a href="/login" className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Login</a></div>
                                    <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <a href="/register" className="fw-700 ms-1">Register</a></h6>
                                </div>
                                <div className="col-sm-12 p-0 text-center mt-2">

                                    <h6 className="mb-0 d-inline-block bg-white fw-500 font-xsss text-grey-500 mb-3">Or, Sign in with your social account </h6>
                                    <div className="form-group mb-1"><a href="/register" className="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 mb-2"><img src="assets/images/icon-1.png" alt="icon" className="ms-2 w40 mb-1 me-5" /> Sign in with Google</a></div>
                                    <div className="form-group mb-1"><a href="/register" className="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="assets/images/icon-3.png" alt="icon" className="ms-2 w40 mb-1 me-5" /> Sign in with Facebook</a></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default Login