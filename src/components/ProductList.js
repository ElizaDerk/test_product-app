import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, addProduct } from '../redux/productsSlice';
import { Link } from 'react-router-dom';
import ProductModal from './ProductModal';
import ModalWrapper from './ModalWrapper';

import styles from './ProductList.module.css'; 

function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const [sortType, setSortType] = useState('name');
  const [showModal, setShowModal] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortType === 'name') {
      const nameComp = a.name.localeCompare(b.name);
      if (nameComp !== 0) return nameComp;
      return a.count - b.count;
    }
    if (sortType === 'count') {
      const countComp = a.count - b.count;
      if (countComp !== 0) return countComp;
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      closeDeleteModal();
    }
  };

  const handleAdd = (newProduct) => {
    dispatch(addProduct(newProduct));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Product list</h2>
        <div className={styles.controls}>
          <button
            className={styles.button}
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
          <select
            className={styles.select}
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="name">By Name</option>
            <option value="count">By Quantity</option>
          </select>
        </div>
      </div>

      <ul className={styles.list}>
        {sortedProducts.map(p => (
          <li key={p.id} className={styles.listItem}>
            <Link to={`/product/${p.id}`} className={styles.listItemLink}>
              {p.name}
            </Link>
            <span>{p.count}</span>
            <button
              className={styles.deleteButton}
              onClick={() => openDeleteModal(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
        />
      )}

      {isDeleteModalOpen && (
        <ModalWrapper onClose={closeDeleteModal}>
          <p>Do you want to delete the product?</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className={styles.button} onClick={confirmDelete}>Yes</button>
            <button className={styles.button} onClick={closeDeleteModal}>No</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default ProductList;
