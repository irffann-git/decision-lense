const WISHLIST_KEY = 'wishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

function toggleWishlist(handle) {
  let list = getWishlist();

  if (list.includes(handle)) {
    list = list.filter(h => h !== handle);
  } else {
    list.push(handle);
  }

  saveWishlist(list);
  return list;
}

function initWishlistButtons() {
  const list = getWishlist();

  document.querySelectorAll('.wishlist-toggle').forEach(btn => {
    const handle = btn.dataset.productHandle;
    if (!handle) return;

    btn.classList.toggle('active', list.includes(handle));

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const updated = toggleWishlist(handle);
      btn.classList.toggle('active', updated.includes(handle));

      /* 🔥 mobile repaint fix */
      btn.style.display = 'none';
      btn.offsetHeight;
      btn.style.display = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', initWishlistButtons);
