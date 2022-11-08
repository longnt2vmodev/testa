import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Image, message, Modal, Skeleton, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {decodeToken} from 'react-jwt';

import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { DateToShortString } from "../../common/service";
import { serverURL } from "../../configs/server.config";

let initstudent = {
    _id:1,
    cccd: "",
    address: "",
    university: "",
    faculty: "",
    course: "",
    gpa: '',
    status: false,
    avatar: '',
    card_student: '',
    major: ''
}

export const StudentDetailCompany = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const navigate = useNavigate();
    const [account, setAccount] = useState(user);
    const [student, setStudent] = useState(initstudent);
    const [CV, setCV] = useState(null);
    const [isOpenConfirm, setOpenConfirm] = useState(false);

    const {id} = useParams();

    async function fetchStudent(){
        try {
            const url = serverURL + 'student/admin/'+ id;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const result = await response.json();
            if(response.status!==200){
                message.error("Lỗi hệ thống!");
            }else{
                if(result.data==='empty'){
                    message.warning('Không tồn tại sinh viên mã đã tìm!');
                    navigate('/home');
                }else{
                    console.log("result",result.data)
                    setStudent(result.data);
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
                  if(!result||result.role!=='company'){
                      message.warn('Bạn ko có quyền xem trang này');
                      navigate('/')
                  }
                    setAccount({...result});
                    changeUser({...result})
                }
            }
            catch (err) {
                console.log(err);
            }
    }

    //FETCH CV
    async function fetchCV(){
        console.log('fetchCV')
        const url = serverURL + 'cv/'+student._id;
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
                message.success("Load cv thành công!");
                setCV({...result.data});
            }
        }
        catch (err) {
            console.log(err);
            message.error("Đã có lỗi xảy ra!");
        }
    }

    useEffect(()=>{fetchUser()}, []);
    useEffect(()=>{fetchStudent();},[])
    useEffect(()=>{fetchCV()},[student]);
    
    const ref = useRef();
    const refButtonSubmit = useRef();

    function handleKeyUp(e) {
        if (e.keyCode === 13) {
            console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }
    const renderButtonGroup = ()=>{
        return (
            <div className="apply-container">
                <Button type='primary' className="apply-btn" onClick={handleApply}>Gửi thư mời phỏng vấn</Button>
            </div>
        )
    }
    const handleApply = ()=>{
        setOpenConfirm(true);
    }
    const handleCancelConfirm = ()=>{
        setOpenConfirm(false);
    }

    const handleOkConfirm = ()=>{
        //gửi mail và noti
    }
    if(account){
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image'></div>
            <div className='introduce-bottom'>
                <Avatar className='avatar' size= {120} icon={<UserOutlined />} />
                <div className='introduce-fullname'>{account.fullname}</div>
                {
                    renderButtonGroup()
                }
            </div>
        </div>
        <div className='detail-swapper'>
            <p className='title-account'>Thông tin sinh viên</p>
            <div className='underline'></div>
            <div className='body'>
            <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                    autoComplete="off"
                >
                    <div className='two-colums'>
                        <Form.Item
                            label="Họ và tên"
                            name="fullname"
                            initialValue={account.fullname}
                            className='label'
                        >
                                <p className="text-display">{account.fullname}</p>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={account.email}
                            className='label'
                        >
                                <p className="text-display">{account.email}</p>
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            initialValue={account.phone}
                            className='label'
                        >
                                <p className="text-display">{account.phone}</p>
                        </Form.Item>
                        <Form.Item
                            label="Trường"
                            name="university"
                            initialValue={student.university}
                            className='label'
                        >
                                <p className="text-display">{student.university}</p>
                        </Form.Item>
                        <Form.Item
                            label="Khoa"
                            name="faculty"
                            initialValue={student.faculty}
                            className='label'
                        >
                                <p className="text-display">{student.university}</p>
                        </Form.Item>
                        <Form.Item
                            label="Chuyên ngành"
                            name="major"
                            className='label'
                            initialValue={student.major}
                        >
                                <p className="text-display">{student.major}</p>
                        </Form.Item>
                        <Form.Item
                            label="Khóa học"
                            name="course"
                            initialValue={student.course}
                            className='label'
                        >
                                <p className="text-display">{student.course}</p>
                        </Form.Item>
                        <Form.Item
                            label="CCCD"
                            name="cccd"
                            initialValue={student.cccd}
                            className='label'
                        >
                                <p className="text-display">{student.cccd}</p>
                        </Form.Item>
                        <Form.Item
                            label="Quê quán"
                            name="address"
                            initialValue={student.address}
                            className='label'
                        >
                                <p className="text-display">{student.address}</p>
                        </Form.Item>
                        <Form.Item
                            label="Mã sinh viên"
                            name="card_student"
                            initialValue={student.card_student}
                            className='label'
                        >
                                <p className="text-display">{student.card_student}</p>
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh"
                            name="birthday"
                            className='label'
                        >
                                <p className="text-display">{DateToShortString(account.birthday)}</p>
                        </Form.Item>
                        <Form.Item
                            label="GPA"
                            name="gpa"
                            initialValue={student.gpa}
                            className='label'
                        >
                                <p className="text-display">{student.gpa}</p>
                        </Form.Item>
                    
                    </div>
                    
                </Form>
                </div>
            </div>
            <Card title='Thông tin CV'>
                {
                    CV?(
                        <Form
                            ref={ref}
                            onKeyUp={handleKeyUp}
                            className='form'
                            name="basic"
                            layout='vertical'
                        >
                            <div className='two-colums'>
                            <Form.Item
                                    label="Tiêu đề CV:"
                                    name="title"
                                    className='label'
                                >
                                    <p className="text-display">{CV.title}</p>
                                </Form.Item>
                                <Form.Item
                                    label="Lĩnh vực:"
                                    name="fields"
                                    className='label'
                                >
                                {
                                    
                                        <div >
                                        {
                                            CV.fields.length?
                                            CV.fields.map((field)=>{
                                                return <Tag className="tag" color="cyan">{field.nameField}</Tag>
                                            }):
                                            <p className="text-display"></p>
                                        }
                                        </div>
                                    }
                                </Form.Item>
                                <Form.Item 
                                    label='FILE CV:'
                                    className='label'
                                    >
                                    {
                                        CV.file_cv?
                                        <Image alt="file_cv" src={CV.file_cv} width={300} />
                                        : <p>Chưa có ảnh</p>
                                    }
                                </Form.Item>
                                </div>
                        </Form>
                        )
                        :
                        <p>Chưa có CV</p>
                    }
            </Card>
            <Modal title="Xác nhận" open={isOpenConfirm} onOk={handleOkConfirm} onCancel={handleCancelConfirm}>
                <p>Bạn có chắc chắn muốn gửi thư mời phỏng vấn sinh viên này!</p>
            </Modal>
        </div>
    )
    }else{
        return <Skeleton active />;
    }
}