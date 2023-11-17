import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { authService } from 'services/auth.api';
import { LoginBody } from 'interfaces/reqBody/login.interface';
import FailureNotification from 'components/Notification/FailureNotification';
import { userService } from 'services/user.api';
import { setAuthorizationHeader } from 'services/auth.service';
import { useAuth } from 'hooks/useAuth';
import SuccessNotification from 'components/Notification/SuccessNotification';
import TwoFactorModal from 'components/TwoFactModal';

interface AuthResponse {
  access_token: string;
}

const validationLogin = yup.object().shape({
  username: yup.string().required('Campo obrigatório'),
  password: yup
    .string()
    .min(8, 'min 8 caracteres')
    .required('Campo obrigatório'),
});

export default function SignInForm() {
  const context = useAuth();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userId, setuserId] = useState('');
  const [loginResult, setLoginResult] = useState<{
    res: AuthResponse | null;
    user: any | null;
  }>({ res: null, user: null });

  const handleLogin = async (values: LoginBody) => {
    try {
      setLoading(true);
      const res = await authService.login(values);
      setAuthorizationHeader(res.access_token);
      const user = await userService.getUser();

      setuserId(user.id);
      setLoginResult({ res, user });

      if (user.twoFactorAuth) {
        setVisible(true);
      } else {
        setVerified(true);
      }
    } catch (error) {
      FailureNotification({
        message: 'Não foi possível logar',
        description: 'Por favor, verifique suas credenciais e tente novamente.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified && loginResult.res && loginResult.user) {
      context.Login(loginResult.res.access_token, loginResult.user);
      SuccessNotification({
        message: 'Login bem-sucedido',
        description: 'Você foi autenticado com sucesso.',
      });
    } else {
      FailureNotification({
        message: 'Não foi possível logar',
        description: 'Por favor, verifique suas credenciais e tente novamente.',
      });
    }
    setLoading(false);
  }, [verified]);

  return (
    <div className="container">
      <h2 className="page-title">Login</h2>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={values => handleLogin(values)}
        validationSchema={validationLogin}
      >
        <Form className="p-10">
          <div>
            <Field
              name="username"
              className="form-field"
              placeholder="Email ou Username"
            />
            <ErrorMessage
              component="span"
              name="username"
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
          <Button
            type="primary"
            htmlType="submit"
            className="primary-button"
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </Formik>
      <TwoFactorModal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        setVerified={setVerified}
        id={userId}
      />
    </div>
  );
}
