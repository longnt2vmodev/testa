import { Button, Form, Input, message, Tooltip, Typography } from "antd"
import { useContext, useRef, useState } from "react";

import '../../styles/form.css';
import { checkConfirmPass, checkPassword } from '../../common/validation';
import { UserContext } from "./UserProvider";
import { InfoCircleOutlined, KeyOutlined } from "@ant-design/icons";
import { messageChangePass, messageSignUpError } from '../../common/error';
import { serverURL } from "../../configs/server.config";
import { useNavigate } from "react-router-dom";


export const ChangePassword = ({ setIsOpenModal }) => {

    const { user } = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const ref = useRef();
    const refButtonSubmit = useRef();
    const refOldPassword = useRef();
    const navigate = useNavigate();

    function handleKeyUp(e) {
        if (e.keyCode === 13) {
            console.log('enter');
            refButtonSubmit.current.focus();
            refButtonSubmit.current.click();
        }
    }

    const defaultTrueStatus = {
        status: 'success',
        errorMsg: null
    }
    const [validateOldPassword, setValidateOldPassword] = useState(defaultTrueStatus);
    const [validateNewPassword, setValidateNewPassword] = useState(defaultTrueStatus);
    const [validateConfirmPassword, setValidateConfirmPassword] = useState(defaultTrueStatus);


    function handleChangeOldPassword(e) {
        setOldPassword(e.target.value);
    }

    function handleChangeNewPassword(e) {
        setNewPassword(e.target.value);
    }

    function handleChangeConfirmPassword(e) {
        setConfirmPassword(e.target.value);
    }

    function checkPasswordFunc(password, validateFunc) {
        if (!checkPassword(password)) {
            validateFunc({
                status: 'error',
                errorMsg: messageSignUpError.password
            })
            return false;
        } else {
            validateFunc({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    function checkConfirmPassFunc(password, confirmPass) {
        if (!checkConfirmPass(password, confirmPass)) {
            setValidateConfirmPassword({
                status: 'error',
                errorMsg: messageChangePass.confirmPass
            })
            return false;
        } else {
            setValidateConfirmPassword({
                status: 'success',
                errorMsg: null
            })
            return true;
        }
    }

    const handleSubmit = async () => {
        ref.current.submit();
        let count = 0;
        count = checkPasswordFunc(oldPassword, setValidateOldPassword) ? count : count + 1;
        count = checkPassword(newPassword, setValidateNewPassword) ? count : count + 1;
        count = checkConfirmPassFunc(newPassword, confirmPassword) ? count : count + 1;
        if (count === 0) {
            const url = serverURL + 'account/change-password';
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id:user._id, oldPassword, newPassword, confirmPassword })
                }
                );
                const result = await response.json();
                console.log(result);
                if(response.status!==200){
                    message.error(result.message);
                }else{
                    message.success("B???n ???? ?????i m???t kh???u th??nh c??ng");
                    setIsOpenModal(false);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        return;
    }

    const handleCancel = () => {
        setIsOpenModal(false);
    }

    return (
        <div className="change-password-container">
            <Form
                ref={ref}
                onKeyUp={handleKeyUp}
                className='form'
                name="basic"
                layout='vertical'
                initialValues={{ remember: true }}
                autoComplete="off"
            >

                <Form.Item
                    label="M???t kh???u c??"
                    name="old-password"
                    rules={[{ required: true, message: 'H??y nh???p m???t kh???u c??!' }]}
                    validateStatus={validateOldPassword.status}
                    help={validateOldPassword.errorMsg}
                >
                    <Input
                        ref={refOldPassword}
                        className='input-login'
                        placeholder="Nh???p m???t kh???u c??"
                        autoFocus={true}
                        prefix={<KeyOutlined className='input-icon' />}
                        suffix={
                            <Tooltip title="M???t kh???u ch???a c??? s???, ch??? nhi???u h??n 8 k?? t???">
                                <InfoCircleOutlined className='input-icon opacity-less'
                                />
                            </Tooltip>
                        }
                        value={oldPassword}
                        onChange={handleChangeOldPassword}
                    />
                </Form.Item>
                <Form.Item
                    label="M???t kh???u m???i"
                    name="new-password"
                    rules={[{ required: true, message: 'H??y nh???p m???t kh???u m???i!' }]}
                    validateStatus={validateNewPassword.status}
                    help={validateNewPassword.errorMsg}
                >
                    <Input.Password
                        className='input-login'
                        value={newPassword}
                        prefix={<KeyOutlined className='input-icon' />}
                        onChange={handleChangeNewPassword}
                    />
                </Form.Item>
                <Form.Item
                    label="Nh???p l???i m???t kh???u m???i"
                    name="confirm-password"
                    rules={[{ required: true, message: 'H??y nh???p m???t kh???u l???i m???t kh???u m???i!' }]}
                    validateStatus={validateConfirmPassword.status}
                    help={validateConfirmPassword.errorMsg}
                >
                    <Input.Password
                        className='input-login'
                        value={confirmPassword}
                        prefix={<KeyOutlined className='input-icon' />}
                        onChange={handleChangeConfirmPassword}
                    />
                </Form.Item>
                <Form.Item>
                    <div className='group-button'>
                        <Button type='submit' className='button save-btn' onClick={handleSubmit}>Thay ?????i</Button>
                        <Button type='reset' className='button cancel-btn' onClick={handleCancel}>H???y</Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}