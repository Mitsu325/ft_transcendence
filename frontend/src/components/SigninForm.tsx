import * as React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import './style.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const validationLogin = yup.object().shape({
  username: yup.string().required('Campo obrigatório'),
  password: yup
    .string()
    .min(8, 'min 8 caracteres')
    .required('Campo obrigatório'),
});

const handleSubmit = (
  values: any,
  endPoint: any,
  { resetForm }: { resetForm: () => void },
) => {
  axios.post(`http://localhost:3003/${endPoint}`, values).then(response => {
    alert(response.data.message + ' - ' + response.data.error);
  });
  resetForm();
};

export default function SigninForm() {
  return (
    <div className="container">
      <h1>Login</h1>
      <Formik
        initialValues={{
          user: '',
          password: '',
        }}
        onSubmit={(values, { resetForm }) =>
          handleSubmit(values, 'user/login', { resetForm })
        }
        validationSchema={validationLogin}
      >
        <Form className="login-form">
          <div className="login-form-group">
            <Field
              name="username"
              className="form-field"
              placeholder="Email ou Login"
            />
            <ErrorMessage
              component="span"
              name="username"
              className="form-error"
            />
          </div>
          <div className="login-form-group">
            <Field
              name="password"
              className="form-field"
              type="password"
              placeholder="Senha"
            />
            <ErrorMessage
              component="span"
              name="password"
              className="form-error"
            />
          </div>
          <Button type="primary" htmlType="submit" className="primary-button">
            Login
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
