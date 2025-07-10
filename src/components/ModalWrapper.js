import React from 'react';
import styles from './ModalWrapper.module.css';

function ModalWrapper({ children, onClose }) {
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalStyle} onClick={stopPropagation}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        {children}
      </div>
    </>
  );
}

export default ModalWrapper;
