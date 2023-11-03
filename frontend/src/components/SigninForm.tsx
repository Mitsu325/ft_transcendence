import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './style.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const validationLogin = yup.object().shape({
    user: yup.string().required('Campo obrigatório'),
    password: yup.string().min(8, "min 8 caracteres").required('Campo obrigatório'),
});

const handleSubmit = (values: any, endPoint: any, { resetForm }: { resetForm: () => void }) => {
    // const nav = useNavigate();

    axios.post(`http://localhost:3003/${endPoint}`, values)
        .then((response) => {
            console.log(response);
            // nav('/home');
        });
    resetForm();
};

export default function SigninForm() {

    return (
        <div className="container" >
            <h1>Login</h1>
            <Formik
                initialValues={{
                    user: '',
                    password: '',
                }}
                onSubmit={(values, { resetForm }) => handleSubmit(values, 'login', { resetForm })}
                validationSchema={validationLogin}>
                <Form className="login-form">
                    <div className="login-form-group">
                        <Field name="user"
                            className="form-field"
                            placeholder="Email ou Login" />
                        <ErrorMessage
                            component="span"
                            name="user"
                            className="form-error" />
                    </div>
                    <div className="login-form-group">
                        <Field name="password"
                            className="form-field"
                            type="password"
                            placeholder="Senha" />
                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error" />
                    </div>
                    <Button type="primary"
                        htmlType="submit"
                        className="primary-button"
                    >Login</Button>
                </Form>
            </Formik>
        </div >
    );
}
