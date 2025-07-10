import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import styles from './ProductModal.module.css';

function ProductModal({ onClose, onSave, defaultProduct }) {
  const [product, setProduct] = useState({
    name: '',
    count: 1,
    imageUrl: '',
    weight: '',
    size: { width: 100, height: 100 },
    ...defaultProduct,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!product.name.trim()) errs.name = 'Name is required';
    if (!product.imageUrl.trim()) errs.imageUrl = 'Image URL is required';
    if (!product.weight.trim()) errs.weight = 'Weight is required';
    if (product.count <= 0) errs.count = 'Count must be positive';
    if (product.size.width <= 0) errs.width = 'Width must be positive';
    if (product.size.height <= 0) errs.height = 'Height must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'width' || name === 'height') {
      setProduct(prev => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: Number(value),
        },
      }));
    } else if (name === 'count') {
      setProduct(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(product);
    onClose();
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h3>{defaultProduct ? 'Edit' : 'Add'} product</h3>
      <div className={styles.field}>
        <input
          name="name"
          placeholder="Name"
          value={product.name}
          onChange={handleChange}
          className={errors.name ? styles.errorInput : ''}
        />
        {errors.name && <small className={styles.errorMsg}>{errors.name}</small>}
      </div>

      <div className={styles.field}>
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={handleChange}
          className={errors.imageUrl ? styles.errorInput : ''}
        />
        {errors.imageUrl && <small className={styles.errorMsg}>{errors.imageUrl}</small>}
      </div>

      <div className={styles.field}>
        <input
          name="count"
          type="number"
          placeholder="Quantity"
          value={product.count}
          onChange={handleChange}
          className={errors.count ? styles.errorInput : ''}
          min="1"
        />
        {errors.count && <small className={styles.errorMsg}>{errors.count}</small>}
      </div>

      <div className={styles.field}>
        <input
          name="weight"
          placeholder="Weight"
          value={product.weight}
          onChange={handleChange}
          className={errors.weight ? styles.errorInput : ''}
        />
        {errors.weight && <small className={styles.errorMsg}>{errors.weight}</small>}
      </div>

      <div className={styles.sizeGroup}>
        <div className={styles.field}>
          <input
            name="width"
            type="number"
            placeholder="Width"
            value={product.size.width}
            onChange={handleChange}
            className={errors.width ? styles.errorInput : ''}
            min="1"
          />
          {errors.width && <small className={styles.errorMsg}>{errors.width}</small>}
        </div>

        <div className={styles.field}>
          <input
            name="height"
            type="number"
            placeholder="Height"
            value={product.size.height}
            onChange={handleChange}
            className={errors.height ? styles.errorInput : ''}
            min="1"
          />
          {errors.height && <small className={styles.errorMsg}>{errors.height}</small>}
        </div>
      </div>

      <button className={styles.btn} onClick={handleSubmit}>Save</button>
    </ModalWrapper>
  );
}

export default ProductModal;