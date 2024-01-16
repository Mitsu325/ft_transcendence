import React, { useEffect, useState } from 'react';
import { EditOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import AvatarCustom from 'components/Avatar';
import 'pages/Register/style.css';
import { Link } from 'react-router-dom';

export default function Register() {
  const { user } = useAuth();
  const [mdScreenBreakpoint, setMdScreenBreakpoint] = useState(
    window.innerWidth > 1450,
  );

  const updateMedia = () => {
    setMdScreenBreakpoint(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  return (
    <div className="profile">
      <div className="profile-menu">
        <AvatarCustom
          src={user?.avatar || ''}
          size={mdScreenBreakpoint ? 240 : 120}
          className="avatar-pos gray-border"
        />
        <dl className="profile-menu-list">
          <dt className="profile-menu-list-item">
            <Link to="/profile">
              <EditOutlined alt="" />
              <span className="ml-8">Editar perfil</span>
            </Link>
          </dt>
          <dt className="profile-menu-list-item">
            <Link to="/profile">
              <KeyOutlined alt="" />
              <span className="ml-8">Segurança</span>
            </Link>
          </dt>
        </dl>
      </div>
      <div className="profile-content">
        <h1 className="profile-title">{user?.name}</h1>
        <p className="profile-text">
          Username: {user?.username || 'Não definido'}
        </p>
        <p className="profile-text">E-mail: {user?.email}</p>
      </div>
    </div>
  );
}
