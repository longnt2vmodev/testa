import { Button, Card, Image, Input, message, Pagination, Select, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { serverURL } from '../../configs/server.config';
import '../../styles/list.css'
import { DateToShortStringDate } from '../../common/service';

const { Option } = Select;
export const RecruitListStudent = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [fields, setFields] = useState([]);
    const [field, setField] = useState([]);
    const [experience, setExperience] = useState(-1);
    const [search, setSearch] = useState('');
    const [listRecruit, setListRecruit] = useState([]);
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

    async function fetchListRecruit(){
                let query = '?status=1&pageIndex='+pageIndex+'&pageSize='+pageSize;
                query = field.length? query+'&field='+field:query;
                query = experience!==-1? query+'&experience='+experience:query;
                query = search!==''? query+'&search='+search:query;
                const url = serverURL + 'recruit'+ query;
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
                        setListRecruit(result.data);
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
    useEffect(()=>{fetchField();},[]);
    useEffect(()=>{fetchListRecruit();},[pageIndex, pageSize,field, experience, search, user])
    const handleChangeField = (e)=>{
        console.log(e);
        const value = e.map(item=>{
            return item.value
        })
        setField([...value]);
        setPageIndex(1);
    }

    const handleChangeSelect = (e)=>{
        setExperience(e.value);
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
            <div className='banner-content'>Quản lý danh sách bài đăng</div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Lĩnh vực bài đăng:</label>
                    <Select
                    mode='multiple'
                        value={field}
                        defaultValue='all'
                        labelInValue='Lĩnh vực bài đăng'
                        className='filter-content'
                        onChange={handleChangeField}
                    >
                        {/* <Option>all</Option> */}
                        {
                            fields.map((field)=>{
                                return (<Option key={field._id} value={field._id}>{field.nameField}</Option>)
                            })
                        }
                    </Select>
                </div>
                {/* <div className='filter'>
                    <label className='label-filter'>Địa điểm:</label>
                    <Select
                    mode='multiple'
                        value={field}
                        defaultValue='all'
                        labelInValue='Địa điểm'
                        className='filter-content'
                        onChange={handleChangeField}
                    >
                        <Option value={-1}>all</Option>
                        {
                            fields.map((field)=>{
                                return (<Option key={field._id} value={field._id}>{field.nameField}</Option>)
                            })
                        }
                    </Select>
                </div> */}
                <div className='filter'>
                    <label className='label-filter'>Kinh nghiệm:</label>
                    <Select
                        value={experience}
                        defaultValue='all'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>Tất cả</Option>
                        <Option value={0}>Không yêu cầu</Option>
                        <Option value={1}>Dưới 1 năm</Option>
                        <Option value={2}>Từ 1 tới 5 năm</Option>
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

            <div className='list-container'>
                {
                    listRecruit.map((recruit)=>{
                        return (
                            <Card className='card-recruit'
                                cover={
                                    <div className='title-recruit'>
                                        {recruit.title}
                                    </div>
                              }
                                actions={[
                                  ]}
                                >
                                <div className= 'grid-layout'>
                                <div className='top-content'>
                                    <Image
                                        width={100}
                                        src="https://i.ibb.co/4KBQVdk/Hiring-rafiki.png"
                                        /> 
                                        
                                    <div className='com_name'>{recruit.company.com_name}</div>
                                </div>
                                <div className='middle-content'>
                                    <div className='content'>
                                        Lĩnh vực:
                                        {
                                            recruit.fields.map((field) => {
                                                return(
                                                <Tag color='purple'>{field.nameField}</Tag>
                                            )})
                                        }
                                    </div>
                                    <div className='content'>
                                        Kinh nghiệm:
                                        {
                                            recruit.experience===0? <Tag color=''>Không yêu cầu</Tag>: 
                                            recruit.experience>0&& recruit.experience<12?  <Tag color='volcano'>Dưới 1 năm</Tag>:
                                            <Tag color='magenta'>Trên 1 năm</Tag>
                                        }
                                    </div>
                                    <div className='content'>
                                        Hạn chót: {DateToShortStringDate(recruit.end_date)}
                                    </div>
                                    <Link to={`../recruit/${recruit._id},${recruit.id_company}`}><SettingOutlined key="setting" /> Xem chi tiết...</Link>,
                                </div>
                            </div>
                            </Card>
                        )
                    })
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
