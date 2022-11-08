import { Button, Input, message, Pagination, Select, Table, Tag } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../User/UserProvider';
import '../../styles/manager-page.css'
import { serverURL } from '../../configs/server.config';
import { CheckCircleOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { DateToShortStringDate } from '../../common/service';

const { Option } = Select;

export const AccountManager = () => {
    const { user } = useContext(UserContext);
    console.log('AccountManager', user);
    const [status, setStatus] = useState(-1);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotal] = useState(0);
    const [listUser, setListUser] = useState([]);
    const navigate = useNavigate();
    if(!user||user.role!=='admin'){
        navigate('/');
    }
    const getAccountList = ()=>{
            async function fetchData(){
                let query = '?current='+current;
                query = status!==-1? query+'&status='+status:query;
                query = search!==-1? query+'&search='+search:query;
                const url = serverURL + 'account'+ query;
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
                        console.log(result)
                        setListUser(result.data);
                        setTotal(result.totalPage);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            console.log('fetch data');
        fetchData();
        };
    useEffect( getAccountList,[current, search, status]);

    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
            key: '_id',
            fixed: 'left',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            fixed: 'left',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Ngày sinh',
            // dataIndex: 'birthday',
            key: 'birthday',
            render: (_,record) =>{ 
                return record.birthday? <>{DateToShortStringDate(record.birthday)}</>:''
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vị trí',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                     record.status?
                        <Tag icon={<CheckCircleOutlined />} 
                            color="success">
                            active
                        </Tag>
                        :
                        <Tag icon={<MinusCircleOutlined />} color="default">
                            inactive
                        </Tag>
            ),
            fixed: 'right',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Link to={`../account/${record._id}`}>Xem chi tiết</Link>
            ),
            fixed: 'right',
        },
    ];

    const handleChangeSelect = (e)=>{
        setStatus(e.value);
    }

    const handleChangeSearch = (e)=>{
        console.log(e.target.value);
        setSearch(e.target.value);
    }

    const handleChangePage = (value)=>{
        setCurrent(value);
    }

    return (
        <>
            <div className='banner-content'>Quản lý danh sách tài khoản</div>
            <div className='container-filter'>
                <div className='filter'>
                    <label>Trạng thái:</label>
                    <Select
                        value={status}
                        defaultValue='all'
                        labelInValue='Trạng thái'
                        className='filter-content'
                        onChange={handleChangeSelect}
                    >
                        <Option value={-1}>all</Option>
                        <Option value={1}>active</Option>
                        <Option value={0}>inactive</Option>
                    </Select>
                </div>
                <div className='filter'>
                    <label className='transparent'>Tìm kiếm</label>
                    <div className='search'>
                        <Input className='input' placeholder='Nhập thông tin cần tìm' value={search} onChange={handleChangeSearch}>
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
                pagination={false}
            />;
            <Pagination 
                pageSize= {1}
                current = {current}
                    // defaultCurrent: 1,
                onChange= {handleChangePage}
                total={totalPage}
                />
        </>
    )
}
