import React from 'react';
import PropTypes from 'prop-types';
import AuthHeader from './AuthHeader';
const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen relative">
      <AuthHeader />
      {children}
    </div>
  );
};
AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
