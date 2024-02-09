import React, { useState } from 'react';
import { Button, Divider, Form, Input } from 'antd';
import { userService } from 'services/user.api';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';

export interface passwordData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Password() {
  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onFinish = (values: passwordData) => {
    setLoading(true);
    userService
      .updatePassword(values.password, values.newPassword)
      .then(res => {
        setLoading(false);
        if (res.success) {
          SuccessNotification({
            message: 'Senha atualizada',
            description: 'A senha foi atualizada com sucesso',
          });
          form.resetFields();
        } else {
          FailureNotification({
            message: 'A senha atual fornecida está incorreta',
            description: 'Por favor, verifique e tente novamente.',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        FailureNotification({
          message: `Erro ao atualizar senha`,
          description: 'Tente novamente',
        });
      });
  };

  return (
    <>
      <h2 className="sub-title">Dados básicos</h2>
      <Divider />
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="password"
          label="Senha atual"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          className="mb-32 profile-form-input"
        >
          <Input.Password type="password" placeholder="Senha" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Nova senha"
          rules={[
            { required: true, message: 'Campo obrigatório' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
              message:
                'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
            },
          ]}
          className="mb-32 profile-form-input"
        >
          <Input.Password type="password" placeholder="Senha" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="Confirmar nova senha"
          rules={[
            { required: true, message: 'Campo obrigatório' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('A senha não correspode'));
              },
            }),
          ]}
          className="mb-32 profile-form-input"
        >
          <Input.Password type="password" placeholder="Senha" />
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
