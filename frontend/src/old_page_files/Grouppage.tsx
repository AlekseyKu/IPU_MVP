'use client';

import React, { Fragment } from 'react';
import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/ipu/Appfooter';
import Popupchat from '../components/Popupchat';

import Postview from '../components/ipu/Postview';
import Events from '../components/ipu/Events';
import Createpost from '../components/ipu/Createpost';
import Load from '../components/ipu/Load';
import Profilephoto from '../components/ipu/Profilephoto';
import ProfilecardOne from '../components/ProfilecardOne';
import Profiledetail from '../components/ipu/Profiledetail';

const Grouppage: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                                <ProfilecardOne />
                                <Profiledetail />
                                <Profilephoto />
                                <Events />
                            </div>
                            <div className="col-xl-8 col-xxl-9 col-lg-8 mt-3">
                                <Createpost />
                                <Postview id="32" postvideo="" postimage="post.png" avater="user.png" user="Surfiya Zakir" time="22 min ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Postview id="31" postvideo="" postimage="post.png" avater="user.png" user="David Goria" time="22 min ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Postview id="33" postvideo="" postimage="post.png" avater="user.png" user="Anthony Daugloi" time="2 hour ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Load />
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

export default Grouppage