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

const validationSignup = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    username: yup.string().email("Não é um email válido").required('Campo obrigatório'),
    password: yup.string().min(8, "min 8 caracteres").required('Campo obrigatório'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Senhas não conferem').required('Campo obrigatório'),
});


const handleSubmit = (values: any, endPoint: any, { resetForm }: { resetForm: () => void }) => {
    // const nav = useNavigate();

    axios.post(`http://localhost:3001/${endPoint}`, values)
        .then((response) => {
            console.log(response);
            // nav('/home');
        });
    resetForm();
};

export function FormSignin() {

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

export function FormSignup() {

    return (
        <div className="container" >
            <h1>Cadastro</h1>
            <Formik
                initialValues={{
                    name: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                }}
                onSubmit={(values, { resetForm }) => handleSubmit(values, 'login', { resetForm })}
                validationSchema={validationSignup}>
                <Form className="login-form">
                    <div className="login-form-group">
                        <Field name="name"
                            className="form-field"
                            placeholder="Login" />
                        <ErrorMessage
                            component="span"
                            name="name"
                            className="form-error" />
                    </div>
                    <div className="login-form-group">
                        <Field name="username"
                            className="form-field"
                            type="username"
                            placeholder="Email" />
                        <ErrorMessage
                            component="span"
                            name="username"
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
                    <div className="login-form-group">
                        <Field name="confirmPassword"
                            className="form-field"
                            type="password"
                            placeholder="Confirme a Senha" />
                        <ErrorMessage
                            component="span"
                            name="confirmPassword"
                            className="form-error" />
                    </div>
                    <Button type="primary"
                        htmlType="submit"
                        className="primary-button"
                    >Cadastrar</Button>
                </Form>
            </Formik>
        </div >
    );
}