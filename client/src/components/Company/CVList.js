import { Avatar, Button, Image, Input, message, Pagination, Select, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {decodeToken} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { serverURL } from '../../configs/server.config';
import '../../styles/list.css'

const { Option } = Select;
export const CVList = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [field, setField] = useState([]);
    const [search, setSearch] = useState('');
    const [listCV, setListCV] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5)
    const [total, setPageTotal] = useState(1);

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
                console.log("fetchField", result.data);
                setFields(result.data);
            }
        }
        catch (err) {
            console.log(err);
            message.error("Đã có lỗi xảy ra!");
        }
    }

    async function fetchListCV(){
                let query = '?pageIndex='+pageIndex+'&pageSize='+pageSize;
                query = field.length? query+'&field='+field:query;
                query = search!==''? query+'&search='+search:query;
                const url = serverURL + 'CV'+ query;
                console.log(query);
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
                        message.error("Lỗi hệ thống!");
                    }else{
                        console.log("result",result)
                        setPageTotal(result.total);
                        setListCV(result.data);
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
                    changeUser({...result})
                }
            }
            catch (err) {
                console.log(err);
            }
    }

    useEffect(()=>{fetchUser()}, []);
    useEffect(()=>{fetchField();},[]);
    useEffect(()=>{fetchListCV();},[pageIndex, pageSize,field, search, user])
    const handleChangeField = (e)=>{
        console.log(e);
        const value = e.map(item=>{
            return item.value
        })
        setField([...value]);
        setPageIndex(1);
    }

    const handleChangeSearch = (e)=>{
        setSearch(e.target.value);
        setPageIndex(1);
    }
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        setPageIndex(current);
    };
    return (
        <>
            <div className='banner-content'>Quản lý danh sách CV</div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Lĩnh vực CV:</label>
                    <Select
                    mode='multiple'
                        value={field}
                        defaultValue='all'
                        labelInValue='Lĩnh vực CV'
                        className='filter-content'
                        onChange={handleChangeField}
                    >
                        {
                            fields.map((field)=>{
                                return (<Option key={field._id} value={field._id}>{field.nameField}</Option>)
                            })
                        }
                    </Select>
                </div>
                
                <div className='filter'>
                    <label className='transparent'>Tìm kiếm</label>
                    <div className='search'>
                        <Input className='input search-input' placeholder='Nhập thông tin cần tìm' value={search} onChange={handleChangeSearch}>
                        </Input>
                        <Button type="primary" icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>

            <div class="flex-container-list">
                {
                    listCV.map(
                        (CV)=>{
                            return (
                                <div class="flex-item bg-one tilt">
                                    <Link to={`../student/${CV._id}`} >
                                    <Image className='background-image-cv' src={CV.file_cv} preview={false}/>
                                    <div className='content'>
                                        <p className='title-cv'>{CV.title}</p>
                                    </div>
                                    <div className='author'>
                                        <Avatar className='avatar-author' size= {30} icon={<UserOutlined />} />
                                        <div className='name-author'>{user.fullname}</div>
                                    </div>
                                    <div className='field-list'>
                                        {
                                            CV.fields.map((field)=>{
                                                return(
                                                    <Tag color="orange" className='tag-cv'>{field.nameField}</Tag>
                                                )
                                            })
                                        }
                                    </div>
                                    </Link>
                            </div>
                            )
                        }
                    )
                }
            </div>
            <div className='pagination'>
            <Pagination
                showSizeChanger
                pageSize={pageSize}
                onChange={onShowSizeChange}
                defaultCurrent={pageIndex}
                total={total}
            />
            </div>
        </>
    )
}
