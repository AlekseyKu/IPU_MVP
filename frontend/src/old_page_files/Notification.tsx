'use client';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/ipu/Appfooter';
import Popupchat from '../components/Popupchat';

type NotificationItem = {
    imageUrl: string;
    name: string;
    status: string;
    subject: string;
    des: string;
    attach: string;
    time: string;
    read: string;
};

const notiList: NotificationItem[] = [
    {
        imageUrl: 'user.png',
        name: 'Hurin Seary',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '12 minute ago',
        read: 'bg-lightblue theme-light-bg',
    },
    {
        imageUrl: 'user.png',
        name: 'Victor Exrixon',
        status: 'feather-thumbs-up bg-primary-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '45 minute ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Surfiya Zakir',
        status: 'feather-thumbs-up bg-primary-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '1 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Goria Coast',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '2 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Hurin Seary',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '5 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'David Goria',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '12 hour ago',
        read: ''
    },

    {
        imageUrl: 'user.png',
        name: 'Hurin Seary',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '12 minute ago',
        read: 'bg-lightblue theme-light-bg'
    },
    {
        imageUrl: 'user.png',
        name: 'Victor Exrixon',
        status: 'feather-thumbs-up bg-primary-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '45 minute ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Surfiya Zakir',
        status: 'feather-thumbs-up bg-primary-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '1 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Goria Coast',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '2 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'Hurin Seary',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '5 hour ago',
        read: ''
    },
    {
        imageUrl: 'user.png',
        name: 'David Goria',
        status: 'feather-heart bg-red-gradiant',
        subject: 'Mobile App Design',
        des: 'UI/UX Community : Mobile Apps UI Designer is required for Tech… ',
        attach: 'attach',
        time: '12 hour ago',
        read: 'bg-lightblue theme-light-bg'
    },
];

const NotificationPage: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content theme-dark-bg right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="chat-wrapper p-3 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                                    <h2 className="fw-700 mb-4 mt-2 font-md text-grey-900 d-flex align-items-center">
                                        Notification
                                        <span className="circle-count bg-warning text-white font-xsssss rounded-3 ms-2 ls-3 fw-600 p-2 mt-0">
                                            23
                                        </span>
                                        <Link to="/defaultnotification" className="ms-auto btn-round-sm bg-greylight rounded-3">
                                            <i className="feather-hard-drive font-xss text-grey-500"></i>
                                        </Link>
                                        <Link to="/defaultnotification" className="ms-2 btn-round-sm bg-greylight rounded-3">
                                            <i className="feather-alert-circle font-xss text-grey-500"></i>
                                        </Link>
                                        <Link to="/defaultnotification" className="ms-2 btn-round-sm bg-greylight rounded-3">
                                            <i className="feather-trash-2 font-xss text-grey-500"></i>
                                        </Link>
                                    </h2>

                                    <ul className="notification-box">
                                        {notiList.map((value, index) => (
                                            <li key={index}>
                                                <Link
                                                    to="/defaultnotification"
                                                    className={`d-flex align-items-center p-3 rounded-3 ${value.read}`}
                                                >
                                                    <img
                                                        src={`assets/images/${value.imageUrl}`}
                                                        alt={value.name}
                                                        className="w45 me-3 rounded-pill"
                                                    />
                                                    <i
                                                        className={`text-white me-2 font-xssss notification-react ${value.status}`}
                                                    ></i>
                                                    <h6 className="font-xssss text-grey-900 mb-0 mt-0 fw-500 lh-20">
                                                        <strong>{value.name}</strong> posted in : {value.des}
                                                        <span className="d-block text-grey-500 font-xssss fw-600 mb-0 mt-0 ms-auto">
                                                            {value.time}
                                                        </span>
                                                    </h6>
                                                    <i className="ti-more-alt text-grey-500 font-xs ms-auto"></i>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />
        </Fragment>
    );
};

export default NotificationPage;
