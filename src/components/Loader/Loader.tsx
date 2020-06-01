import React from 'react';
import scss from './Loader.module.scss';

type Props = {} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
};

const Loader: React.FC<Props> = ({className}) => <div className={`${className} ${scss.wrapper}`}>
        <div className={scss.loaderElement} />
</div>;

export default Loader;
