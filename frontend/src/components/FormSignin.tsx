import { Button } from 'antd';
import './style.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

export default function FormSignin() {
    const handleSubmit = (values: any) => console.log(values);
    const validationLogin = yup.object().shape({
        user: yup.string().required('Campo obrigatório'),
        password: yup.string().min(8, "min 8 caracteres").required('Campo obrigatório'),
    });
    return (
        <div className="container" >
            <h1>Login</h1>
            <Formik
                initialValues={{}}
                onSubmit={handleSubmit}
                validationSchema={validationLogin}
            >
                <Form className="login-form">
                    <div className="login-form-group">
                        <Field name="user" className="form-field"
                            placeHolder="Email ou Login" />
                        <ErrorMessage
                            component="span"
                            name="user"
                            className="form-error" />
                    </div>
                    <div className="login-form-group">
                        <Field name="password" className="form-field" type="password"
                            placeHolder="Senha" />
                        <ErrorMessage
                            component="span"
                            name="password"
                            className="form-error" />
                    </div>
                    <Button type="primary" htmlType="submit" className="primary-button">Login</Button>
                </Form>
            </Formik>
        </div >
    );
}