import { Button, Input, message, Select, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {decodeToken , isExpired} from 'react-jwt';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { SearchOutlined } from '@ant-design/icons';
import { scaleList } from '../../data/list';
import { serverURL } from '../../configs/server.config';

const { Option } = Select;
export const CompanyList = () => {
    const { user, changeUser, token } = useContext(UserContext);
    const navigate = useNavigate();
    if(!user||user.role!=='student'){
        message.warn('Bạn ko có quyền xem trang này');
        navigate('/home')
    }
    const [scaleBound, setScaleBound] = useState(-1);
    const [manufactures, setManufactures] = useState([{_id:'', name_manu: ''}]);
    const [manufacture, setManufacture] = useState(-1);
    const [search, setSearch] = useState('');
    const [listUser, setListUser] = useState([]);
    //fetch Manufacture
    async function fetchManufacture(){
        const url = serverURL + 'manufacture';
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
                message.success("Load manufacture thành công!");
                setManufactures(result.data);
            }
        }
        catch (err) {
            console.log(err);
            message.error("Đã có lỗi xảy ra!");
        }
    }
    async function fetchListCompany(){
        let query = '?status=1';
                query= manufacture!==-1? query+'&manufacture='+manufacture:query;
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
    useEffect(()=>{
        fetchManufacture();
    },[])
    useEffect(()=>{
        fetchListCompany();
    },[scaleBound, manufacture, search])
    
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
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Link to={`../company/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeScale= (e)=>{
        setScaleBound(e.value);
    }
    const handleChangeSelect = (e)=>{
        setManufacture(e.value);
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
                    <label className='label-filter'>Ngành sản xuất:</label>
                    <Select
                        value={manufacture}
                        defaultValue='all'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>all</Option>
                        {
                            manufactures.map((manufacture)=>{
                                return (
                                    <Option value={manufacture._id} label={manufacture.name_manu}>
                                        <div className="demo-option-label-item">
                                            {manufacture.name_manu}
                                        </div>
                                    </Option>
                                )
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
