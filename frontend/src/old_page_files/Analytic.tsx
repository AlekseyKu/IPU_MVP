'use client';

import { FC, Fragment, useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/ipu/Appfooter';
import Popupchat from '../components/Popupchat';

const Analytics: FC = () => {
    const [series] = useState([
        {
            name: 'Product A',
            data: [35, 66, 34, 56, 18, 35, 66, 34, 56, 18, 56, 18],
        },
        {
            name: 'Product B',
            data: [12, 34, 12, 11, 7, 12, 34, 12, 11, 7, 11, 7],
        },
    ]);

    const [chartOptions] = useState<ApexOptions>({
        chart: {
            type: 'bar',
            height: 250,
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        legend: {
            show: false,
        },
        fill: {
            opacity: 1,
        },
    });

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content bg-white right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card w-100 border-0 shadow-none p-5 rounded-xxl bg-lightblue2 mb-3">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <img
                                                src="assets/images/product.png"
                                                alt="banner"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="col-lg-6 ps-lg-5">
                                            <h2 className="display1-size d-block mb-2 text-grey-900 fw-700">
                                                Set up your Social website with Sociala
                                            </h2>
                                            <p className="font-xssss fw-500 text-grey-500 lh-26">
                                                After completing this course you'll be confident to create any subtle to complex animation that will turn any project a professional work.
                                            </p>
                                            <a
                                                href="/defaultanalytics"
                                                className="btn w200 border-0 bg-primary-gradiant p-3 text-white fw-600 rounded-3 d-inline-block font-xssss"
                                            >
                                                Analysis
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {[
                                {
                                    color: '#e5f6ff',
                                    icon: 'feather-home',
                                    value: '2.3M',
                                    label: 'day visiter',
                                    textColor: 'text-primary',
                                    iconBg: 'bg-primary-gradiant',
                                },
                                {
                                    color: '#f6f3ff',
                                    icon: 'feather-lock',
                                    value: '44.6K',
                                    label: 'total user',
                                    textColor: 'text-secondary',
                                    iconBg: 'bg-secondary',
                                },
                                {
                                    color: '#e2f6e9',
                                    icon: 'feather-command',
                                    value: '603',
                                    label: 'monthly sale',
                                    textColor: 'text-success',
                                    iconBg: 'bg-success',
                                },
                                {
                                    color: '#fff0e9',
                                    icon: 'feather-shopping-bag',
                                    value: '3M',
                                    label: 'day visiter',
                                    textColor: 'text-warning',
                                    iconBg: 'bg-warning',
                                },
                            ].map((item, idx) => (
                                <div className="col-lg-3 pe-2 ps-2" key={idx}>
                                    <div
                                        className="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3"
                                        style={{ background: item.color }}
                                    >
                                        <div className="card-body d-flex p-0">
                                            <i
                                                className={`btn-round-lg d-inline-block me-3 ${item.iconBg} ${item.icon} font-md text-white`}
                                            ></i>
                                            <h4 className={`${item.textColor} font-xl fw-700`}>
                                                {item.value}
                                                <span className="fw-500 mt-0 d-block text-grey-500 font-xssss">
                                                    {item.label}
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="col-lg-12 mb-3">
                                <div className="card w-100 p-3 border-0 mb-3 rounded-xxl bg-lightblue2 shadow-none overflow-hidden">
                                    <Chart options={chartOptions} series={series} type="bar" width="100%" />
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

export default Analytics;
