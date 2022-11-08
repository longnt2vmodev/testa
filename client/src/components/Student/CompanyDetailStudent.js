import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, message, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import {decodeToken} from 'react-jwt';

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
const { TextArea } = Input;

let initialCompany = {
    _id:-1,
    com_name: '',
    address: '',
    year: '',
    com_phone: '',
    com_email: '',
    website: '',
    status: false,
    scale: '',
    introduction: '',
    manufacture: []
}

export const CompanyDetailStudent = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const navigate = useNavigate();
    if(!user||user.role!=="student"){
        navigate('/sign-in');
    }
    const [company, setCompany] = useState(initialCompany);

    const {id} = useParams();
    console.log("company.manufacture",company.manufacture)

    //fetch manucomany and Company
    async function fetchManuCompany(){
        try {
            const url = serverURL + 'manu-company/company/'+ id;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                console.log("Lỗi hệ thống!")
                message.error("Lỗi hệ thống!");
            }else{
                console.log("result",result);
                if(result.data==='empty'){
                    setCompany({...initialCompany});
                }else{
                    console.log('fetch Manu Company', result.data);
                    setCompany((preCompany)=>{
                        return {...preCompany,
                            manufacture:  result.data.manufacture
                        }
                    });
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async function fetchCompany(){
        try {
            const url = serverURL + 'company/'+ id;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                console.log("Lỗi hệ thống!");
                message.error("Lỗi hệ thống!");
            }else{
                console.log("result",result);
                if(result.data==='empty'){
                    navigate("/page-not-found");
                    setCompany({...initialCompany});
                }else{
                    console.log('fetch Company', result.data);
                    setCompany({...company,...result.data});
                    fetchManuCompany();
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    //fetch user
    const fetchUser = async()=>{
        console.log('fetch user account')
        const tokenx = token? token: window.localStorage.getItem('accessToken');
        console.log('tokenx', tokenx);
        const id = decodeToken(tokenx).sub;
        console.log("id",id);
        const url = serverURL + 'account/'+id;
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                if(response.status!==200){
                    message.error("Lỗi hệ thống load user!");
                }else{
                  console.log("user fetch to set role", result)
                  if(!result||result.role!=='student'){
                      message.warn('Bạn ko có quyền xem trang này');
                      navigate('/')
                  }
                    changeUser({...result})
                }
            }
            catch (err) {
                console.log(err);
            }
    }

    useEffect(()=>{fetchUser()}, []);
    useEffect(()=>{fetchCompany();},[]);

    const ref = useRef();

    //render UI
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image'></div>
            <div className='introduce-bottom'>
                <Avatar className='avatar' size= {120} icon={<UserOutlined />} />
                <div className='introduce-fullname'>{company.com_name}</div>
            </div>
        </div>
        <div className='detail-swapper'>
            <p className='title-account'>Thông tin công ty</p>
            <div className='underline'></div>
            <div className='body'>
            <Form
                    ref={ref}
                    className='form'
                    name="basic"
                    layout='vertical'
                    autoComplete="off"
                >
                    <div className='two-colums'>
                        <Form.Item
                            label="Tên công ty:"
                            name="com_name"
                            initialValue={company.com_name}
                            className='label'
                        >
                            <p className="text-display">{company.com_name}</p>
                        </Form.Item>
                        <Form.Item
                            label="Email:"
                            name="email"
                            initialValue={company.com_email}
                            className='label'
                        >
                            <p className="text-display">{company.com_email}</p>
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại:"
                            name="phone"
                            initialValue={company.com_phone}
                            className='label'
                        >
                            <p className="text-display">{company.com_phone}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="Website:"
                            name="website"
                            initialValue={company.website}
                            className='label'
                        >
                                <p className="text-display">{company.website}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="Địa chỉ:"
                            name="address"
                            initialValue={company.address}
                            className='label'
                        >
                            <p className="text-display">{company.address}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="Số lao động:"
                            name="scale"
                            initialValue={company.scale}
                            className='label'
                        >
                            <p className="text-display">{company.scale}</p>
                        </Form.Item>

                        <Form.Item
                            label="Năm thành lập:"
                            name="year"
                            initialValue={company.year}
                            className='label'
                        >
                            <p className="text-display">{company.year}</p>
                        </Form.Item>
                        <Form.Item
                            label="Ngành sản xuất:"
                            name="manufacture"
                            initialValue={company.manufacture}
                            className='label'
                        >
                                <div >
                                {
                                    company.manufacture.length?
                                    company.manufacture.map((manu)=>{
                                        return <Tag className="tag" color="cyan">{manu.name_manu}</Tag>
                                    }):
                                    <p className="text-display"></p>
                                }
                                </div>
                        </Form.Item>
                        </div>
                        <Form.Item
                            label="Thông tin giới thiệu:"
                            name="introduction"
                            initialValue={company.introduction}
                            className='label'
                        >
                            <TextArea rows={5} disabled value={company.introduction} defaultValue={company.introduction} />
                        </Form.Item>
                </Form>
                <Link to={`../recruit-list/company/${id}`}><Button type="primary">Xem các bài đăng tuyển dụng</Button></Link>
            </div>
        </div>

        <div>
            <Card title='Đánh giá của các sinh viên'>
                
            </Card>
        </div>
        </div>
    )
}