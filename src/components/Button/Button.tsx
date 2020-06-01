import React, {ReactNode} from 'react';
import scss from './Button.module.scss';

type Props = {
    label: string | ReactNode,
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    wrapperClass: '' as string,
    type: 'button' as 'button' | 'submit' | 'reset',
    onClick: () => {}
};

const Button: React.FC<Props> = ({className, onClick, type, label, wrapperClass}) => <div className={`${wrapperClass} ${scss.buttonWrapper}`}>
    <button type={type} onClick={onClick} className={`${className} ${scss.button}`}>{label}</button>
</div>;

export default Button;
