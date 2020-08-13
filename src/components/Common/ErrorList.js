import React from 'react';

const ErrorList = ({ errors }) => {
    return errors.map((error, idx) => (
        <p key={idx}>{error.message}</p>
    ))
}

export default ErrorList;