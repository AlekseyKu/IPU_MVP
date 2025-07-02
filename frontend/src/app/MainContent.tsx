// // src/app/MainContent.tsx
// 'use client'

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { SupabaseClient } from '@supabase/supabase-js';
// import ProfilecardThree from '@/components/ProfilecardThree';
// import Profiledetail from '@/components/Profiledetail';
// import Createpost from '@/components/Createpost';
// import Postview from '@/components/Postview';
// import Load from '@/components/Load';
// import { AnimatePresence, motion } from 'framer-motion';

// interface MainContentProps {
//   supabase: SupabaseClient;
// }

// export default function MainContent({ supabase }: MainContentProps) {
//   const [showProfileDetail, setShowProfileDetail] = useState(false);
//   const [userData, setUserData] = useState<{ login: string; telegramId: number } | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     async function fetchUser() {
//       setIsLoading(true);
//       let telegramId: number | undefined;
//       let login: string | undefined;

//       console.time('Total fetch time');
//       console.time('Telegram data processing');

//       if (typeof window !== 'undefined') {
//         const urlParams = new URLSearchParams(window.location.hash.substring(1));
//         const tgWebAppData = urlParams.get('tgWebAppData');
//         if (!tgWebAppData) {
//           console.error('No tgWebAppData found');
//           setIsLoading(false);
//           return;
//         }

//         try {
//           const decodedData = decodeURIComponent(tgWebAppData);
//           const userDataFromWebApp = JSON.parse(decodedData.split('&user=')[1].split('&')[0]);
//           console.log('Parsed user data:', userDataFromWebApp);
//           if (userDataFromWebApp?.id) {
//             telegramId = userDataFromWebApp.id;
//             console.log('Telegram user ID from WebApp:', telegramId);
//           } else {
//             console.error('No user ID in tgWebAppData');
//           }
//         } catch (error) {
//           console.error('Parsing error:', error);
//           setIsLoading(false);
//           return;
//         }
//         console.timeEnd('Telegram data processing');
//       }

//       if (!telegramId && searchParams.get('telegram_id')) {
//         telegramId = parseInt(searchParams.get('telegram_id')!, 10);
//         login = 'testuser';
//         console.log('Fallback to URL param for local test:', telegramId, 'Login:', login);
//       }

//       if (!telegramId) {
//         setUserData({ login: 'Guest', telegramId: 0 });
//         setIsLoading(false);
//         return;
//       }

//       console.time('Supabase query');
//       const { data, error } = await supabase
//         .from('users')
//         .select('telegram_id, username')
//         .eq('telegram_id', telegramId)
//         .single();

//       console.log('Supabase response:', { data, error });
//       console.timeEnd('Supabase query');

//       if (error || !data) {
//         console.error('Error fetching user from Supabase:', error?.message);
//         setUserData({ login: 'Guest', telegramId });
//       } else {
//         setUserData({ login: data.username || 'Guest', telegramId: data.telegram_id });
//       }
//       setIsLoading(false);
//       console.timeEnd('Total fetch time');
//     }

//     fetchUser();
//   }, [searchParams, supabase]);

//   if (isLoading) {
//     return <div className="text-center p-5">Loading...</div>;
//   }

//   return (
//     <div className="main-content">
//       <div className="middle-sidebar-bottom">
//         <div className="middle-sidebar-left pe-0">
//           <div className="row">
//             <div className="col-xl-12 mb-3">
//               <ProfilecardThree
//                 onToggleDetail={() => setShowProfileDetail((prev) => !prev)}
//                 isOpen={showProfileDetail}
//                 login={userData?.login}
//                 telegramId={userData?.telegramId}
//               />
//             </div>

//             <div className="col-xl-4 col-xxl-3 col-lg-4">
//               <AnimatePresence>
//                 {showProfileDetail && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 40 }}
//                     transition={{ duration: 0.3, ease: 'easeOut' }}
//                   >
//                     <Profiledetail login={userData?.login} telegramId={userData?.telegramId} />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <div className="col-xl-8 col-xxl-9 col-lg-8">
//               <Createpost />
//               <Postview
//                 id="32"
//                 postvideo="postvideo.mp4"
//                 postimage="post.png"
//                 avater="user.png"
//                 user={userData?.login || 'Guest'}
//                 time="22 min ago"
//                 des="Lorem ipsum dolor sit amet..."
//               />
//               <Postview
//                 id="31"
//                 postvideo="postvideo.mp4"
//                 postimage="post.png"
//                 avater="user.png"
//                 user={userData?.login || 'Guest'}
//                 time="22 min ago"
//                 des="Lorem ipsum dolor sit amet..."
//               />
//               <Postview
//                 id="33"
//                 postvideo="postvideo.mp4"
//                 postimage="post.png"
//                 avater="user.png"
//                 user={userData?.login || 'Guest'}
//                 time="2 hour ago"
//                 des="Lorem ipsum dolor sit amet..."
//               />
//               <Load />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Прелоадер page.tsx
// // frontend/src/app/page.tsx
// 'use client'

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Page() {
//   const router = useRouter();
//   const [loadingStage, setLoadingStage] = useState(0);
//   const loadingMessages = [
//     "Подготавливаем платформу",
//     "Формируем личный кабинет",
//     "Осталось совсем немного",
//   ];

//   useEffect(() => {
//     let stageTimeout: NodeJS.Timeout;

//     const updateLoadingStage = () => {
//       setLoadingStage((prev) => (prev + 1) % loadingMessages.length);
//     };

//     // Симуляция этапов загрузки (можно заменить на реальную логику)
//     stageTimeout = setTimeout(updateLoadingStage, 1000); // 2 секунды на этап
//     const totalTimeout = setTimeout(() => {
//       let telegramId: number | undefined;

//       // Получаем telegramId из tgWebAppData
//       const urlParams = new URLSearchParams(window.location.hash.substring(1));
//       const tgWebAppData = urlParams.get('tgWebAppData');
//       if (tgWebAppData) {
//         try {
//           const decodedData = decodeURIComponent(tgWebAppData);
//           const userDataFromWebApp = JSON.parse(decodedData.split('&user=')[1].split('&')[0]);
//           if (userDataFromWebApp?.id) {
//             telegramId = userDataFromWebApp.id;
//             console.log('Telegram user ID from WebApp:', telegramId);
//           }
//         } catch (error) {
//           console.error('Parsing error:', error);
//         }
//       }

//       if (!telegramId) {
//         console.error('No telegramId available');
//         router.push('/error'); // Или другая страница при ошибке
//         return;
//       }

//       router.push(`/user/${telegramId}`);
//     }, ); // Общая задержка 6 секунд (3 этапа по 2 секунды)

//     return () => {
//       clearTimeout(stageTimeout);
//       clearTimeout(totalTimeout);
//     };
//   }, [router]);

//   return (
//     <div className="text-center p-5">
//       <h2>{loadingMessages[loadingStage]}</h2>
//     </div>
//   );
// }