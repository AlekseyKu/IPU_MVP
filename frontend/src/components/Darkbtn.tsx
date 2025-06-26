// frontend\src\components\Darkbtn.tsx
'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Отключаем SSR для компонента
const DarkMode: React.FC = () => {
    const clickedClass = 'clicked';
    const lightTheme = 'theme-light';
    const darkTheme = 'theme-dark';

    const [theme, setTheme] = useState<string>(lightTheme);
    const [isMounted, setIsMounted] = useState(false);

    // Инициализация темы только на клиенте после монтирования
    useEffect(() => {
        setIsMounted(true);
        const savedTheme = localStorage.getItem('theme') || lightTheme;
        setTheme(savedTheme);
        document.body.classList.add(savedTheme);
    }, []);

    // Обновление классов и localStorage при изменении темы
    useEffect(() => {
        if (isMounted) {
            document.body.classList.remove(lightTheme, darkTheme);
            document.body.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme, isMounted]);

    const switchTheme = () => {
        setTheme(prev => (prev === darkTheme ? lightTheme : darkTheme));
    };

    // Не рендерим ничего, пока компонент не смонтирован на клиенте
    if (!isMounted) {
        return null;
    }

    return (
        <span
            className={`pointer p-2 text-center ms-3 menu-icon chat-active-btn ${theme === darkTheme ? clickedClass : ''}`}
            onClick={switchTheme}
        >
            <i className="feather-moon font-xl text-current"></i>
        </span>
    );
};

// Экспортируем компонент с отключением SSR
export default dynamic(() => Promise.resolve(DarkMode), { ssr: false });