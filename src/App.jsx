import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import MainPage from '@/pages/MainPage/index.jsx';
import DetailPage from '@/pages/DetailPage/index.jsx';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet/>
    </>
  );
}
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path='login' element={<LoginPage/>}/>
          <Route path='/pokemon/:id' element={<DetailPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
