import React, { Fragment } from 'react';
import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Popupchat from '../components/Popupchat';
import Appfooter from '../components/ipu/Appfooter';

import Load from '../components/ipu/Load';
import Createpost from '../components/ipu/Createpost';
import Storyslider from '../components/Storyslider';
import Memberslider from '../components/Memberslider';
import Friendsilder from '../components/Friendsilder';
import Postview from '../components/ipu/Postview';

import Friends from '../components/Friends';
import Contacts from '../components/Contacts';
import Group from '../components/Group';
import Events from '../components/ipu/Events';
import Profilephoto from '../components/ipu/Profilephoto';

const Home: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="row feed-body">
                            <div className="col-xl-8 col-xxl-9 col-lg-8">
                                <Storyslider />
                                <Createpost />
                                <Postview id="32" postvideo="" postimage="post.png" avater="user.png" user="Surfiya Zakir" time="22 min ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Postview id="31" postvideo="" postimage="post.png" avater="user.png" user="David Goria" time="22 min ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Postview id="33" postvideo="" postimage="post.png" avater="user.png" user="Anthony Daugloi" time="2 hour ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Memberslider />
                                <Postview id="35" postvideo="" postimage="post.png" avater="user.png" user="Victor Exrixon" time="3 hour ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Friendsilder />
                                <Postview id="36" postvideo="" postimage="post.png" avater="user.png" user="Victor Exrixon" time="12 hour ago" des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus." />
                                <Load />
                            </div>
                            <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                                <Friends />
                                <Contacts />
                                <Group />
                                <Events />
                                <Profilephoto />
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

export default Home;
