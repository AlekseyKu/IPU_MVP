'use client';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

const Checkout: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />


            <div className="main-content right-chat-active bg-white">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" >
                        <div className="row">
                            <div className="col-xl-12 cart-wrapper mb-4">
                                <div className="row">
                                    <div className="col-lg-12 mb-3">
                                        <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                                            <div className="bg-pattern-div"></div>
                                            <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">Checkout <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block">4 PRODUCT FOUND</span></h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card bg-greyblue border-0 p-4 mb-5">
                                            <p className="mb-0 mont-font font-xssss text-uppercase fw-600 text-grey-500"><i className="fa fa-exclamation-circle"></i> Have A Coupon? <Link className="expand-btn text-grey-500 fw-700" to="/checkoutcoupon_info">Click Here To Enter Your Code.</Link></p>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <div className="page-title">
                                            <h4 className="mont-font fw-600 font-md mb-lg-5 mb-4">Billing address</h4>
                                            <form action="#">
                                                <div className="row">
                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">First Name</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Last Name</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Email</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Phone</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-12 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Country</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Address</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Twon / City</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <div className="form-gorup">
                                                            <label className="mont-font fw-600 font-xssss">Postcode</label>
                                                            <input type="text" name="comment-name" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <div className="form-check text-left mb-3">
                                                            <input type="checkbox" className="form-check-input mt-2" id="exampleCheck1" />
                                                            <label className="pt--1 form-check-label fw-600 font-xsss text-grey-700" >Create an acount ?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            <h4 className="mont-font fw-600 font-md mb-5">Shipping address</h4>
                                            <div className="form-check text-left mb-3 mt-2">
                                                <input type="checkbox" className="form-check-input mt-2" id="exampleCheck2" />
                                                <label className="pt--1 form-check-label fw-600 font-xsss text-grey-700" >Ship to a different address ?</label>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-xl-5 offset-xl-1 col-lg-6">
                                        <div className="order-details">
                                            <h4 className="mont-font fw-600 font-md mb-5">Order Details</h4>
                                            <div className="table-content table-responsive mb-5 card border-0 bg-greyblue p-lg-5 p-4">
                                                <table className="table order-table order-table-2 mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">Product</th>
                                                            <th className="text-right border-0">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th className="text-grey-500 fw-500 font-xsss">Aliquam lobortis est
                                                                <strong><span>✕</span>1</strong>
                                                            </th>
                                                            <td className="text-right text-grey-500 fw-500 font-xsss">$80.00</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-grey-500 fw-500 font-xsss">Auctor gravida enim
                                                                <strong><span>✕</span>1</strong>
                                                            </th>
                                                            <td className="text-right text-grey-500 fw-500 font-xsss">$60.00</td>
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="cart-subtotal">
                                                            <th>Subtotal</th>
                                                            <td className="text-right text-grey-700 font-xsss fw-700">$56.00</td>
                                                        </tr>
                                                        <tr className="shipping">
                                                            <th>Shipping</th>
                                                            <td className="text-right">
                                                                <span className="text-grey-700 font-xsss fw-700">Flat Rate; $20.00</span>
                                                            </td>
                                                        </tr>
                                                        <tr className="order-total">
                                                            <th>Order Total</th>
                                                            <td className="text-right text-grey-700 font-xsss fw-700"><span className="order-total-ammount">$56.00</span></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            <div className="checkout-payment card border-0 mb-3 bg-greyblue p-lg-5 p-4">
                                                <form action="#" className="payment-form">
                                                    <div className="payment-group mb-4">
                                                        <div className="payment-radio">
                                                            <input type="radio" value="bank" name="payment-method" id="bank" checked />
                                                            <label className="payment-label fw-600 font-xsss text-grey-900 ms-2" >Direct Bank Transfer</label>
                                                        </div>
                                                        <div className="payment-info" data-method="bank" >
                                                            <p className="font-xssss lh-24 text-grey-500 ps-4">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                                        </div>
                                                    </div>
                                                    <div className="payment-group mb-4">
                                                        <div className="payment-radio">
                                                            <input type="radio" value="cheque" name="payment-method" id="cheque" />
                                                            <label className="payment-label fw-600 font-xsss text-grey-900 ms-2" >
                                                                Cheque payments
                                                            </label>
                                                        </div>
                                                        <div className="payment-info cheque hide-in-default" data-method="cheque">
                                                            <p className="font-xssss lh-24 text-grey-500 ps-4">Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.</p>
                                                        </div>
                                                    </div>
                                                    <div className="payment-group mb-0">
                                                        <div className="payment-radio">
                                                            <input type="radio" value="cash" name="payment-method" id="cash" />
                                                            <label className="payment-label fw-600 font-xsss text-grey-900 ms-2" >
                                                                Cash on Delivary
                                                            </label>
                                                        </div>
                                                        <div className="payment-info cash hide-in-default" data-method="cash">
                                                            <p className="font-xssss lh-24 text-grey-500 ps-4">Pay with cash upon delivery.</p>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="clearfix"></div>

                                            <div className="card shadow-none border-0">
                                                <Link to="/checkout" className="w-100 p-3 mt-3 font-xsss text-center text-white bg-current rounded-3 text-uppercase fw-600 ls-3">Place Order</Link>
                                            </div>



                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />
        </Fragment>
    )
}

export default Checkout