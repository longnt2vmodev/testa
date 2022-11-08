import { Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import {decodeToken} from 'react-jwt';

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { checkString, checkNumber, checkDate, checkArray } from "../../common/validation";
import { messageRecruitError } from "../../common/error";
import { genderList, levelList, wayWorkingList } from "../../data/list";
const { Option } = Select;
const { TextArea } = Input;

let initialRecruit = {
    _id:-1,
    title: '',
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

let initialCompany = {}

export const AddRecruit = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const [isOpenModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    if(!user||user.role!=="company"){
        navigate('/sign-in');
    }
    const [account, setAccount] = useState(user);
    const [company, setCompany] = useState(initialCompany);
    const [recruit, setRecruit] = useState(initialRecruit);
    const [fields, setFields] = useState([]);
    const defaultTrueStatus = {
        status: 'success',
        errorMsg: null
    }

    //fetch manucomany and Company
    async function fetchManuCompany(){
        try {
            const _id = account._id;
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
                console.log("Lỗi hệ thống!")
                message.error("Lỗi hệ thống!");
            }else{
                console.log("result",result);
                if(result.data==='empty'){
                    setOpenModal(true);
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
            const _id = account._id;
            const url = serverURL + 'company/'+ _id;
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
                    setOpenModal(true);
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
                    changeUser({...result})

                }
            }
            catch (err) {
                console.log(err);
            }
    }

    useEffect(()=>{fetchUser()}, []);
    useEffect(()=>{fetchCompany()},[]);
    useEffect(()=>{fetchField()},[]);

    //initial Validate
    const [validateTitle,setValidateTitle] = useState(defaultTrueStatus);
    const [validateWayWorking,setValidateWayWorking] = useState(defaultTrueStatus);
    const [validateSalary,setValidateSalary] = useState(defaultTrueStatus);
    const [validateQuantity,setValidateQuantity] = useState(defaultTrueStatus);
    const [validateLevel,setValidateLevel] = useState(defaultTrueStatus);
    const [validateAddressWorking,setValidateAddressWorking] = useState(defaultTrueStatus);
    const [validateExperience,setValidateExperience] = useState(defaultTrueStatus);
    const [validateStartDate, setValidateStartDate] = useState(defaultTrueStatus);
    const [validateEndDate, setValidateEndDate] = useState(defaultTrueStatus);
    const [validateRequirement, setValidateRequirement] = useState(defaultTrueStatus);
    const [validateWelfare, setValidateWelfare] = useState(defaultTrueStatus);
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
                errorMsg: messageRecruitError.title
            })
            return false;
        } else {
            setValidateTitle(defaultTrueStatus)
            return true;
        }
    }
    function checkWayWorkingFunc(WayWorking) {
        if (!checkString(WayWorking)) {
            setValidateWayWorking({
                status: 'error',
                errorMsg: messageRecruitError.way_working
            })
            return false;
        } else {
            setValidateWayWorking(defaultTrueStatus)
            return true;
        }
    }
    function checkSalaryFunc(salary) {
        if (!checkNumber(salary)) {
            setValidateSalary({
                status: 'error',
                errorMsg: messageRecruitError.salary
            })
            return false;
        } else {
            setValidateSalary(defaultTrueStatus)
            return true;
        }
    }
    function checkQuantityFunc(Quantity) {
        if (!checkNumber(Quantity)) {
            setValidateQuantity({
                status: 'error',
                errorMsg: messageRecruitError.quantity
            })
            return false;
        } else {
            setValidateQuantity(defaultTrueStatus)
            return true;
        }
    }
    function checkLevelFunc(level) {
        if (!checkString(level)) {
            setValidateLevel({
                status: 'error',
                errorMsg: messageRecruitError.level
            })
            return false;
        } else {
            setValidateLevel(defaultTrueStatus)
            return true;
        }
    }
    function checkAddressWorkingFunc(address_working) {
        if (!checkString(address_working)) {
            setValidateAddressWorking({
                status: 'error',
                errorMsg: messageRecruitError.address_working
            })
            return false;
        } else {
            setValidateAddressWorking(defaultTrueStatus)
            return true;
        }
    }
    function checkExperienceFunc(experience) {
        if (!checkNumber(experience)) {
            setValidateExperience({
                status: 'error',
                errorMsg: messageRecruitError.experience
            })
            return false;
        } else {
            setValidateExperience(defaultTrueStatus)
            return true;
        }
    }
    function checkRequirementFunc(requirement) {
        if (!checkString(requirement)) {
            setValidateRequirement({
                status: 'error',
                errorMsg: messageRecruitError.requirement
            })
            return false;
        } else {
            setValidateRequirement(defaultTrueStatus)
            return true;
        }
    }
    function checkWelfareFunc(welfare) {
        if (!checkString(welfare)) {
            setValidateWelfare({
                status: 'error',
                errorMsg: messageRecruitError.welfare
            })
            return false;
        } else {
            setValidateWelfare(defaultTrueStatus)
            return true;
        }
    }
    function checkStartDateFunc(start_date) {
        console.log('start date');
        if (!checkDate(start_date)) {
            setValidateStartDate({
                status: 'error',
                errorMsg: messageRecruitError.start_date
            })
            return false;
        } else {
            setValidateStartDate(defaultTrueStatus)
            return true;
        }
    }
    function checkEndDateFunc(End_date) {
        if (!checkDate(End_date)) {
            setValidateEndDate({
                status: 'error',
                errorMsg: messageRecruitError.end_date
            })
            return false;
        } else {
            setValidateEndDate(defaultTrueStatus)
            return true;
        }
    }
    function checkFieldFunc(fields){
        console.log("fields",fields);
        if (!checkArray(fields)) {
            setValidateFields({
                status: 'error',
                errorMsg: messageRecruitError.field
            })
            return false;
        } else {
            setValidateFields(defaultTrueStatus)
            return true;
        }
    }
    //handle action
    async function createRecruit(){
        const url = serverURL + 'recruit';
            const data = { ...recruit,id_company: company._id};
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
                    message.success("Bạn đã thêm bài đăng tuyển dụng thành công! Hãy đợi admin duyệt!");
                    fetchCompany();
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
        console.log("company",company);
        count = checkTitleFunc(recruit.title) ? count : count + 1;
        count = checkWayWorkingFunc(recruit.way_working) ? count : count + 1;
        count = checkSalaryFunc(recruit.salary) ? count : count + 1;
        count = checkQuantityFunc(recruit.quantity) ? count : count + 1;
        count = checkLevelFunc(recruit.level) ? count : count + 1;
        count = checkAddressWorkingFunc(recruit.address_working) ? count : count + 1;
        count = checkExperienceFunc(recruit.experience) ? count : count + 1;
        count = checkRequirementFunc(recruit.requirement) ? count : count +1;
        count = checkWelfareFunc(recruit.welfare) ? count : count + 1;
        count = checkStartDateFunc(recruit.start_date) ? count : count + 1;
        count = checkEndDateFunc(recruit.end_date) ? count : count + 1;
        count = checkFieldFunc(recruit.fields) ? count : count + 1;
         console.log("count",count);
         console.log(recruit)
        if(count===0){
            createRecruit();
        }
        return;
    }

    const renderButtonGroup = ()=>{
            return (
                <Button type='submit' 
                    className='button edit-btn' 
                    onClick={handleSave}>
                    Thêm
                </Button>
            )
    }
    function handleChangeTitle(e) {
        setRecruit((preRecruit) => { return { ...preRecruit, title: e.target.value } });
    }
    function handleChangeWayWorking(value) {
        console.log(value);
        setRecruit((preRecruit) => { return { ...preRecruit, way_working: value } });
    }
    function handleChangeSalary(value) {
        setRecruit((preRecruit) => { return { ...preRecruit, salary: value } });
    }
    function handleChangeQuatity(value) {
        setRecruit((preRecruit) => { return { ...preRecruit, quantity: value } });
    }
    function handleChangeLevel(value) {
        setRecruit((preRecruit) => { return { ...preRecruit, level: value } });
    }
    function handleChangeAddressWorking(e) {
        setRecruit((preRecruit) => { return { ...preRecruit, address_working: e.target.value } });
    }
    function handleChangeExperience(value) {
        setRecruit((preRecruit) => { return { ...preRecruit, experience: value } });
    }
    function handleChangeDescription(e){
        setRecruit((preRecruit)=>{ return {...preRecruit, description:e.target.value}})
    }
    function handleChangeRequirement(e){
        setRecruit((preRecruit)=>{ return {...preRecruit, requirement:e.target.value}})
    }
    function handleChangeWelfare(e){
        setRecruit((preRecruit)=>{ return {...preRecruit, welfare:e.target.value}})
    }
    function handleChangeStartDate(date, dateString){
        setRecruit((preRecruit)=>{ return {...preRecruit, start_date:dateString}})
    }
    function handleChangeEndDate(date, dateString){
        setRecruit((preRecruit)=>{ return {...preRecruit, end_date:dateString}})
    }
    function handleChangeFields(value){
        console.log("value",value);
        setRecruit((preRecruit)=>{ return {...preRecruit, fields:value}})
    }
    function handleChangeGender(value){
        console.log("value",value);
        setRecruit((preRecruit)=>{ return {...preRecruit, gender:value}})
    }
    
    //render UI
    return (<div className='swapper-container'>
        <div className='introduce-frame'>
            <div className='background-image center'>
                <p className='title-account center '>Thêm bài đăng tuyển dụng</p>

            </div>
        </div>
        <div className='detail-swapper'>
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
                    <div className="title-recruit">
                        <Form.Item
                            label="Tiêu đề bài đăng:"
                            name="title"
                            initialValue={recruit.title}
                            validateStatus={validateTitle.status}
                            help={validateTitle.errorMsg}
                            className='label'
                            required
                        >
                            <Input
                                className='input-login max-width'
                                placeholder="Nhập tiêu đề bài đăng tuyển dụng"
                                autoFocus={true}
                                value={recruit.title}
                                onChange={handleChangeTitle}
                            />
                        </Form.Item>
                    </div>
                    <Card title="Chi tiết bài đăng tuyển dụng">
                    <div className='two-colums'>
                        
                        <Form.Item
                            label="Lương:"
                            name="salary"
                            initialValue={recruit.salary}
                            validateStatus={validateSalary.status}
                            help={validateSalary.errorMsg}
                            className='label'
                            required
                        >
                                <InputNumber
                                    className='input-login max-width'
                                    style={{width: '100%'}}
                                    placeholder="Nhập lương"
                                    step={1}
                                    autoFocus={true}
                                    value={recruit.salary}
                                    defaultValue={recruit.salary}
                                    onChange={handleChangeSalary}
                                />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng tuyển:"
                            name="quantity"
                            initialValue={recruit.quantity}
                            validateStatus={validateQuantity.status}
                            help={validateQuantity.errorMsg}
                            className='label'
                            required
                        >
                            <InputNumber
                                className='input-login max-width'
                                style={{width: '100%'}}
                                placeholder="Nhập số lượng tuyển dụng"
                                step={1}
                                autoFocus={true}
                                value={recruit.quantity}
                                defaultValue={recruit.quantity}
                                onChange={handleChangeQuatity}
                            />
                        </Form.Item>
                        
                        <Form.Item
                            label="Địa chỉ làm việc:"
                            name="address_working"
                            validateStatus={validateAddressWorking.status}
                            help={validateAddressWorking.errorMsg}
                            className='label'
                            required
                        >
                            <Input
                                className='input-login max-width'
                                placeholder="Nhập địa chỉ website"
                                autoFocus={true}
                                value={recruit.address_working}
                                defaultValue= {recruit.address_working}
                                onChange={handleChangeAddressWorking}
                            />
                        </Form.Item>
                        
                        <Form.Item
                            label="Kinh nghiệm:"
                            name="experience"
                            initialValue={recruit.experience}
                            validateStatus={validateExperience.status}
                            help={validateExperience.errorMsg}
                            className='label'
                            required
                        >
                            <InputNumber
                                className='input-login max-width'
                                style={{width: '100%'}}
                                placeholder="Nhập số tháng kinh nghiệm"
                                step={1}
                                autoFocus={true}
                                value={recruit.experience}
                                defaultValue={recruit.experience}
                                onChange={handleChangeExperience}
                            />
                        </Form.Item>
            
                        <Form.Item
                            label="Phương thức làm việc:"
                            name="way_working"
                            validateStatus={validateWayWorking.status}
                            help={validateWayWorking.errorMsg}
                            className='label'
                            required
                        >
                            <Select
                                label='Phương thức làm việc'
                                style={{
                                width: '100%',
                                }}
                                defaultValue={recruit.way_working}
                                onChange={handleChangeWayWorking}
                            >
                                    {
                                        wayWorkingList.map((way_working)=>{
                                            return (
                                                <Option value={way_working} label={way_working}>
                                                    <div className="demo-option-label-item">
                                                        {way_working}
                                                    </div>
                                                </Option>
                                            )
                                        })
                                    }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ:"
                            name="level"
                            validateStatus={validateLevel.status}
                            help={validateLevel.errorMsg}
                            className='label'
                            required
                        >
                            <Select
                                label='Chức vụ'
                                style={{
                                width: '100%',
                                }}
                                defaultValue={recruit.level}
                                onChange={handleChangeLevel}
                            >
                                    {
                                        levelList.map((level)=>{
                                            return (
                                                <Option value={level} label={level}>
                                                    <div className="demo-option-label-item">
                                                        {level}
                                                    </div>
                                                </Option>
                                            )
                                        })
                                    }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Giới tính:"
                            name="gender"
                            className='label'
                        >
                            <Select
                                label='Giới tính'
                                style={{
                                width: '100%',
                                }}
                                onChange={handleChangeGender}
                            >
                                    {
                                        genderList.map((gender)=>{
                                            return (
                                                <Option value={gender.id} label={gender.label}>
                                                    <div className="demo-option-label-item">
                                                        {gender.label}
                                                    </div>
                                                </Option>
                                            )
                                        })
                                    }
                            </Select>
                        </Form.Item>
                        
                        <Form.Item
                            label="Lĩnh vực:"
                            name="fields"
                            validateStatus={validateFields.status}
                            help={validateFields.errorMsg}
                            className='label'
                            required
                        >
                            <Select
                                mode='multiple'
                                label='Lĩnh vực'
                                style={{
                                width: '100%',
                                }}
                                placeholder="Hãy chọn ít nhất một lĩnh vực"
                                defaultValue={recruit.fields}
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
                            </Select>
                        </Form.Item>
                    </div>
                        <Form.Item
                            label="Thông tin mô tả công việc:"
                            name="description"
                            initialValue={recruit.description}
                            className='label'
                        >
                            <TextArea rows={5} value={recruit.description} 
                                defaultValue={recruit.description} 
                                onChange= {handleChangeDescription}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Thông tin yêu cầu ứng tuyển:"
                            name="requirement"
                            initialValue={recruit.requirement}
                            validateStatus={validateRequirement.status}
                            help={validateRequirement.errorMsg}
                            className='label'
                            required
                        >
                            <TextArea rows={5} value={recruit.requirement} 
                                defaultValue={recruit.requirement} 
                                onChange= {handleChangeRequirement}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Thông tin quyền lợi:"
                            name="welfare"
                            initialValue={recruit.welfare}
                            validateStatus={validateWelfare.status}
                            help={validateWelfare.errorMsg}
                            className='label'
                            required
                        >
                            <TextArea rows={5} value={recruit.welfare} 
                                defaultValue={recruit.welfare} 
                                onChange= {handleChangeWelfare}
                            />
                        </Form.Item>
                        <div className='two-colums'>
                            <Form.Item
                                label="Ngày bắt đầu:"
                                name="start_date"
                                className='label'
                                validateStatus={validateStartDate.status}
                                help={validateStartDate.errorMsg}
                                required
                            >
                                <DatePicker className='birthday-input'
                                    value={recruit.start_date}
                                    onChange={handleChangeStartDate} 
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ngày kết thúc:"
                                name="end_date"
                                className='label'
                                validateStatus={validateEndDate.status}
                                help={validateEndDate.errorMsg}
                                required
                            >
                                <DatePicker className='birthday-input'
                                    value={recruit.end_date}
                                    onChange={handleChangeEndDate} 
                                />
                            </Form.Item>
                        </div>
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
        <Modal  title="Xác nhận" open={isOpenModal} onOk={()=>setOpenModal(false)} onCancel={()=>setOpenModal(false)}>
            <p>Bạn hãy cập nhật thông tin để sử dụng các chức năng website!</p>
        </Modal>
        </div>
    )
}