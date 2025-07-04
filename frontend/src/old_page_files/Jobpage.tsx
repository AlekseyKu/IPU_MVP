'use client';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Pagetitle from '../components/Pagetitle';
import Appfooter from '../components/ipu/Appfooter';
import Popupchat from '../components/Popupchat';

const jobList = [
    {
        imageUrl: 'download7.png',
        title: 'Python Developer',
        location: 'support@gmail.com',
        employment: 'London, United Kingdom',
        salary: 'Part Time',
        following: '12000 -45000',
        date: '3 days ago',
    },
    {
        imageUrl: 'download4.png',
        title: 'Sass Developer',
        location: 'support@gmail.com',
        employment: 'London, United Kingdom',
        salary: 'Part Time',
        following: '44000 - 45000',
        date: '4 days ago',
    },
    {
        imageUrl: 'download6.png',
        title: 'Java Developer',
        location: 'support@gmail.com',
        employment: 'London, United Kingdom',
        salary: 'Part Time',
        following: '12000 -45000',
        date: '6 days ago',
    },
    {
        imageUrl: 'download5.png',
        title: 'React Developer',
        location: 'support@gmail.com',
        employment: 'London, United Kingdom',
        salary: 'Part Time',
        following: '12000 -45000',
        date: '9 days ago',
    },
];

const Job: React.FC = () => {
    const position: [number, number] = [59.955413, 30.337844];

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0" style={{ maxWidth: '100%' }}>
                        <div className="row">
                            <div className="col-xl-6 chat-left scroll-bar">
                                <Pagetitle title="Jobs" />

                                {jobList.map((value, index) => (
                                    <div
                                        key={index}
                                        className="card d-block w-100 border-0 mb-3 shadow-xss bg-white rounded-3 pe-4 pt-4 pb-4"
                                        style={{ paddingLeft: '120px' }}
                                    >
                                        <img
                                            src={`assets/images/${value.imageUrl}`}
                                            alt="job-avatar"
                                            className="position-absolute p-2 bg-lightblue2 w65 ms-4 left-0"
                                        />
                                        <i className="feather-bookmark font-md text-grey-500 position-absolute right-0 me-3"></i>
                                        <h4 className="font-xss fw-700 text-grey-900 mb-3 pe-4">
                                            {value.title}{' '}
                                            <span className="font-xssss fw-500 text-grey-500 ms-4">({value.date})</span>
                                        </h4>
                                        <h5 className="font-xssss mb-2 text-grey-500 fw-600">
                                            <span className="text-grey-900 font-xssss text-dark">Location: </span>{' '}
                                            {value.employment}
                                        </h5>
                                        <h5 className="font-xssss mb-2 text-grey-500 fw-600">
                                            <span className="text-grey-900 font-xssss text-dark">Employment: </span>
                                            {value.salary}
                                        </h5>
                                        <h5 className="font-xssss text-grey-500 fw-600 mb-3">
                                            <span className="text-grey-900 font-xssss text-dark">Salary: </span>{' '}
                                            {value.following}
                                        </h5>
                                        <h6 className="d-inline-block p-2 text-success alert-success fw-600 font-xssss rounded-3 me-2">
                                            UX Design
                                        </h6>
                                        <h6 className="d-inline-block p-2 text-warning alert-warning fw-600 font-xssss rounded-3 me-2">
                                            Android
                                        </h6>
                                        <h6 className="d-inline-block p-2 text-secondary alert-secondary fw-600 font-xssss rounded-3 me-2">
                                            Developer
                                        </h6>
                                        <Link to="/defaultjob" className="position-absolute bottom-15 mb-3 right-15">
                                            <i className="btn-round-sm bg-primary-gradiant text-white font-sm feather-chevron-right"></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="col-xl-6 ps-0 d-none d-xl-block">
                                <div className="card w-100 border-0 shadow-none rounded-3 mb-4 overflow-hidden">
                                    <div style={{ height: '86vh', width: '100%' }}>
                                        <MapContainer
                                            center={position}
                                            zoom={11}
                                            scrollWheelZoom={false}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={position}>
                                                <Popup>My Marker</Popup>
                                            </Marker>
                                        </MapContainer>
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
    );
};

export default Job;
