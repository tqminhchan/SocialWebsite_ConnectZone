import React, { useState } from 'react'
import Modal, { contextType } from 'react-modal'
import { twMerge } from 'tailwind-merge';
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(25, 25, 25, 0.45)',
    zIndex: 100,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');

const MyModal = ({ isOpen, handleClose, children, className = '', ...props }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
      className={className}
      {...props}
    >
      {children}
    </Modal>
  )
}

export default MyModal