import React, { useEffect } from 'react';

export default function Modal({ title, open, onClose, children }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Cerrar">×</button></header>
        {children}
      </section>
    </div>
  );
}
