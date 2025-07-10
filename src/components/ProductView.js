import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductModal from './ProductModal';
import ModalWrapper from './ModalWrapper';

import styles from './ProductView.module.css';

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/products/${id}`).then(res => setProduct(res.data));
    axios.get(`http://localhost:3001/comments?productId=${id}`).then(res => setComments(res.data));
  }, [id]);

  const openCommentModal = () => {
    setNewCommentText('');
    setCommentModalOpen(true);
  };

  const saveComment = () => {
    if (newCommentText.trim() === '') {
      alert('Please enter a comment!');
      return;
    }
    const newComment = {
      productId: id, 
      description: newCommentText,
      date: new Date().toLocaleString(),
    };
    axios.post('http://localhost:3001/comments', newComment).then(res => {
      setComments(prev => [...prev, res.data]);
      setCommentModalOpen(false);
    });
  };

  const deleteComment = (cid) => {
    axios.delete(`http://localhost:3001/comments/${cid}`).then(() => {
      setComments(prev => prev.filter(c => c.id !== cid));
    });
  };

  const updateProduct = (updated) => {
    axios.put(`http://localhost:3001/products/${id}`, updated).then(res => {
      setProduct(res.data);
      setEditMode(false);
    });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{product.name}</h2>
        <button className={styles.headerButton} onClick={() => navigate('/')}>
          Back to the product list
        </button>
      </div>

      <div className={styles.info}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.infoImg}
        />
        <p className={styles.infoParagraph}>Weight: {product.weight}</p>
        <p className={styles.infoParagraph}>
          Size: {product.size.width} x {product.size.height}
        </p>
        <p className={styles.infoParagraph}>Quantity: {product.count}</p>
        <button
          className={styles.editButton}
          onClick={() => setEditMode(true)}
        >
          Edit
        </button>
      </div>

      <h3>Comments:</h3>
      <button className={styles.headerButton} onClick={openCommentModal}>
        Add
      </button>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            {c.description} ({c.date})
            <button
              className={styles.headerButton}
              style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}
              onClick={() => deleteComment(c.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editMode && (
        <ProductModal
          onClose={() => setEditMode(false)}
          onSave={updateProduct}
          defaultProduct={product}
        />
      )}

      {commentModalOpen && (
        <ModalWrapper onClose={() => setCommentModalOpen(false)}>
          <textarea
            rows={4}
            style={{ width: '90%', padding: '8px', fontSize: '1rem', marginTop: '10px' }}
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder="Enter your comment here"
          />
          <div style={{ marginTop: 10 }}>
            <button className={styles.headerButton} onClick={saveComment}>
              Save
            </button>
            <button
              className={styles.headerButton}
              onClick={() => setCommentModalOpen(false)}
              style={{ marginLeft: 10, backgroundColor: '#6c757d' }}
            >
              Cancel
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default ProductView;
