import React, { useEffect, useState } from 'react';

type ChatMember = {
    imageUrl: string;
    name: string;
    status: string;
};

const chatMembers: ChatMember[] = [
    { imageUrl: 'user.png', name: 'Hurin Seary', status: 'bg-success' },
    { imageUrl: 'user.png', name: 'Victor Exrixon', status: 'bg-success' },
    { imageUrl: 'user.png', name: 'Surfiya Zakir', status: 'bg-warning' },
    { imageUrl: 'user.png', name: 'Goria Coast', status: 'bg-danger' },
    { imageUrl: 'user.png', name: 'Hurin Seary', status: 'bg-success' },
    { imageUrl: 'user.png', name: 'David Goria', status: 'bg-success' },
    { imageUrl: 'user.png', name: 'Seary Victor', status: 'bg-success' },
    { imageUrl: 'user.png', name: 'Ana Seary', status: 'bg-success' },
];

const Rightchat: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: 800,
        height: 182,
    });

    const updateDimensions = () => {
        if (window.innerWidth < 500) {
            setDimensions({ width: 450, height: 102 });
        } else {
            const updateWidth = window.innerWidth - 100;
            const updateHeight = Math.round(updateWidth / 4.4);
            setDimensions({ width: updateWidth, height: updateHeight });
        }
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);
    const menuClass = isOpen ? 'd-block' : '';

    return (
        <div
            id="main-content-wrap"
            className={`right-chat nav-wrap mt-2 right-scroll-bar ${dimensions.width > 1500 ? 'active-sidebar' : ''
                }`}
        >
            <div className="middle-sidebar-right-content bg-white shadow-xss rounded-xxl">
                <div className="section full pe-3 ps-4 pt-4 position-relative feed-body">
                    <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">CONTACTS</h4>
                    <ul className="list-group list-group-flush">
                        {chatMembers.map((member, index) => (
                            <li
                                key={index}
                                className="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center"
                            >
                                <figure className="avatar float-left mb-0 me-2">
                                    <img
                                        src={`/assets/images/${member.imageUrl}`}
                                        alt="avatar"
                                        className="w35 rounded-pill"
                                    />
                                </figure>
                                <h3 className="fw-700 mb-0 mt-0">
                                    <span
                                        className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer"
                                        onClick={toggleOpen}
                                    >
                                        {member.name}
                                    </span>
                                </h3>
                                <span className={`${member.status} ms-auto btn-round-xss`}></span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GROUPS Section */}
                <div className="section full pe-3 ps-4 pt-4 pb-4 position-relative feed-body">
                    <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">GROUPS</h4>
                    <ul className="list-group list-group-flush">
                        <li className="bg-transparent list-group-item d-flex align-items-center ps-0 pe-0">
                            <span className="btn-round-sm bg-primary-gradiant me-3 ls-3 text-white font-xssss fw-700">UD</span>
                            <h3 className="fw-700 mb-0 mt-0">
                                <span onClick={toggleOpen} className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer">Studio Express</span>
                            </h3>
                            <span className="badge mt-0 text-grey-500 badge-pill pe-0 font-xsssss">2 min</span>
                        </li>
                        <li className="bg-transparent list-group-item d-flex align-items-center ps-0 pe-0">
                            <span className="btn-round-sm bg-gold-gradiant me-3 ls-3 text-white font-xssss fw-700">AR</span>
                            <h3 className="fw-700 mb-0 mt-0">
                                <span onClick={toggleOpen} className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer">Armany Design</span>
                            </h3>
                            <span className="bg-warning ms-auto btn-round-xss"></span>
                        </li>
                        <li className="bg-transparent list-group-item d-flex align-items-center ps-0 pe-0">
                            <span className="btn-round-sm bg-mini-gradiant me-3 ls-3 text-white font-xssss fw-700">UD</span>
                            <h3 className="fw-700 mb-0 mt-0">
                                <span onClick={toggleOpen} className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer">De fabous</span>
                            </h3>
                            <span className="bg-success ms-auto btn-round-xss"></span>
                        </li>
                    </ul>
                </div>

                {/* PAGES Section */}
                <div className="section full pe-3 ps-4 pt-0 pb-4 position-relative feed-body">
                    <h4 className="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">Pages</h4>
                    <ul className="list-group list-group-flush">
                        <li className="bg-transparent list-group-item d-flex align-items-center ps-0 pe-0">
                            <span className="btn-round-sm bg-primary-gradiant me-3 ls-3 text-white font-xssss fw-700">AB</span>
                            <h3 className="fw-700 mb-0 mt-0">
                                <span onClick={toggleOpen} className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer">Armany Seary</span>
                            </h3>
                            <span className="bg-success ms-auto btn-round-xss"></span>
                        </li>
                        <li className="bg-transparent list-group-item d-flex align-items-center ps-0 pe-0">
                            <span className="btn-round-sm bg-gold-gradiant me-3 ls-3 text-white font-xssss fw-700">SD</span>
                            <h3 className="fw-700 mb-0 mt-0">
                                <span onClick={toggleOpen} className="font-xssss text-grey-600 d-block text-dark model-popup-chat pointer">Entropio Inc</span>
                            </h3>
                            <span className="bg-success ms-auto btn-round-xss"></span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Chat Popup Modal */}
            <div className={`modal-popup-chat ${menuClass}`}>
                <div className="modal-popup-wrap bg-white p-0 shadow-lg rounded-3">
                    <div className="modal-popup-header w-100 border-bottom">
                        <div className="card p-3 d-block border-0">
                            <figure className="avatar mb-0 float-left me-2">
                                <img src="/assets/images/user.png" alt="avatar" className="w35 me-1 rounded-pill" />
                            </figure>
                            <h5 className="fw-700 text-primary font-xssss mt-1 mb-1">Hendrix Stamp</h5>
                            <h4 className="text-grey-500 font-xsssss mt-0 mb-0">
                                <span className="d-inline-block bg-success btn-round-xss m-0"></span> Available
                            </h4>
                            <div className="font-xssss position-absolute right-0 top-0 mt-3 me-4 pointer" onClick={toggleOpen}>
                                <i className="ti-close text-grey-900 mt-2 d-inline-block"></i>
                            </div>
                        </div>
                    </div>
                    <div className="modal-popup-body w-100 p-3 h-auto">
                        <div className="message">
                            <div className="message-content font-xssss lh-24 fw-500">Hi, how can I help you?</div>
                        </div>
                        <div className="date-break font-xsssss lh-24 fw-500 text-grey-500 mt-2 mb-2">Mon 10:20am</div>
                        <div className="message self text-right mt-2">
                            <div className="message-content font-xssss lh-24 fw-500">
                                I want those files for you. I want you to send 1 PDF and 1 image file.
                            </div>
                        </div>
                        <div className="snippet pt-3 ps-4 pb-2 pe-3 mt-2 bg-grey rounded-xl float-right">
                            <div className="stage"><div className="dot-typing"></div></div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="modal-popup-footer w-100 border-top">
                        <div className="card p-3 d-block border-0">
                            <div className="form-group icon-right-input style1-input mb-0">
                                <input
                                    type="text"
                                    placeholder="Start typing.."
                                    className="form-control rounded-xl bg-greylight border-0 font-xssss fw-500 ps-3"
                                />
                                <i className="feather-send text-grey-500 font-md"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rightchat;
