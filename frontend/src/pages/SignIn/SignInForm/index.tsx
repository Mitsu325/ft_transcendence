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
import handleVerify from 'pages/utils/VerifyTF';

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
  const [otp, setOtp] = useState('');

  const handleLogin = async (values: LoginBody) => {
    try {
      setLoading(true);
      const res = await authService.login(values);
      setAuthorizationHeader(res.access_token);
      const user = await userService.getUser();

      if (user.twoFactorAuth) {
        setVisible(true);
        handleVerify(user.id, otp)
          .then(result => {
            if (typeof result === 'boolean') {
              setVerified(result);
            } else {
              console.error('Resultado inesperado de handleVerify:', result);
            }
          })
          .catch(error => {
            console.error('Erro ao verificar:', error);
          });
      } else {
        setVerified(true);
      }
      if (verified) {
        context.Login(res.access_token, user);
        SuccessNotification({
          message: 'Login bem-sucedido',
          description: 'Você foi autenticado com sucesso.',
        });
      }

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
        setOtp={setOtp}
      />
    </div>
  );
}
