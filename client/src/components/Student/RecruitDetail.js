import { Button, Card, Form, Input, message, Modal, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import {decodeToken} from 'react-jwt';

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { DateToShortString } from "../../common/service";
const { TextArea } = Input;

let initialRecruit = {
    _id:-1,
    title: 'x',
    way_working: '',
    salary: '',
    quantity: '',
    level: '',
    gender: null,
    status: false,
    address_working: '',
    experience: '',
    description: '',
    requirement: '',
    welfare: '',
    start_date: '',
    end_date: '',
    id_company: '',
    fields: []
}

let initialCompany = {
    _id:-1,
    com_name: '',
    address: '',
    year: '',
    com_phone: '',
    com_email: '',
    website: '',
    status: true,
    scale: '',
    introduction: '',
    manufacture: []
}

export const RecruitDetailStudent = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isOpenConfirm, setOpenConfirm] = useState(false);
    const navigate = useNavigate();
    
    const {id} = useParams();
    const ids = id.split(',');
    const [account, setAccount] = useState(user);
    const [company, setCompany] = useState(initialCompany);
    const [recruit, setRecruit] = useState(initialRecruit);

    //fetch manucomany and Company
    async function fetchManuCompany(){
        try {
            console.log("fetch manu Company!", recruit.id_company)
            const _id = ids[1];
            const url = serverURL + 'manu-company/company/'+ _id;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                console.log("L???i h??? th???ng!")
                message.error("L???i h??? th???ng!");
            }else{
                console.log("result",result);
                if(result.data==='empty'){
                    // setOpenModal(true);
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
            const url = serverURL + 'company/'+ ids[1];
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                console.log("L???i h??? th???ng!");
                message.error("L???i h??? th???ng!");
            }else{
                console.log("result",result);
                if(result.data==='empty'){
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
    
    async function fetchRecruit(){
        const url = serverURL + 'recruit/'+ids[0];
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            console.log(result);
            if(response.status!==200){
                message.error(result.message);
            }else{
                message.success("Load recruit th??nh c??ng!");
                setRecruit({...result.data});
                // setCompany({...recruit.data.company});
            }
        }
        catch (err) {
            console.log(err);
            message.error("???? c?? l???i x???y ra!");
        }
    }

    //fetchCV
    async function fetchCV(){
        console.log('fetchCV')
        const url = serverURL + 'cv/'+account._id;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            console.log('CV',result);
            if(response.status!==200){
                message.error(result.message);
            }else{
                if(result.data==={}||!result.data){
                    setOpenModal(true);
                }
                else{
                    setOpenConfirm(true);
                }   
            }
        }
        catch (err) {
            console.log(err);
            message.error("???? c?? l???i x???y ra!");
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
                    message.error("L???i h??? th???ng load user!");
                }else{
                  console.log("user fetch to set role", result)
                  if(!result||result.role!=='student'){
                      message.warn('B???n ko c?? quy???n xem trang n??y');
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
    useEffect(()=>{fetchRecruit()},[]);
    useEffect(()=>{fetchCompany()},[]);

    //initial Validate
   
    const ref = useRef();
    const refButtonSubmit = useRef();

    //handle change
    function handleKeyUp(e) {
        if (e.keyCode === 13) {
            console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }

    //handle action

    const handleApply = ()=>{
        fetchCV();
    }

    const handleCancel = ()=>{
        setOpenModal(false);
    }

    const handleOk = ()=>{
        navigate('/my-cv');
    }

    const handleCancelConfirm = ()=>{
        setOpenConfirm(false);
    }

    const handleOkConfirm = ()=>{
        //g???i mail v?? noti
    }
    
    //render UI
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image center'>
                <p className='title-account center '>Chi ti???t b??i ????ng tuy???n d???ng</p>
            </div>
            <div className="apply-container">
                    <Button className="apply-btn" type="primary" onClick={handleApply}>???ng tuy???n ngay</Button>
                </div>
        </div>
                
        <div className='detail-swapper'>
            <div className='body'>
            <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                >
                    <div className="title-recruit">
                        <Form.Item
                            label="Ti??u ????? b??i ????ng:"
                            name="title"
                            className='label'
                        >
                                <p className="text-display">{recruit.title}</p>
                        </Form.Item>
                    </div>
                    <Card title="Chi ti???t b??i ????ng tuy???n d???ng">
                    <div className='two-colums'>
                        <Form.Item
                            label="L????ng:"
                            name="salary"
                            initialValue={recruit.salary}
                            className='label'
                        >
                                <p className="text-display">{recruit.salary}</p>
                        </Form.Item>

                        <Form.Item
                            label="S??? l?????ng tuy???n:"
                            name="quantity"
                            className='label'
                        >
                                <p className="text-display">{recruit.quantity}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="?????a ch??? l??m vi???c:"
                            name="address_working"
                            className='label'
                        >
                                <p className="text-display">{recruit.address_working}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="Kinh nghi???m:"
                            name="experience"
                            className='label'
                        >
                            <p className="text-display">{recruit.experience}</p>
                        </Form.Item>
            
                        <Form.Item
                            label="Ph????ng th???c l??m vi???c:"
                            name="way_working"
                            className='label'
                        >
                            <p className="text-display">{recruit.way_working}</p>
                        </Form.Item>
                        <Form.Item
                            label="Ch???c v???:"
                            name="level"
                            className='label'
                        >
                            <p className="text-display">{recruit.level}</p>
                        </Form.Item>
                        <Form.Item
                            label="Gi???i t??nh:"
                            name="gender"
                            className='label'
                        >
                                <p className="text-display">{recruit.gender===null?'all':recruit.gender===false?'nam':'n???'}</p>
                        </Form.Item>
                        
                        <Form.Item
                            label="L??nh v???c:"
                            name="fields"
                            className='label'
                        >
                                <div >
                                {
                                    recruit.fields.length?
                                    recruit.fields.map((field)=>{
                                        return <Tag className="tag" color="cyan">{field.nameField}</Tag>
                                    }):
                                    <p className="text-display"></p>
                                }
                                </div>
                        </Form.Item>
                    </div>
                        <Form.Item
                            label="Th??ng tin m?? t??? c??ng vi???c:"
                            name="description"
                            className='label'
                        >
                            <p className="text-display">{recruit.description}</p>
                        </Form.Item>
                        <Form.Item
                            label="Th??ng tin y??u c???u ???ng tuy???n:"
                            name="requirement"
                            className='label'
                        >
                            <p className="text-display">{recruit.requirement}</p>
                        </Form.Item>
                        <Form.Item
                            label="Th??ng tin quy???n l???i:"
                            name="welfare"
                            className='label'
                        >
                            <p className="text-display">{recruit.welfare}</p>
                        </Form.Item>
                        <div className='two-colums'>
                            <Form.Item
                                label="Ng??y b???t ?????u:"
                                name="start_date"
                                className='label'
                            >
                                <p className="text-display">{DateToShortString(recruit.start_date)}</p>
                            </Form.Item>
                            <Form.Item
                                label="Ng??y k???t th??c:"
                                name="end_date"
                                className='label'
                            >
                                <p className="text-display">{DateToShortString(recruit.end_date)}</p>
                            </Form.Item>
                        </div>
                        </Card>
                        <Card >
                        <div className='detail-swapper'>
                            <p className='title-account'>Th??ng tin c??ng ty</p>
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
                                            label="T??n c??ng ty:"
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
                                            label="S??? ??i???n tho???i:"
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
                                            label="?????a ch???:"
                                            name="address"
                                            initialValue={company.address}
                                            className='label'
                                        >
                                            <p className="text-display">{company.address}</p>
                                        </Form.Item>
                                        
                                        <Form.Item
                                            label="S??? lao ?????ng:"
                                            name="scale"
                                            initialValue={company.scale}
                                            className='label'
                                        >
                                            <p className="text-display">{company.scale}</p>
                                        </Form.Item>

                                        <Form.Item
                                            label="N??m th??nh l???p:"
                                            name="year"
                                            initialValue={company.year}
                                            className='label'
                                        >
                                            <p className="text-display">{company.year}</p>
                                        </Form.Item>
                                        <Form.Item
                                            label="Ng??nh s???n xu???t:"
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
                                            label="Th??ng tin gi???i thi???u:"
                                            name="introduction"
                                            initialValue={company.introduction}
                                            className='label'
                                        >
                                            <TextArea rows={5} disabled value={company.introduction} defaultValue={company.introduction} />
                                        </Form.Item>
                                </Form>
                            </div>
                            </div>
                        </Card>
                </Form>
            </div>
        </div>
        <Modal title="Th??ng b??o" open={isOpenModal} onOk={handleOk} onCancel={handleCancel}>
            <p>B???n ch??a c???p nh???t CV n??n kh??ng th??? ???ng tuy???n, h??y c???p nh???t!</p>
            <Link to={`../../../my-cv`} ><Button type="primary">CV</Button></Link>
        </Modal>
        <Modal title="X??c nh???n" open={isOpenConfirm} onOk={handleOkConfirm} onCancel={handleCancelConfirm}>
            <p>B???n c?? ch???c ch???n mu???n ???ng tuy???n!</p>
        </Modal>
           
        </div>
    )
}