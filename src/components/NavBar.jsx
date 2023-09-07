import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth'
import app from "../../firebase";
export default function NavBar() {
  const [previous, setPrevious] = useState(0);
  const [present, setPresent] = useState(0);
  const { pathname } = useLocation();
  const previousRef = useRef(0);
  const throttle = useRef(true);
  const navigate = useNavigate();

  const initialUserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};
  console.log(initialUserData)
  const [userData, setUserDate] = useState(initialUserData);
  const auth = getAuth(app );
  const provider = new GoogleAuthProvider();
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        setUserDate(result.user);
        //유저정보 localStorage에 저장, 객체나 배열을 저장 시 JSON.stringfy를 통해 텍스트로 변환후 저장
        localStorage.setItem('userData', JSON.stringify(result.user))
      })
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        alert(error.message);
      })
  }
  const handleLogOut = () => {
    signOut(auth).then(() => {  
      setUserDate({});
      localStorage.removeItem('userData');
    }).catch((error) => {
      alert(error.message)
    })
  }
  
  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (throttle.current) {
        throttle.current = false;
        setTimeout(() => {
          setPrevious(previousRef.current);
          setPresent(scrollY);
          throttle.current = true;
        }, 300);
      }
      return;
    });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //이미 로그인된 유저의 login페이지 접근 막기
      if (!user) {
        navigate('/login');
      } else if (user && pathname === '/login') {
        navigate('/');
      }
    })
    return () => {
      unsubscribe()
    }
  },[])
  useEffect(() => {
    previousRef.current = present;
  },[previous,present])
  return (
    <NavWrapper open={previous >= present ? true : false}>
      <Logo>
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Poke logo"
          onClick={() => (window.location.href = "/")}
        />
      </Logo>
      {pathname === "/login" ? (
        <Login onClick={handleAuth}>Login</Login>
      ) : (
        <SignOut>
          <UserImg src={userData.photoURL} alt={userData.displayName} />
          <DropDown onClick={handleLogOut}>
            <span>Sing out</span>
          </DropDown>
        </SignOut>
      )}
    </NavWrapper>
  );
}
const UserImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
`
const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size:14px;
  letter-spacing: 3px;
  width:100px;
  opacity:0;
  color:white;
`
const SignOut = styled.div`
  position: relative;
  height:48px;
  width:48px;
  display:flex;
  cursor:pointer;
  align-items:center;
  justify-content:center;
  &:hover {
    ${DropDown} {
      opacity:1;
      transition-duration:1s;
    }
  }
`
const Login = styled.a`
  background-color: rgba(0,0,0,0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.55px;
  border: 1px solid;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  background-color: #444;
  &:hover {
    background-color:#f9f9f9;
    color: #000;
    border-color:transparent;
    cursor: pointer;
  }
`
const Image = styled.img`
  cursor: pointer;
  width: 100%;
`
const Logo = styled.a`
  padding: 0;
  width: 50px;
  margin-top: 4px;
`
const NavWrapper = styled.nav`
  height: ${(props) => (props.open ? "5rem" : "0")};
  overflow: ${(props) => (props.open ? "visible" : "hidden")};

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  background-color: #090b13;
  z-index: 100;
  transition: height 0.3s;
`;
// export default function NavBar() {
//   const [isHeaderOpen, setIsHeaderOpen] = useState(true);
//   const [previouseScrollPosition, setPreviouseScrollPosition] = useState(0);
//   const [presentScrollPosition, setPresentScrollPosition] = useState(0);
//   const presentScrollPositionRef = useRef(0);
//   const throttle = useRef(true);
//   const headerStyle = isHeaderOpen ? "h-[5rem]" : "h-0";
//   useEffect(() => {
//     presentScrollPositionRef.current = presentScrollPosition;
//     if (previouseScrollPosition < presentScrollPosition) {
//       setIsHeaderOpen(false);
//     } else {
//       setIsHeaderOpen(true);
//     }
//   }, [previouseScrollPosition, presentScrollPosition]);
//   // https://ddochea.tistory.com/94 : 한줄요약 : 이벤트리스너 안에선 상태값 못 쓴다. set만 된다.
//   // 스크롤이벤트 최적화
//   const scrollListener = () => {
//     if (throttle.current) {
//       throttle.current = false;
//       setTimeout(() => {
//         setPreviouseScrollPosition(presentScrollPositionRef.current);
//         setPresentScrollPosition(scrollY);
//         throttle.current = true;
//       }, 300);
//     } else {
//       return;
//     }
//   };
//   document.addEventListener("scroll", scrollListener);
//   return (
//     <div
//       className={`header ${headerStyle} w-full fixed z-[70] bg-gray-100 transition-all overflow-hidden flex justify-center`}
//     >
//       <div className='w-[1100px]'>
//         Header
//       </div>
//     </div>
//   );
// }