import React from "react";
import { useReveal } from "./shopCategoryConstants";
import Items from "../../components/items/Items";

function CategoryGrid({ items, viewMode, currentPage, totalPages, onPageChange }) {
  const paginationRef = useReveal();

  /* Build smart page button list: 1 … n-1 current n+1 … last */
  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1)
      pageButtons.push(i);
    else if (pageButtons[pageButtons.length - 1] !== "...")
      pageButtons.push("...");
  }

  return (
    <>
      {/* Grid / List */}
      <div className={`products-grid${viewMode === "list" ? " list-view" : ""}`}>
        {items.map((item, idx) => (
          <Items
            key={item.id ?? idx}
            Pname={item.name}
            Pimg={item.images}
            Nprice={item.price}
            Oprice={item.original_price}
            id={item.id}
            desc={item.description}
            colors={item.colors}
            sizes={item.sizes}
            // product={"all_product"}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination reveal" ref={paginationRef}>
          <button
            className="page-btn arrow"
            disabled={currentPage === 1}
            onClick={() => onPageChange(p => Math.max(1, p - 1))}
          >
            ‹
          </button>

          {pageButtons.map((btn, i) =>
            btn === "..." ? (
              <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
            ) : (
              <button
                key={btn}
                className={`page-btn${currentPage === btn ? " active" : ""}`}
                onClick={() => onPageChange(btn)}
              >
                {btn}
              </button>
            )
          )}

          <button
            className="page-btn arrow"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

export default CategoryGrid;
