import { Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Select, Tag } from "antd";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {decodeToken , isExpired} from 'react-jwt';

import { serverURL } from "../../configs/server.config";
import { UserContext } from "../User/UserProvider"
import '../../styles/form.css'
import '../../styles/my-account.css'
import { checkString, checkNumber, checkDate, checkArray } from "../../common/validation";
import { messageRecruitError } from "../../common/error";
import { genderList, levelList, wayWorkingList } from "../../data/list";
import { DateToShortString } from "../../common/service";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
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

let initialCompany = {}

export const RecruitProfile = ()=>{
    const {user, changeUser, token} = useContext(UserContext);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();
    if(!user||user.role!=="company"){
        navigate('/sign-in');
    }
    const {id} = useParams();
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
                console.log("L???i h??? th???ng!")
                message.error("L???i h??? th???ng!");
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
                console.log("L???i h??? th???ng!")
                message.error("L???i h??? th???ng!");
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
                    message.success("Load field th??nh c??ng!");
                    setFields(result.data);
                }
            }
            catch (err) {
                console.log(err);
                message.error("???? c?? l???i x???y ra!");
            }
    }
    async function fetchRecruit(){
        const url = serverURL + 'recruit/'+id;
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
                  if(!result||result.role!=='company'){
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
    useEffect(()=>{fetchUser()},[]);
    useEffect(()=>{fetchRecruit()},[]);
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
    async function updateRecruit(){
        const url = serverURL + 'recruit/'+id;
            const data = { ...recruit, update_id: company._id};
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
                if(response.status!==201){
                    message.error(result.message);
                }else{
                    message.success("B???n ???? c???p nh???t b??i ????ng tuy???n d???ng th??nh c??ng!");
                    // fetchCompany();
                }
            }
            catch (err) {
                console.log(err);
                message.error("???? c?? l???i x???y ra!");
            }
    }

    async function deleteRecruit(){
        const url = serverURL + 'recruit/'+id;
        const data = {delete_id: account._id}
            console.log("request", data)
            try {
                const response = await fetch(url, {
                    method: 'DELETE',
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
                    message.success("B???n ???? x??a b??i ????ng tuy???n d???ng th??nh c??ng!");
                    navigate('/');
                }
            }
            catch (err) {
                console.log(err);
                message.error("???? c?? l???i x???y ra!");
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
            updateRecruit();
        }
        return;
    }

    async function handleEdit(e) {
        await fetchRecruit();
        setIsEdit(true);
        console.log('edit', recruit)
        // return;
    }
    async function handleDelete(e){
        setOpenModal(true);
        return;
    }
    async function handleCancel(e) {
        setIsEdit(false);
        fetchRecruit();
        return;
    }
    async function handleConfirmDelete(e) {
        setOpenModal(false);
        deleteRecruit();
        return;
    }
    async function handleCancelDelete(e) {
        setOpenModal(false);
        message.info("B???n x??c nh???n kh??ng x??a!");
        return;
    }
    const renderButtonGroup = () => {
        if (!isEdit) {
            return (<>
                <Button type='submit' className='button edit-btn' onClick={handleEdit}>S???a</Button>
                <Button type='submit' className='button delete-btn' onClick={handleDelete}>X??a</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button type='submit' className='button save-btn' onClick={handleSave}>L??u</Button>
                    <Button type='reset' className='button cancel-btn' onClick={handleCancel}>H???y</Button>
                </>
            )
        }
    }
    const renderStatus = ()=>{
        if(recruit.status){
            return (
            <Tag icon={<CheckCircleOutlined />} 
                color="success">
                ???? duy???t
            </Tag>)
        }else{
            return (
                <Tag icon={<MinusCircleOutlined />} color="default">
                    Ch??a duy???t
                </Tag>
            )
        }
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
                <p className='title-account center '>Chi ti???t b??i ????ng tuy???n d???ng</p>

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
                >
                    <div className="title-recruit">
                        <Form.Item
                            label="Ti??u ????? b??i ????ng:"
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
                                    placeholder="Nh???p ti??u ????? b??i ????ng tuy???n d???ng"
                                    defaultValue={recruit.title}
                                    value={recruit.title}
                                    onChange={handleChangeTitle}
                                />
                                :
                                <p className="text-display">{recruit.title}</p>
                            }
                            
                        </Form.Item>
                    </div>
                    <Card title="Chi ti???t b??i ????ng tuy???n d???ng">
                    <div className='two-colums'>
                        
                        <Form.Item
                            label="L????ng:"
                            name="salary"
                            initialValue={recruit.salary}
                            validateStatus={validateSalary.status}
                            help={validateSalary.errorMsg}
                            className='label'
                            required
                        >
                            {
                                isEdit?
                                <InputNumber
                                    className='input-login max-width'
                                    style={{width: '100%'}}
                                    placeholder="Nh???p l????ng"
                                    step={1}
                                    value={recruit.salary}
                                    defaultValue={recruit.salary}
                                    onChange={handleChangeSalary}
                                />
                                :
                                <p className="text-display">{recruit.salary}</p>
                            }
                        </Form.Item>

                        <Form.Item
                            label="S??? l?????ng tuy???n:"
                            name="quantity"
                            validateStatus={validateQuantity.status}
                            help={validateQuantity.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                                <InputNumber
                                    className='input-login max-width'
                                    style={{width: '100%'}}
                                    placeholder="Nh???p s??? l?????ng tuy???n d???ng"
                                    step={1}
                                    autoFocus={true}
                                    value={recruit.quantity}
                                    defaultValue={recruit.quantity}
                                    onChange={handleChangeQuatity}
                                />
                                :
                                <p className="text-display">{recruit.quantity}</p>
                            }
                        </Form.Item>
                        
                        <Form.Item
                            label="?????a ch??? l??m vi???c:"
                            name="address_working"
                            validateStatus={validateAddressWorking.status}
                            help={validateAddressWorking.errorMsg}
                            className='label'
                            required
                        >
                            {
                                isEdit?
                                    <Input
                                        className='input-login max-width'
                                        placeholder="Nh???p ?????a ch??? website"
                                        autoFocus={true}
                                        value={recruit.address_working}
                                        defaultValue= {recruit.address_working}
                                        onChange={handleChangeAddressWorking}
                                    />
                                :
                                <p className="text-display">{recruit.address_working}</p>
                            }
                        </Form.Item>
                        
                        <Form.Item
                            label="Kinh nghi???m:"
                            name="experience"
                            validateStatus={validateExperience.status}
                            help={validateExperience.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <InputNumber
                                className='input-login max-width'
                                style={{width: '100%'}}
                                placeholder="Nh???p s??? th??ng kinh nghi???m"
                                step={1}
                                autoFocus={true}
                                value={recruit.experience}
                                defaultValue={recruit.experience}
                                onChange={handleChangeExperience}
                            />:
                            <p className="text-display">{recruit.experience}</p>
                        }
                        </Form.Item>
            
                        <Form.Item
                            label="Ph????ng th???c l??m vi???c:"
                            name="way_working"
                            validateStatus={validateWayWorking.status}
                            help={validateWayWorking.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <Select
                                label='Ph????ng th???c l??m vi???c'
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
                            </Select>:
                            <p className="text-display">{recruit.way_working}</p>
                        }
                        </Form.Item>
                        <Form.Item
                            label="Ch???c v???:"
                            name="level"
                            validateStatus={validateLevel.status}
                            help={validateLevel.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <Select
                                label='Ch???c v???'
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
                            </Select>:
                            <p className="text-display">{recruit.level}</p>
                        }
                        </Form.Item>
                        <Form.Item
                            label="Gi???i t??nh:"
                            name="gender"
                            className='label'
                        >
                        {
                            isEdit?
                            <Select
                                label='Gi???i t??nh'
                                style={{
                                width: '100%',
                                }}
                                defaultValue={recruit.gender}
                                onChange={handleChangeGender}
                                optionLabelProp="label"
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
                            </Select>:
                                <p className="text-display">{recruit.gender===null?'all':recruit.gender===false?'nam':'n???'}</p>
                            }
                        </Form.Item>
                        
                        <Form.Item
                            label="L??nh v???c:"
                            name="fields"
                            // initialValue={recruit.fields}
                            validateStatus={validateFields.status}
                            help={validateFields.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <Select
                                mode='multiple'
                                label='L??nh v???c'
                                style={{
                                width: '100%',
                                }}
                                defaultValue={recruit.fields.map(item=>{return item._id})}
                                value={recruit.fields}
                                placeholder="H??y ch???n ??t nh???t m???t l??nh v???c"
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
                                    recruit.fields.length?
                                    recruit.fields.map((field)=>{
                                        return <Tag className="tag" color="cyan">{field.nameField}</Tag>
                                    }):
                                    <p className="text-display"></p>
                                }
                                </div>
                            }
                        </Form.Item>
                    </div>
                        <Form.Item
                            label="Th??ng tin m?? t??? c??ng vi???c:"
                            name="description"
                            className='label'
                        >
                            {
                                isEdit?
                            <TextArea rows={5} value={recruit.description} 
                                defaultValue={recruit.description} 
                                onChange= {handleChangeDescription}
                            />:
                            <p className="text-display">{recruit.description}</p>
                        }
                        </Form.Item>
                        <Form.Item
                            label="Th??ng tin y??u c???u ???ng tuy???n:"
                            name="requirement"
                            validateStatus={validateRequirement.status}
                            help={validateRequirement.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <TextArea rows={5} value={recruit.requirement} 
                                defaultValue={recruit.requirement} 
                                onChange= {handleChangeRequirement}
                            />:
                            <p className="text-display">{recruit.requirement}</p>
                        }
                        </Form.Item>
                        <Form.Item
                            label="Th??ng tin quy???n l???i:"
                            name="welfare"
                            validateStatus={validateWelfare.status}
                            help={validateWelfare.errorMsg}
                            className='label'
                            required
                        >
                        {
                            isEdit?
                            <TextArea rows={5} value={recruit.welfare} 
                                defaultValue={recruit.welfare} 
                                onChange= {handleChangeWelfare}
                            />:
                            <p className="text-display">{recruit.welfare}</p>
                        }
                        </Form.Item>
                        <div className='two-colums'>
                            <Form.Item
                                label="Ng??y b???t ?????u:"
                                name="start_date"
                                className='label'
                                validateStatus={validateStartDate.status}
                                help={validateStartDate.errorMsg}
                                required
                            >
                            {
                                isEdit?
                                <DatePicker className='birthday-input'
                                    value={recruit.start_date}
                                    onChange={handleChangeStartDate} 
                                    defaultValue= {moment(moment(recruit.start_date),'DD/MM/YYYY')}
                                />:
                                <p className="text-display">{DateToShortString(recruit.start_date)}</p>
                            }
                            </Form.Item>
                            <Form.Item
                                label="Ng??y k???t th??c:"
                                name="end_date"
                                className='label'
                                validateStatus={validateEndDate.status}
                                help={validateEndDate.errorMsg}
                                required
                            >
                            {
                                isEdit?
                                <DatePicker className='birthday-input'
                                    value={recruit.end_date}
                                    onChange={handleChangeEndDate} 
                                    defaultValue= {moment(moment(recruit.end_date),'DD/MM/YYYY')}
                                />:
                                <p className="text-display">{DateToShortString(recruit.end_date)}</p>
                            }
                            </Form.Item>
                        </div>
                        <Form.Item name='status' label="Tr???ng th??i">
                                    <div className='status'>{
                                        renderStatus()
                                    }</div>
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
        <Modal  title="X??c nh???n" open={isOpenModal} onOk={handleConfirmDelete} onCancel={handleCancelDelete}>
            <p>B???n c?? ch???c ch???n mu???n x??a!</p>
        </Modal>
        </div>
    )
}