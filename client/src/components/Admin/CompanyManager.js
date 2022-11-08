import { Button, Input, message, Select, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { CheckCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { scaleList } from '../../data/list';
import { serverURL } from '../../configs/server.config';

const { Option } = Select;
export const CompanyManager = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    if(!user||user.role!=='admin'){
        message.warn('Bạn ko có quyền xem trang này');
        navigate('/home')
    }
    const [scaleBound, setScaleBound] = useState(-1);
    const [status, setStatus] = useState(-1);
    const [search, setSearch] = useState('');
    const [listUser, setListUser] = useState([]);
    async function fetchListCompany(){
        let query = '?1=1';
                query = status!==-1? query+'&status='+status:query;
                query = scaleBound!==-1? query+'&scaleBound='+scaleBound:query;
                query = search!==''? query+'&search='+search:query;
                const url = serverURL + 'company'+ query;
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
                        setListUser(result.data);
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
                  if(!result||result.role!=='admin'){
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
    useEffect(()=>{
        fetchListCompany();
    },[scaleBound, status, search])
    
    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
            key: '_id',
            fixed: 'left',
        },
        {
            title: 'Tên công ty',
            dataIndex: 'com_name',
            key: 'com_name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Năm thành lập',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'com_phone',
            key: 'com_phone',
        },
        {
            title: 'Email',
            dataIndex: 'com_email',
            key: 'com_email',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
        },
        {
            title: 'Số lao động',
            dataIndex: 'scale',
            key: 'scale',
        },
        {
            title: 'Giới thiệu',
            dataIndex: 'introduction',
            key: 'introduction',
        },
        {
            title: 'Ngành sản xuất',
            key: 'manufactures',
            render: (_,record) =>{ return (<>{
                record.manufactures.map((manu) => {return(
                    <Tag className="tag" color="cyan">{manu.name_manu}</Tag>)
                })
            }</>)
            }
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                     record.status?
                        <Tag icon={<CheckCircleOutlined />} 
                            color="success">
                            duyệt
                        </Tag>
                        :
                        <Tag icon={<MinusCircleOutlined />} color="default">
                            chưa duyệt
                        </Tag>
            ),
            fixed: 'right',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Link to={`../admin/company/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeScale= (e)=>{
        setScaleBound(e.value);
    }
    const handleChangeSelect = (e)=>{
        setStatus(e.value);
    }
    const handleChangeSearch = (e)=>{
        setSearch(e.target.value);
    }

    return (
        <>
            <div className='banner-content'>Quản lý danh sách doanh nghiệp</div>
            <div className='container-filter'>
                <div className='filter'>
                    <label className='label-filter'>Số lao động:</label>
                    <Select
                        value={scaleBound}
                        defaultValue='all'
                        labelInValue='Số lao động'
                        className='filter-content'
                        onChange={handleChangeScale}
                    >
                        <Option value={-1}>all</Option>
                        {
                            scaleList.map((scale)=>{
                                return (<Option key={scale} value={scale}>{scale}</Option>)
                            })
                        }
                    </Select>
                </div>
                <div className='filter'>
                    <label className='label-filter'>Trạng thái:</label>
                    <Select
                        value={status}
                        defaultValue='all'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>all</Option>
                        <Option value={1}>duyệt</Option>
                        <Option value={0}>chưa duyệt</Option>
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
            <Table 
                dataSource={listUser} 
                columns={columns} 
                scroll={{
                    x: 800,
                    y: 800,
                }}
            />;
        </>
    )
}
