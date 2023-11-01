import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './style.css'

export default function ButtonLink(props: any) {
    const {
        text,
        to,
        ...rest
    } = props;

    return (
        <Link to={to} className="login-link">
            <Button type="primary" className="primary-button" {...rest}>{text}</Button>
        </Link>
    );
}