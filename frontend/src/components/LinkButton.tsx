import { Link } from 'react-router-dom';
import { Button } from 'antd';
import 'components/style.css';

export default function LinkButton(props: any) {
  const { text, to, ...rest } = props;

  return (
    <Link to={to} className="login-link">
      <Button type="primary" className="primary-button" {...rest}>
        {text}
      </Button>
    </Link>
  );
}
