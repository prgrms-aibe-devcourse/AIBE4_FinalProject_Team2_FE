import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordField = ({ label, name, placeholder, onChange }) => {
    const [show, setShow] = useState(false);

    return (
        <Form.Group className="row mb-2">
            <Form.Label className="col-sm-3 col-form-label small fw-semibold">{label}</Form.Label>
            <div className="col-sm-9">
                <InputGroup>
                    <Form.Control
                        name={name}
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        onChange={onChange}
                        required
                    />
                    <InputGroup.Text
                        className="bg-white"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShow(!show)}
                    >
                        {show ? <FaRegEyeSlash /> : <FaRegEye />}
                    </InputGroup.Text>
                </InputGroup>
            </div>
        </Form.Group>
    );
};

export default PasswordField;