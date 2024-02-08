import React, { useState } from 'react';
import { Button } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { SignUpBody } from 'interfaces/reqBody/signup.interface';
import { useAuth } from 'hooks/useAuth';
import { authService } from 'services/auth.api';
import { setAuthorizationHeader } from 'services/auth.service';
import { userService } from 'services/user.api';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import 'pages/SignUp/SignUpForm/style.css';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const validationSignup = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
  username: yup.string().required('Campo obrigatório'),
  email: yup
    .string()
    .email('Não é um email válido')
    .required('Campo obrigatório'),
  password: yup
    .string()
    .min(8, 'min 8 caracteres')
    .required('Campo obrigatório'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não conferem')
    .required('Campo obrigatório'),
});

export default function SignUpForm() {
  const context = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (values: SignUpBody) => {
    try {
      setLoading(true);
      const res = await authService.signUp(values);
      if (!res.success) {
        FailureNotification({
          message: 'Não foi possível criar a conta',
          description: `O ${
            res.reason === 'email_exists' ? 'e-mail' : 'username'
          } fornecido já está em uso. Por favor, tente com outro ${
            res.reason === 'email_exists' ? 'e-mail' : 'username'
          } ou faça login na sua conta existente.`,
        });
        setLoading(false);
        return;
      }
      setAuthorizationHeader(res?.access_token);
      const user = await userService.getUser();
      navigate('/');
      context.Login(res.access_token, user);
      SuccessNotification({
        message: 'Conta criada!',
        description: 'Você foi autenticado com sucesso.',
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      FailureNotification({
        message: 'Não foi possível criar a conta',
        description: 'Por favor, tente novamente.',
      });
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <h2 className="page-title">Cadastro</h2>
      <Formik
        initialValues={{
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={values => handleSignUp(values)}
        validationSchema={validationSignup}
      >
        <Form className="p-10">
          <div>
            <Field name="name" className="form-field" placeholder="Nome" />
            <ErrorMessage component="span" name="name" className="form-error" />
          </div>
          <div>
            <Field
              name="username"
              className="form-field"
              placeholder="Username"
            />
            <ErrorMessage
              component="span"
              name="username"
              className="form-error"
            />
          </div>
          <div>
            <Field
              name="email"
              className="form-field"
              type="email"
              placeholder="Email"
            />
            <ErrorMessage
              component="span"
              name="email"
              className="form-error"
            />
          </div>
          <div>
            <div className="password-field-group">
              <Field
                name="password"
                className="form-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
              />
              <Button
                className="btn-eye"
                shape="circle"
                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={togglePassword}
              />
            </div>
            <ErrorMessage
              component="span"
              name="password"
              className="form-error"
            />
          </div>
          <div>
            <div className="password-field-group">
              <Field
                name="confirmPassword"
                className="form-field"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme a Senha"
              />
              <Button
                className="btn-eye"
                shape="circle"
                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={togglePassword}
              />
            </div>
            <ErrorMessage
              component="span"
              name="confirmPassword"
              className="form-error"
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="primary-button"
            loading={loading}
          >
            Cadastrar
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
