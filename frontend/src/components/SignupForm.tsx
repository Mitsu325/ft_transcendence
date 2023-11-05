import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import AlertMessage from './AlertMessage';
import './style.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const validationSignup = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    username: yup.string().required('Campo obrigatório'),
    email: yup.string().email("Não é um email válido").required('Campo obrigatório'),
    password: yup.string().min(8, "min 8 caracteres").required('Campo obrigatório'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Senhas não conferem').required('Campo obrigatório'),
});

const handleSubmit = (values: any, endPoint: any, { resetForm }: { resetForm: () => void }) => {

    axios.post(`http://localhost:3003/${endPoint}`, values)
        .then((response) => {
            alert(response.data.message + " - " + response.data.error);
        });
    resetForm();
};

export default function SignupForm() {

    return (
        <div className="container" >
            <h1>Cadastro</h1>
            <Formik
                initialValues={{
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                onSubmit={(values, { resetForm }) => handleSubmit(values, 'user', { resetForm })}
                validationSchema={validationSignup}>
                <Form className="login-form">
                    <div className="login-form-group">
                        <Field name="name"
                            className="form-field"
                            placeholder="Nome" />
                        <ErrorMessage
                            component="span"
                            name="name"
                            className="form-error" />
                    </div>
                    <div className="login-form-group">
                        <Field name="username"
                            className="form-field"
                            placeholder="Login" />
                        <ErrorMessage
                            component="span"
                            name="username"
                            className="form-error" />
                    </div>
                    <div className="login-form-group">
                        <Field name="email"
                            className="form-field"
                            type="email"
                            placeholder="Email" />
                        <ErrorMessage
                            component="span"
                            name="email"
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