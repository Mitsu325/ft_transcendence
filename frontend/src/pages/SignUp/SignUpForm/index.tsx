import * as React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import 'pages/SignUp/SignUpForm/style.css';

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

const handleSubmit = (
  values: any,
  endPoint: any,
  { resetForm }: { resetForm: () => void },
) => {
  axios.post(`http://localhost:3003/${endPoint}`, values).then(response => {
    if (response.data.success === true) {
      SuccessNotification({
        message: 'Cadastro realizado com sucesso',
        description: 'Siga para o login.',
      });
    } else {
      FailureNotification({
        message: 'Não foi possível criar sua conta',
        description: 'Por favor, verifique: ' + response.data.error,
      });
    }
  });
  resetForm();
};

export default function SignUpForm() {
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
        onSubmit={(values, { resetForm }) =>
          handleSubmit(values, 'user', { resetForm })
        }
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
          <Button type="primary" htmlType="submit" className="primary-button">
            Cadastrar
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
