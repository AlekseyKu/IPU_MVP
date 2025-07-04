'use client';

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ipu/Header';
import Leftnav from '../components/ipu/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/ipu/Appfooter';
import Popupchat from '../components/Popupchat';

interface Product {
    imageUrl: string;
    name: string;
    price: string;
}

const productList: Product[] = [
    {
        imageUrl: 'product.png',
        name: 'Textured Sleeveless Camisole',
        price: '449',
    },
    {
        imageUrl: 'product.png',
        name: 'Adjustable Shoulder Straps',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Neck Strappy Camisole',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Scoop-Neck Strappy',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Butler Stool Ladder',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Butler Stool Ladder',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Butler Stool Ladder',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Butler Stool Ladder',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Textured Sleeveless Camisole',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Adjustable Shoulder Straps',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Neck Strappy Camisole',
        price:'449'
    },
    {
        imageUrl: 'product.png',
        name: 'Scoop-Neck Strappy',
        price:'449'
    },
];

const ShopOne: React.FC = () => {
    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content bg-white right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12 col-lg-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                                            <div className="bg-pattern-div"></div>
                                            <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                                                Shop{' '}
                                                <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block">
                                                    32 PRODUCT FOUND
                                                </span>
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 mt-3 d-flex justify-content-between align-items-center">
                                        <h4 className="font-xssss fw-700 text-grey-500 text-uppercase ls-3 mt-2 pt-1">
                                            32 Product found
                                        </h4>
                                        <select className="searchCat sort">
                                            <option value="">Default Sorting</option>
                                            <option value="151781441596">Fashion</option>
                                            <option value="139119624252">- Men</option>
                                            <option value="139118313532">- Women</option>
                                            <option value="139360141372">Electronics</option>
                                            <option value="152401903676">Home &amp; Garden</option>
                                            <option value="138866720828">- Decor</option>
                                            <option value="138866917436">- Lighting</option>
                                        </select>
                                    </div>

                                    {productList.map((product, index) => (
                                        <div key={index} className="col-lg-4 col-md-6">
                                            <div className="card w-100 border-0 mt-4">
                                                <div className="card-image w-100 p-0 text-center bg-greylight rounded-3 mb-2">
                                                    <Link to="/singleproduct">
                                                        <img
                                                            src={`assets/images/${product.imageUrl}`}
                                                            alt={product.name}
                                                            className="w-100 mt-0 mb-0 p-5"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="card-body w-100 p-0 text-center">
                                                    <h2 className="mt-2 mb-1">
                                                        <Link
                                                            to="/singleproduct"
                                                            className="text-black fw-700 font-xsss lh-26"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    </h2>
                                                    <h6 className="font-xsss fw-600 text-grey-500 ls-2">
                                                        ${product.price}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="col-lg-12 mt-3 mb-5 text-center">
                                        <Link
                                            to="/shop1"
                                            className="fw-700 text-white font-xssss text-uppercase ls-3 lh-32 rounded-3 mt-3 d-inline-block p-2 bg-current w150"
                                        >
                                            Load More
                                        </Link>
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

export default ShopOne;
