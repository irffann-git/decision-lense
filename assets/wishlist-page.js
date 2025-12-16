document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('wishlist-grid');
  const empty = document.getElementById('wishlist-empty');
  if (!grid || !empty) return;

  let handles = getWishlist();

 function updateEmptyState() {
  const cards = grid.querySelectorAll('.wishlist-card');
  empty.style.display = cards.length ? 'none' : 'block';
}


  updateEmptyState();

  handles.forEach(handle => {
    fetch(`/products/${handle}.js`)
      .then(res => res.json())
      .then(product => {

        /* =========================
           RATING + REVIEW FROM TAGS
           ========================= */
        let rating = null;
        let reviews = null;

        product.tags.forEach(tag => {
          if (tag.startsWith('rating_')) {
            rating = tag.replace('rating_', '');
          }
          if (tag.startsWith('reviews_')) {
            reviews = tag.replace('reviews_', '');
          }
        });

        /* =========================
           SIZE (OPTION 1)
           ========================= */
        const size =
          product.variants &&
          product.variants[0] &&
          product.variants[0].option1
            ? product.variants[0].option1
            : null;

        /* =========================
           PRICE & DISCOUNT
           ========================= */
        const price = product.price;
        const compareAt = product.compare_at_price;
        const discount =
          compareAt && compareAt > price
            ? Math.round(((compareAt - price) / compareAt) * 100)
            : null;

        const card = document.createElement('div');
        card.className =
          'border bg-white shadow-lg rounded-lg overflow-hidden relative wishlist-card';

        card.innerHTML = `
          <a href="${product.url}">
            <img
              src="${product.featured_image}"
              alt="${product.title}"
              class="w-full h-56 object-cover">
          </a>

          <div class="p-4 product-info">

            ${
              rating
                ? `<div class="rating-chip">
                    <span class="rating-value font-bold">${rating}</span>
                    <span class="rating-star" style="color:#16a34a;font-weight:700;">★</span>
                    ${reviews ? `<span class="rating-count">(${reviews})</span>` : ``}
                  </div>`
                : ``
            }

            <a href="${product.url}" class="block font-semibold mt-2 product-title">
              ${product.title}
            </a>

            ${
              size
                ? `<p class="size-line">
                    <span>Size:</span> <strong>${size}</strong>
                  </p>`
                : ``
            }

            <div class="price-box">
              <span class="price-main">
                ${(price / 100).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                })}
              </span>

              ${
                compareAt && compareAt > price
                  ? `<span class="price-compare">
                      ${(compareAt / 100).toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR'
                      })}
                    </span>
                    <span class="price-discount">(${discount}% OFF)</span>`
                  : ``
              }
            </div>

            <button
              type="button"
              class="remove-from-wishlist wishlist-toggle active"
              data-handle="${product.handle}"
              aria-label="Remove from wishlist">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="22"
                height="22">
                 <path d="M12 21s-6-4.35-9-8.28C-1.23 7.77 1.52 2.2 6.3 2.2A5.46 5.46 0 0 1 12 5.53 5.46 5.46 0 0 1 17.7 2.2c4.78 0 7.53 5.57 3 10.52C18 16.65 12 21 12 21z" />
              </svg>
            </button>

          </div>
        `;

         grid.appendChild(card);
        updateEmptyState(); // ✅ check AFTER card added
      })
      .catch(() => {
        updateEmptyState();
      });
  });

  /* =========================
     REMOVE FROM WISHLIST
     ========================= */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.remove-from-wishlist');
    if (!btn) return;

    const handle = btn.dataset.handle;

    handles = handles.filter(h => h !== handle);
    saveWishlist(handles);

    const card = btn.closest('.wishlist-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => card.remove(), 200);
    }

    updateEmptyState();
  });
});
