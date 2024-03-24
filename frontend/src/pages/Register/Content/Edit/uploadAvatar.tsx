import React, { useState } from 'react';
import { Button, GetProp, Tooltip, Upload, UploadProps } from 'antd';
import { useAuth } from 'hooks/useAuth';
import FailureNotification from 'components/Notification/FailureNotification';
import { CloudUploadOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function UploadAvatar() {
  const { UpdateUser } = useAuth();
  const authToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      FailureNotification({
        message: 'Tipo do arquivo não compatível',
        description: 'É permitido apenas arquivos JPG/PNG.',
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      FailureNotification({
        message: 'Tamanho do arquivo não compatível',
        description: 'É permitido apenas arquivos menor que 2MB.',
      });
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    const { status, response } = file;
    switch (status) {
      case 'uploading':
        setLoading(true);
        break;
      case 'done':
        UpdateUser(response);
        setLoading(false);
        SuccessNotification({
          message: 'Avatar atualizado',
          description: 'A imagem foi carregada com sucesso',
        });
        break;
      case 'error':
        FailureNotification({
          message: 'Não foi possível atualizar a imagem do avatar',
          description: 'Por favor, faça novamente.',
        });
        setLoading(false);
        break;
      default:
        break;
    }
  };

  return (
    <Upload
      name="file"
      action="process.env.API_URL/user/upload-avatar"
      headers={{
        authorization: `Bearer ${authToken}` || '',
        contentType: 'multipart/form-data',
      }}
      maxCount={1}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      showUploadList={false}
    >
      <Tooltip title="Atualize seu avatar carregando uma nova imagem">
        <Button
          icon={<CloudUploadOutlined />}
          size="large"
          loading={loading}
          className="mb-20"
        >
          Atualizar avatar
        </Button>
      </Tooltip>
    </Upload>
  );
}
