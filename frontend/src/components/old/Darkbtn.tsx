import React, { useEffect, useState } from 'react';

const DarkMode: React.FC = () => {
    const clickedClass = 'clicked';
    const lightTheme = 'theme-light';
    const darkTheme = 'theme-dark';

    const [theme, setTheme] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || lightTheme;
        }
        return lightTheme;
    });

    useEffect(() => {
        const body = document.body;
        body.classList.remove(lightTheme, darkTheme);
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const switchTheme = () => {
        setTheme(prev => (prev === darkTheme ? lightTheme : darkTheme));
    };

    return (
        <span
            className={`pointer p-2 text-center ms-3 menu-icon chat-active-btn ${theme === darkTheme ? clickedClass : ''}`}
            onClick={switchTheme}
        >
            <i className="feather-moon font-xl text-current"></i>
        </span>
    );
};

export default DarkMode;
