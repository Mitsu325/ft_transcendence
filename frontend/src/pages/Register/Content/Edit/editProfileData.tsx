import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { Button, Divider, Form, Input } from 'antd';
import { userService } from 'services/user.api';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import { useNavigate } from 'react-router-dom';

interface FieldData {
  name: string | number | (string | number)[];
  value?: unknown;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

export interface userData {
  name: string;
  username: string;
  email: string;
}

export default function UserEditProfileData() {
  const { user, UpdateUser } = useAuth();
  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [fields] = useState<FieldData[]>([
    {
      name: ['name'],
      value: user?.name,
    },
    {
      name: ['username'],
      value: user?.username,
    },
    {
      name: ['email'],
      value: user?.email,
    },
  ]);

  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onFinish = (values: userData) => {
    setLoading(true);
    userService
      .updateUser(values)
      .then(res => {
        setLoading(false);
        navigate(`/profile/${res.username}/edit`);
        UpdateUser(res);
        SuccessNotification({
          message: 'Dados atualizados',
          description: 'Os dados foram atualizados com sucesso',
        });
      })
      .catch(() => {
        setLoading(false);
        FailureNotification({
          message: `Erro ao atualizar os dados`,
          description: 'Tente novamente',
        });
      });
  };

  return (
    <>
      <h2 className="sub-title">Dados básicos</h2>
      <Divider />
      <Form form={form} fields={fields} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          className="mb-32"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          className="mb-32"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { type: 'email', message: 'E-mail inválido' },
            { required: true, message: 'Campo obrigatório' },
          ]}
          className="mb-32"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            disabled={!submittable}
            loading={loading}
          >
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
