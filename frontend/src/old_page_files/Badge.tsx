import React, { Fragment } from 'react';
import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Popupchat from '../components/Popupchat';
import Appfooter from '../components/ipu/Appfooter';
import Pagetitle from '../components/Pagetitle';



interface BadgeUser {
    imageUrl: string;
    name: string;
    email: string;
    connections: string;
    follower: string;
    following: string;
    badge1: string;
    badge2: string;
    badge3: string;
    badge4: string;
}

const badgeList: BadgeUser[] = [
    {
        imageUrl: 'user.png',
        name: 'Aliqa Macale',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: 'top-student.svg',
        badge2: 'onfire.svg',
        badge3: '',
        badge4: 'fast-graduate.svg',
    },
    {
        imageUrl: 'user.png',
        name: 'Hendrix Stamp',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: 'top-student.svg',
        badge2: 'onfire.svg',
        badge3: 'challenge-medal.svg',
        badge4: 'fast-graduate.svg',
    },
    {
        imageUrl: 'user.png',
        name: 'Stephen Grider',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: '',
        badge2: 'onfire.svg',
        badge3: 'challenge-medal.svg',
        badge4: 'fast-graduate.svg',
    },
    {
        imageUrl: 'user.png',
        name: 'Mohannad Zitoun',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: 'top-student.svg',
        badge2: '',
        badge3: 'challenge-medal.svg',
        badge4: 'fast-graduate.svg',
    },
    {
        imageUrl: 'user.png',
        name: 'Aliqa Macale',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: 'top-student.svg',
        badge2: 'onfire.svg',
        badge3: 'challenge-medal.svg',
        badge4: 'fast-graduate.svg',
    },
    {
        imageUrl: 'user.png',
        name: 'Surfiya Zakir',
        email: 'support@gmail.com',
        connections: '55.7k',
        follower: '105k',
        following: '71k',
        badge1: 'top-student.svg',
        badge2: 'onfire.svg',
        badge3: 'challenge-medal.svg',
        badge4: 'fast-graduate.svg',
    },
];

const Badge: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-xl-12">

                                <Pagetitle title="Badge" />

                                <div className="row ps-2 pe-1">
                                    {badgeList.map((value, index) => (
                                        <div key={index} className="col-md-4 col-sm-6 pe-2 ps-2">
                                            <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                                <div className="card-body d-block w-100 p-4 text-center">
                                                    <figure className="avatar ms-auto me-auto mb-0 position-relative w90 z-index-1">
                                                        <img
                                                            src={`assets/images/${value.imageUrl}`}
                                                            alt="avatar"
                                                            className="float-right p-1 bg-white rounded-circle w-100"
                                                        />
                                                    </figure>
                                                    <div className="clearfix"></div>
                                                    <h4 className="fw-700 font-xss mt-3 mb-0">{value.name}</h4>
                                                    <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">{value.email}</p>
                                                    <ul className="d-flex align-items-center justify-content-center mt-1">
                                                        <li className="m-2">
                                                            <h4 className="fw-700 font-sm">
                                                                {value.connections}
                                                                <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">Connections</span>
                                                            </h4>
                                                        </li>
                                                        <li className="m-2">
                                                            <h4 className="fw-700 font-sm">
                                                                {value.follower}
                                                                <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">Follower</span>
                                                            </h4>
                                                        </li>
                                                        <li className="m-2">
                                                            <h4 className="fw-700 font-sm">
                                                                {value.following}
                                                                <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">Followings</span>
                                                            </h4>
                                                        </li>
                                                    </ul>
                                                    <ul className="d-flex align-items-center justify-content-center mt-1">
                                                        {[value.badge1, value.badge2, value.badge3, value.badge4].map(
                                                            (badge, i) =>
                                                                badge && (
                                                                    <li key={i} className="m-1">
                                                                        <img src={`assets/images/${badge}`} alt="badge" />
                                                                    </li>
                                                                )
                                                        )}
                                                    </ul>
                                                    <a
                                                        href="#follow"
                                                        className="mt-4 p-0 btn p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white"
                                                    >
                                                        FOLLOW
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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

export default Badge