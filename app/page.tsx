// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// function getCookie(name: string) {
//   const match = document.cookie
//     .split('; ')
//     .find(row => row.startsWith(name + '='));
//   return match ? decodeURIComponent(match.split('=')[1]) : null;
// }

// export default function Page() {
//   const router = useRouter();

//   useEffect(() => {
//     const accessToken = getCookie('access-token');
//     const userInfoCookie = getCookie('user-info');

//     if (!accessToken || !userInfoCookie) {
//       router.replace('/welcome');
//       return;
//     }

//     try {
//       const userInfo = JSON.parse(userInfoCookie);
//       router.replace(`/${userInfo.role}/dashboard`);
//     } catch (err) {
//       router.replace('/welcome');
//     }
//   }, [router]);

//   return null;
// }


// app/page.tsx
export default function Page() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading... 
    </div>
  );
}
