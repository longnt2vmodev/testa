import { InfoCircleOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone, KeyOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Tooltip, Typography } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { messageSignUpError } from '../../common/error';
import { checkPassword, checkUsername } from '../../common/validation';
import { serverURL } from '../../configs/server.config';
import '../../styles/form.css';
import { UserContext } from './UserProvider';
import { socket } from '../../App';

const SignIn = () => {
    const { changeUser, changeToken} = useContext(UserContext);
    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const ref = useRef();
    const refButtonSubmit = useRef();

    const [validateUsername, setValidateUsername] = useState({
        status: 'success',
        errorMsg: null
    });
    const [validatePassword, setValidatePassword] = useState({
        status: 'success',
        errorMsg: null
    });

    function checkUserNameFunc(username) {
        if (!checkUsername(username)) {
            setValidateUsername({
                status: 'error',
                errorMsg: messageSignUpError.username
            })
            return false;
        } else {
            setValidateUsername({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function checkPasswordFunc(password) {
        if (!checkPassword(password)) {
            setValidatePassword({
                status: 'error',
                errorMsg: messageSignUpError.password
            })
            return false;
        } else {
            setValidatePassword({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function handleChangeUserName(e) {
        setUser((preUser) => { return { ...preUser, username: e.target.value } });
    }

    function handleChangePassword(e) {
        setUser((preUser) => { return { ...preUser, password: e.target.value } });
    }

    function handleKeyUp(e) {
        if (e.keyCode === 13) {
            console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }

    const navigate = useNavigate();
    async function handleSubmit(e) {
        // ref.current.submit();
        let count = 0;
        count = checkPasswordFunc(user.password) ? count : count + 1;
        count = checkUserNameFunc(user.username) ? count : count + 1;
        console.log(count);
        console.log(user);
        if (count === 0) {
            const url = serverURL + 'auth/login';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                if(response.status!==201){
                    message.error("????ng nh???p kh??ng th??nh c??ng!");
                }else{
                    message.success("B???n ???? ????ng nh???p th??nh c??ng");
                    const account = result.user;
                    console.log('socket', socket.id);
                    changeUser(account);
                    socket.emit('msgToSignin', {id:account._id})
                    window.localStorage.setItem('accessToken', result.accessToken)
                    changeToken(result.accessToken);
                    navigate('/');
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        return;
    }
    return (
        <div className='grid-container'>
            <div className='img-side' ></div>
            <div className='flex-container'>
                <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                    initialValues={{ remember: true }}
                    autoComplete="off"

                >
                    <Typography type="secondary" className='title m-b-50px'>????NG NH???P</Typography>
                    <Form.Item
                        label="T??n ????ng nh???p"
                        name="username"
                        validateStatus={validateUsername.status}
                        help={validateUsername.errorMsg}
                        rules={[{ required: true, message: 'H??y nh???p t??n ????ng nh???p!' }]}
                        tooltip={{ title: 'T??n ????ng nh???p l?? duy nh???t', icon: <InfoCircleOutlined /> }}
                    >
                        <Input
                            className='input-login'
                            placeholder="Nh???p t??n ????ng nh???p"
                            autoFocus={true}
                            prefix={<UserOutlined className='input-icon' />}
                            suffix={
                                <Tooltip title="T??n ????ng nh???p l?? duy nh???t">
                                    <InfoCircleOutlined className='input-icon opacity-less'
                                    />
                                </Tooltip>
                            }
                            value={user.username}
                            onChange={handleChangeUserName}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        validateStatus={validatePassword.status}
                        help={validatePassword.errorMsg}
                        rules={[{ required: true, message: 'H??y nh???p password!' }]}
                        tooltip={{ title: 'Password bao g???m 8 k?? t??? tr??? l??n, c?? c??? ch??? v?? s???! ', icon: <InfoCircleOutlined /> }}
                    >
                        <Input.Password
                            className='input-login'
                            placeholder="H??y nh???p m???t kh???u"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            prefix={<KeyOutlined className='input-icon' />}
                            onChange={handleChangePassword}
                        />
                    </Form.Item>
                    <Form.Item name="remember">
                        <Checkbox>Remember me</Checkbox>
                        <Link to='/forgot-password'>Qu??n m???t kh???u</Link>
                    </Form.Item>
                    <Form.Item name="register">
                        B???n ch??a c?? t??i kho???n? <Link to='/register'>????ng k??</Link>
                    </Form.Item>
                    <Form.Item>
                        <Button type='submit' ref={refButtonSubmit} name='button-submit' className='button submit' onSubmit={handleSubmit} onClick={handleSubmit} onKeyUp={handleKeyUp}>Submit</Button>
                        <Button type='reset' className='button reset'>Reset</Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    );
}

export default SignIn;