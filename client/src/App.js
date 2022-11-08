import './App.css';
import Nav from './components/Common/Navigation';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from './components/User/UserProvider';
import { useContext, useEffect, useState } from 'react';
import {decodeToken , isExpired} from 'react-jwt';
import io from 'socket.io-client';
import { message } from 'antd';
export let socket;

socket = io('http://localhost:5000');
function App() {

  const { user, changeUser , token, changeToken} = useContext(UserContext)
  console.log("accessTokenApp",token)
    const navigate = useNavigate();
    
    const checkToken = async()=>{
        if(isExpired(token)){
            navigate('/sign-in');
        }else{
          const current = await decodeToken(token); 
          socket.emit('resetSocket', {id:current.sub})
        }
    }
  
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('connected')
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receiveNoti', ()=>{
      message.info("Bạn có thông báo");
    })

    
  }, []);
  useEffect(()=>{checkToken()},[]);
  return (<div>
    <div className='App'>
      <Nav />
    </div>
    <Outlet />
  </div>
  );
}

export default App;
