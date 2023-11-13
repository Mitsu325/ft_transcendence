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
  const navigate = useNavigate();

  const handleSignUp = async (values: SignUpBody) => {
    try {
      setLoading(true);
      const res = await authService.signUp(values);
      setAuthorizationHeader(res.access_token);
      const user = await userService.getUser();
      navigate('/');
      context.Login(res.access_token, user);
      SuccessNotification({
        message: 'Conta criada!',
        description: 'Você foi autenticado com sucesso.',
      });
      setLoading(false);
    } catch (error) {
      FailureNotification({
        message: 'Não foi possível logar',
        description: 'Por favor, verifique suas credenciais e tente novamente.',
      });
      setLoading(false);
    }
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
            <Field name="username" className="form-field" placeholder="Login" />
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
          <div>
            <Field
              name="confirmPassword"
              className="form-field"
              type="password"
              placeholder="Confirme a Senha"
            />
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
