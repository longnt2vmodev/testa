import { Button, Card, Form, Image, Input, message, Select, Skeleton, Tag, Upload } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import {decodeToken} from 'react-jwt';

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { checkString, checkArray, checkFileCV } from "../../common/validation";
import { DateToShortString } from "../../common/service";
import { CheckCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { messageCVError } from "../../common/error";
const { Option } = Select;

let initialStudent = {
    _id:-1,
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

let initialCV = {
    _id: -1,
    title: '',
    fields: [],
    file_cv: '',
    status: false
}

export const MyCV = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();
    const [account, setAccount] = useState(user);
    const [student, setStudent] = useState(initialStudent);
    const [CV, setCV] = useState(initialCV);
    const [fields, setFields] = useState([]);
    const defaultTrueStatus = {
        status: 'success',
        errorMsg: null
    }

    async function fetchStudent(){
        if(account){
        try {
            const _id = account._id;
            const url = serverURL + 'student/'+ _id;
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
                    navigate('/student-profile');
                }else{
                    console.log('fetch Student', result.data);
                    setStudent({...student,...result.data});
                }
            }
        }
        catch (err) {
            console.log(err);
        }}
    }
    //fetch Fields
    async function fetchField(){
            const url = serverURL + 'field';
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
                    message.success("Load field thành công!");
                    setFields(result.data);
                }
            }
            catch (err) {
                console.log(err);
                message.error("Đã có lỗi xảy ra!");
            }
    }
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
                setCV({...initialCV,...result.data});
            }
        }
        catch (err) {
            console.log(err);
            message.error("Đã có lỗi xảy ra!");
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
                  setAccount({...result});
                    changeUser({...result})
                }
            }
            catch (err) {
                console.log(err);
            }
    }
    useEffect(()=>{fetchUser()},[]);
    useEffect(()=>{fetchStudent()},[account]);
    useEffect(()=>{fetchField()},[]);
    useEffect(()=>{fetchCV()},[student]);

    //initial Validate
    const [validateTitle,setValidateTitle] = useState(defaultTrueStatus);
    const [validateFileCV,setValidateFileCV] = useState(defaultTrueStatus);
    const [validateFields, setValidateFields] = useState(defaultTrueStatus);
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

    //validate
    function checkTitleFunc(title) {
        if (!checkString(title)) {
            setValidateTitle({
                status: 'error',
                errorMsg: messageCVError.title
            })
            return false;
        } else {
            setValidateTitle(defaultTrueStatus)
            return true;
        }
    }
   
    function checkFileFunc(data) {
        if (!checkFileCV(data)) {
            setValidateFileCV({
                status: 'error',
                errorMsg: messageCVError.fileCV
            })
            return false;
        } else {
            setValidateFileCV(defaultTrueStatus)
            return true;
        }
    }

    function checkFieldFunc(fields){
        console.log("fields",fields);
        if (!checkArray(fields)) {
            setValidateFields({
                status: 'error',
                errorMsg: messageCVError.field
            })
            return false;
        } else {
            setValidateFields(defaultTrueStatus)
            return true;
        }
    }
    //handle action
    async function createCV(){
        const url = serverURL + 'cv';
            const data = { ...CV, id_student: student._id, id_field_array: CV.fields};
            console.log("request", data)
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                );
                const result = await response.json();
                console.log(result);
                if(response.status!==201){
                    message.error(result.message);
                }else{
                    message.success("Bạn đã cập nhật CV!");
                    // fetchCompany();
                }
            }
            catch (err) {
                console.log(err);
                message.error("Đã có lỗi xảy ra!");
            }
    }

    async function updateCV(){
        const url = serverURL + 'cv/'+CV._id;
            const data = { ...CV, update_id: student._id};
            console.log("request", data)
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
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
                    message.success("Bạn đã cập nhật CV!");
                    // fetchCompany();
                }
            }
            catch (err) {
                console.log(err);
                message.error("Đã có lỗi xảy ra!");
            }
    }

    async function handleSave(e) {
        ref.current.submit();
        let count =0;
        console.log("account",account);
        console.log("student",student);
        count = checkTitleFunc(CV.title) ? count : count + 1;
        count = checkFileFunc(CV.file_cv) ? count : count + 1;
        count = checkFieldFunc(CV.fields) ? count : count + 1;
         console.log("count",count);
         console.log(CV)
        if(count===0){
            if(CV._id===-1){
                createCV();
            }else{
                updateCV();
            }
        }
        return;
    }

    async function handleEdit(e) {
        await fetchCV();
        setIsEdit(true);
        console.log('edit', CV)
        // return;
    }
    async function handleCancel(e) {
        setIsEdit(false);
        fetchCV();
        return;
    }
    const renderButtonGroup = () => {
        if (!isEdit) {
            return (<>
                <Button type='submit' className='button edit-btn' onClick={handleEdit}>Sửa</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button type='submit' className='button save-btn' onClick={handleSave}>Lưu</Button>
                    <Button type='reset' className='button cancel-btn' onClick={handleCancel}>Hủy</Button>
                </>
            )
        }
    }
    const renderStatus = ()=>{
        if(CV.status){
            return (
            <Tag icon={<CheckCircleOutlined />} 
                color="success">
                public
            </Tag>)
        }else{
            return (
                <Tag icon={<MinusCircleOutlined />} color="default">
                    private
                </Tag>
            )
        }
    }
    function handleChangeTitle(e) {
        setCV((preCV) => { return { ...preCV, title: e.target.value } });
    }
    
    function handleChangeFields(value){
        console.log("value",value);
        setCV((preCV)=>{ return {...preCV, fields:value}})
    }

    function handleChangeStatus(value) {
        setCV((preCV) => { return { ...preCV, status: value } });
    }
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }; 
      const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      };
    const handleChange = (info) => {
        // if (info.file.status === 'done') {
        //   Get this url from response in real world.
          getBase64(info.file.originFileObj, (url) => {
            setCV((preCV)=>{return{...preCV, file_cv: url}; });
          });
        console.log("info", info);

        
        console.log(CV);
        // setCV((preCV)=>{return{...preCV, file_cv: info.file.thumbUrl}})
        // console.log('thumbUrl',info.file.thumbUrl);
      };
      const uploadButton = (
        <div>
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </div>
      );
    if(account&&student){
    //render UI
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image center'>
                <p className='title-account center '>Thông tin CV</p>

            </div>
        </div>
        <Card >
                        <div className='detail-swapper'>
                            <p className='title-account'>Thông tin sinh viên</p>
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
                        </Card>
        <div className='detail-swapper'>
            <div className='body'>
            <Form
                    ref={ref}
                    onKeyUp={handleKeyUp}
                    className='form'
                    name="basic"
                    layout='vertical'
                >
                    <Card title="Chi tiết CV">
                    <div className='two-colums'>
                    <Form.Item
                            label="Tiêu đề CV:"
                            name="title"
                            validateStatus={validateTitle.status}
                            help={validateTitle.errorMsg}
                            className='label'
                            required
                        >
                            {
                                isEdit?
                                <Input
                                    className='input-login max-width'
                                    placeholder="Nhập tiêu CV"
                                    defaultValue={CV.title}
                                    value={CV.title}
                                    onChange={handleChangeTitle}
                                />
                                :
                                <p className="text-display">{CV.title}</p>
                            }
                            
                        </Form.Item>
                        <Form.Item
                            label="Lĩnh vực:"
                            name="fields"
                            validateStatus={validateFields.status}
                            help={validateFields.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <Select
                                mode='multiple'
                                label='Lĩnh vực'
                                style={{
                                width: '100%',
                                }}
                                defaultValue={CV.fields.map(item=>{return item._id})}
                                value={CV.fields}
                                placeholder="Hãy chọn ít nhất một lĩnh vực"
                                onChange={handleChangeFields}
                                optionLabelProp="label"
                            >
                                    {
                                        fields.map((field)=>{
                                            return (
                                                <Option value={field._id} label={field.nameField}>
                                                    <div className="demo-option-label-item">
                                                        {field.nameField}
                                                    </div>
                                                </Option>
                                            )
                                        })
                                    }
                            </Select>:
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
                            required>
                            {
                                isEdit?
                                <>
                                <Upload.Dragger
                                                name="file_cv"
                                                // listType="picture"
                                                showUploadList={false}
                                                className="avatar-uploader"
                                                beforeUpload={(file)=>{
                                                    console.log(file)
                                                }}
                                                onChange={handleChange}
                                                accept="image/*,.pdf"
                                                >
                                            {uploadButton}
                                            </Upload.Dragger>
                                    {
                                        CV.file_cv ? (
                                        <Image
                                            src={CV.file_cv}
                                            alt="avatar"
                                            style={{
                                                width: '200px',
                                            }}
                                            />
                                        ) : ''
                                    }
                                </>
                                :
                                CV.file_cv?
                                <Image alt="file_cv" src={CV.file_cv} width={300} />
                                : <p>Chưa có ảnh</p>
                            }
                        </Form.Item>
                        </div>
                        <Form.Item 
                            name='status' 
                            label="Trạng thái" 
                            >
                            {
                                isEdit?
                                <Select
                                    label='Trạng thái'
                                    style={{
                                    width: '100%',
                                    }}
                                    defaultValue={CV.status}
                                    value={CV.status}
                                    onChange={handleChangeStatus}
                                    optionLabelProp="label"
                            >
                                <Option value={true} label='Public'>Public</Option>
                                <Option value={false} label='Private'>Private</Option>
                            </Select>
                                :
                                    <div className='status'>{
                                        renderStatus()
                                    }</div>
                            }
                        </Form.Item>
                        </Card>
                        <Form.Item>
                            <div className='group-button'>
                                {
                                    renderButtonGroup()
                                }
                            </div>
                        </Form.Item>
                </Form>
            </div>
        </div>
        </div>
    )}else{
        return <Skeleton active />;
    }
}