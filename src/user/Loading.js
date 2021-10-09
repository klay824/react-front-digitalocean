/* eslint-disable import/no-anonymous-default-export */
import React, { Fragment } from 'react';
import loading from './loading.gif';

export default () => (
    <Fragment>
        <img
            src={loading}
            style={{ margin: 'auto', display: 'block' }}
            alt='Loading...'
        />
    </Fragment>
);