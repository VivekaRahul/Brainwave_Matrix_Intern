document.addEventListener('DOMContentLoaded', function() {

    // --- Global Cart Variables and Functions ---
    // Initialize cartItems array by loading from localStorage, or empty if none exist.
    // JSON.parse is used to convert the string back into a JavaScript array.
    // The '|| []' ensures cartItems is an empty array if localStorage is empty or parsing fails.
    let cartItems = JSON.parse(localStorage.getItem('vshopCartItems')) || [];
    let cartCount = cartItems.length; // Initialize cart count based on loaded items.

    // Get the cart badge element from the header.
    const cartBadge = document.querySelector('.cart-badge');

    // Function to save the current cartItems array to localStorage.
    // JSON.stringify is used to convert the JavaScript array into a string for storage.
    function saveCart() {
        try {
            localStorage.setItem('vshopCartItems', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to localStorage:", e);
            showMessageBox("Could not save cart. Browser storage might be full.", "error");
        }
    }

    // Function to update the cart badge display in the header.
    function updateCartBadge() {
        if (cartBadge) {
            cartBadge.textContent = cartCount; // Set the text content of the badge.
            if (cartCount > 0) {
                cartBadge.classList.add('visible'); // Show the badge if count > 0.
            } else {
                cartBadge.classList.remove('visible'); // Hide the badge if count is 0.
            }
        }
    }

    // --- Utility Function: Custom Message Box (replaces alert() for better UX) ---
    // Creates a temporary, styled message box for user feedback.
    function showMessageBox(message, type = 'info') {
        let messageBox = document.getElementById('customMessageBox');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'customMessageBox';
            messageBox.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                font-family: 'Arial', sans-serif;
                font-size: 1.1em;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                color: white;
            `;
            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;
        if (type === 'error') {
            messageBox.style.backgroundColor = '#dc3545';
        } else if (type === 'success') {
            messageBox.style.backgroundColor = '#28a745';
        } else {
            messageBox.style.backgroundColor = '#007bff';
        }

        messageBox.style.opacity = '1';
        messageBox.style.transform = 'translateX(-50%) translateY(0)';

        setTimeout(() => {
            messageBox.style.opacity = '0';
            messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                messageBox.remove();
            }, 300);
        }, 3000);
    }


    // --- Hero Section Shop Now Button (on index.html) ---
    const shopNowButton = document.querySelector('.hero-container .shop-button');
    if (shopNowButton) {
        shopNowButton.addEventListener('click', function() {
            window.location.href = 'shop.html';
        });
    }

    // --- Navigation Smooth Scrolling (for links with '#' on index.html) ---
    document.querySelectorAll('nav.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && window.location.pathname.endsWith('index.html')) {
                e.preventDefault();

                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Contact Form Client-Side Validation & Simulated Submission (on index.html) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');

            let isValid = true;

            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';

            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Name is required.';
                isValid = false;
            }

            if (emailInput.value.trim() === '') {
                emailError.textContent = 'Email is required.';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Message is required.';
                isValid = false;
            }

            const formSuccessMessage = document.getElementById('formSuccessMessage');

            if (isValid) {
                console.log('Form submitted successfully:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                });

                formSuccessMessage.textContent = 'Message sent successfully!';
                formSuccessMessage.style.color = 'green';
                contactForm.reset();
            } else {
                formSuccessMessage.textContent = 'Please correct the errors in the form.';
                formSuccessMessage.style.color = 'red';
            }
        });
    }

    // --- Shop Page Banner Button (on shop.html) ---
    const shopBannerButton = document.querySelector('.shop-hero-banner .shop-banner-button');
    if (shopBannerButton) {
        shopBannerButton.addEventListener('click', function() {
            const productGrid = document.querySelector('.product-listing-grid');
            if (productGrid) {
                productGrid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // --- Product Carousel (Our Trending Outfits) Logic ---
    const productCarouselWrapper = document.querySelector('.carousel-section .carousel-items-wrapper');
    const productLeftArrow = document.querySelector('.carousel-section .left-arrow');
    const productRightArrow = document.querySelector('.carousel-section .right-arrow');

    if (productCarouselWrapper && productLeftArrow && productRightArrow) {
        let productItemWidth = 0;
        const firstProductItem = productCarouselWrapper.querySelector('.product-item');
        if (firstProductItem) {
            const itemStyle = getComputedStyle(firstProductItem);
            productItemWidth = firstProductItem.offsetWidth + parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
        }

        const updateProductArrowVisibility = () => {
            if (productCarouselWrapper.scrollLeft === 0) {
                productLeftArrow.classList.add('disabled');
            } else {
                productLeftArrow.classList.remove('disabled');
            }

            const maxScrollLeft = productCarouselWrapper.scrollWidth - productCarouselWrapper.clientWidth;
            if (productCarouselWrapper.scrollLeft >= maxScrollLeft - 5) {
                productRightArrow.classList.add('disabled');
            } else {
                productRightArrow.classList.remove('disabled');
            }
        };

        productRightArrow.addEventListener('click', () => {
            productCarouselWrapper.scrollBy({
                left: productItemWidth * 3,
                behavior: 'smooth'
            });
        });

        productLeftArrow.addEventListener('click', () => {
            productCarouselWrapper.scrollBy({
                left: -productItemWidth * 3,
                behavior: 'smooth'
            });
        });

        productCarouselWrapper.addEventListener('scroll', updateProductArrowVisibility);
        updateProductArrowVisibility();

        window.addEventListener('resize', () => {
            if (firstProductItem) {
                const itemStyle = getComputedStyle(firstProductItem);
                productItemWidth = firstProductItem.offsetWidth + parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight);
            }
            updateProductArrowVisibility();
        });
    }

    // --- Automatic Banner Carousel Logic ---
    const bannerCarouselWrapper = document.querySelector('.banner-carousel-section .carousel-items-wrapper');
    const bannerLeftArrow = document.querySelector('.banner-carousel-section .left-arrow');
    const bannerRightArrow = document.querySelector('.banner-carousel-section .right-arrow');
    const bannerSlideItems = document.querySelectorAll('.banner-carousel-section .carousel-slide-item');

    if (bannerCarouselWrapper && bannerSlideItems.length > 0 && bannerLeftArrow && bannerRightArrow) {
        let bannerSlideWidth = bannerCarouselWrapper.clientWidth;
        const bannerSlideInterval = 2000;
        let bannerAutoSlideTimer;
        let bannerCurrentSlideIndex = 0;

        window.addEventListener('resize', () => {
            bannerSlideWidth = bannerCarouselWrapper.clientWidth;
            updateBannerArrows();
            stopBannerAutoSlide();
            startBannerAutoSlide();
        });

        function updateBannerArrows() {
            if (bannerSlideItems.length <= 1) {
                bannerLeftArrow.classList.add('disabled');
                bannerRightArrow.classList.add('disabled');
            } else {
                bannerLeftArrow.classList.remove('disabled');
                bannerRightArrow.classList.remove('disabled');
            }
        }

        bannerLeftArrow.addEventListener('click', function() {
            bannerCarouselWrapper.scrollBy({
                left: -bannerSlideWidth,
                behavior: 'smooth'
            });
        });

        bannerRightArrow.addEventListener('click', function() {
            bannerCarouselWrapper.scrollBy({
                left: bannerSlideWidth,
                behavior: 'smooth'
            });
        });

        function startBannerAutoSlide() {
            stopBannerAutoSlide();
            bannerAutoSlideTimer = setInterval(() => {
                bannerCurrentSlideIndex++;
                if (bannerCurrentSlideIndex >= bannerSlideItems.length) {
                    bannerCurrentSlideIndex = 0;
                }
                bannerCarouselWrapper.scrollTo({
                    left: bannerSlideWidth * bannerCurrentSlideIndex,
                    behavior: 'smooth'
                });
                updateBannerArrows();
            }, bannerSlideInterval);
        }

        function stopBannerAutoSlide() { // Corrected function name to avoid conflict
            clearInterval(bannerAutoSlideTimer);
        }

        startBannerAutoSlide();

        bannerCarouselWrapper.addEventListener('mouseenter', stopBannerAutoSlide);
        bannerCarouselWrapper.addEventListener('mouseleave', startBannerAutoSlide);
        bannerLeftArrow.addEventListener('mouseenter', stopBannerAutoSlide);
        bannerLeftArrow.addEventListener('mouseleave', startBannerAutoSlide);
        bannerRightArrow.addEventListener('mouseenter', stopBannerAutoSlide);
        bannerRightArrow.addEventListener('mouseleave', startBannerAutoSlide);

        updateBannerArrows();
    }

    // --- Product Detail Showcase (Size buttons, Add to Bag) Logic - On shop.html ---
    const productShowcaseSections = document.querySelectorAll('.product-detail-showcase');

    productShowcaseSections.forEach(section => {
        const sizeButtons = section.querySelectorAll('.size-btn');
        const addToBagBtn = section.querySelector('.add-to-bag-btn');
        const sizeErrorMessage = section.querySelector('.size-error-message'); // Get the specific error message span for this section

        sizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                sizeButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                console.log('Selected size:', button.textContent);
                // Hide the error message when a size is selected
                if (sizeErrorMessage) {
                    sizeErrorMessage.textContent = '';
                    sizeErrorMessage.classList.remove('visible');
                }
                // Reset add to bag button if it was "GO TO CART"
                if (addToBagBtn.dataset.addedToCart === 'true') {
                    addToBagBtn.textContent = 'ADD TO BAG';
                    addToBagBtn.dataset.addedToCart = 'false';
                }
            });
        });

        if (addToBagBtn) {
            addToBagBtn.dataset.addedToCart = 'false';

            addToBagBtn.addEventListener('click', () => {
                const selectedSize = section.querySelector('.size-btn.active');

                if (addToBagBtn.dataset.addedToCart === 'true') {
                    // If already "GO TO CART", navigate to cart.html
                    window.location.href = 'cart.html';
                } else {
                    // If "ADD TO BAG"
                    if (!selectedSize) {
                        // Show the inline error message
                        if (sizeErrorMessage) {
                            sizeErrorMessage.textContent = 'Please select a size';
                            sizeErrorMessage.classList.add('visible');
                        }
                        console.log('Please select a size for the product.');
                    } else {
                        // Hide the inline error message if it was previously shown
                        if (sizeErrorMessage) {
                            sizeErrorMessage.textContent = '';
                            sizeErrorMessage.classList.remove('visible');
                        }

                        // Extract product details from the current section
                        // Ensure these selectors correctly target your HTML structure
                        const productImage = section.querySelector('.showcase-image img').src;
                        const productTitle = section.querySelector('.product-title').textContent.trim(); // Trim whitespace
                        const productSubtitle = section.querySelector('.product-subtitle').textContent.trim();
                        const currentPriceElement = section.querySelector('.current-price');
                        const mrpElement = section.querySelector('.mrp');
                        const discountPercentElement = section.querySelector('.discount-percent');

                        const currentPrice = currentPriceElement ? currentPriceElement.textContent.trim() : '';
                        const mrp = mrpElement ? mrpElement.textContent.trim() : '';
                        const discountPercent = discountPercentElement ? discountPercentElement.textContent.trim() : '';
                        const size = selectedSize.textContent.trim();

                        // Generate a more robust ID for the product
                        // Combine title, subtitle, and size to make it more unique
                        const productId = `${productTitle.replace(/\s+/g, '-')}-${productSubtitle.replace(/\s+/g, '-')}-${size}`.toLowerCase();


                        const product = {
                            id: productId,
                            image: productImage,
                            title: productTitle,
                            subtitle: productSubtitle,
                            currentPrice: currentPrice,
                            mrp: mrp,
                            discountPercent: discountPercent,
                            size: size,
                            quantity: 1 // Default quantity
                        };

                        // Check if item already exists in cart (same ID and size)
                        const existingItemIndex = cartItems.findIndex(item => item.id === product.id); // Use the new robust ID for lookup

                        if (existingItemIndex > -1) {
                            // If item exists, just increment quantity
                            cartItems[existingItemIndex].quantity++;
                            showMessageBox(`Quantity updated for ${product.title} (Size: ${product.size})!`, 'info');
                        } else {
                            // If item does not exist, add new item
                            cartItems.push(product);
                            cartCount++; // Increment global cart count only for new items
                            showMessageBox(`Added ${product.title} (Size: ${product.size}) to bag!`, 'success');
                        }

                        saveCart(); // Save updated cart to localStorage
                        updateCartBadge(); // Update the badge display

                        addToBagBtn.textContent = 'GO TO CART';
                        addToBagBtn.dataset.addedToCart = 'true';
                    }
                }
            });
        }
    });

    // --- Cart Page Specific Logic - On cart.html ---
    // This block runs only if the current page is cart.html
    if (window.location.pathname.endsWith('cart.html')) {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartItemCountDisplay = document.getElementById('cartItemCountDisplay');
        const removeAllBtn = document.getElementById('removeSelectedBtn'); // Renamed for clarity

        // Function to render cart items on the cart page
        function renderCartItems() {
            // Clear existing items
            cartItemsContainer.innerHTML = '';
            // Update cart count display in header
            cartItemCountDisplay.textContent = `${cartItems.length}/${cartItems.length} ITEMS SELECTED`;

            if (cartItems.length === 0) {
                emptyCartMessage.style.display = 'block'; // Show empty cart message
                if (removeAllBtn) removeAllBtn.style.display = 'none'; // Hide remove all button
            } else {
                emptyCartMessage.style.display = 'none'; // Hide empty cart message
                if (removeAllBtn) removeAllBtn.style.display = 'inline-block'; // Show button

                cartItems.forEach((item, index) => {
                    const itemCard = document.createElement('div');
                    itemCard.classList.add('cart-item-card');
                    // Use a unique ID for the card if needed, or rely on index for removal for simplicity
                    // For more complex carts, you might use item.id for the data-id attribute
                    itemCard.dataset.itemIndex = index; // Store index for removal

                    itemCard.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="item-image">
                        <div class="item-details">
                            <h4>${item.title}</h4>
                            <p>${item.subtitle}</p>
                            <p>Size: ${item.size}</p>
                            <p>Qty: ${item.quantity}</p>
                            <div class="item-price">
                                ${item.currentPrice}
                                ${item.mrp ? `<span class="original-price">${item.mrp}</span>` : ''}
                                ${item.discountPercent ? `<span class="discount">${item.discountPercent}</span>` : ''}
                            </div>
                        </div>
                        <button class="remove-item-btn" data-item-index="${index}"><i class="fas fa-times"></i></button>
                    `;
                    cartItemsContainer.appendChild(itemCard);
                });

                // Add event listeners for individual remove buttons after they are rendered
                document.querySelectorAll('.remove-item-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const indexToRemove = parseInt(this.dataset.itemIndex);
                        removeItemFromCart(indexToRemove);
                    });
                });
            }
        }

        // Function to remove an item from the cart by its index
        function removeItemFromCart(index) {
            if (index > -1 && index < cartItems.length) {
                const removedItemTitle = cartItems[index].title;
                cartItems.splice(index, 1); // Remove item from array
                cartCount = cartItems.length; // Update global count
                saveCart(); // Save updated cart
                updateCartBadge(); // Update header badge
                renderCartItems(); // Re-render cart page
                showMessageBox(`${removedItemTitle} removed from cart.`, 'info');
            }
        }

        // Event listener for "REMOVE ALL" button
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', function() {
                if (cartItems.length > 0) {
                    cartItems = []; // Clear all items
                    cartCount = 0;
                    saveCart();
                    updateCartBadge();
                    renderCartItems();
                    showMessageBox('All items removed from cart.', 'success');
                } else {
                    showMessageBox('Cart is already empty.', 'info');
                }
            });
        }

        // Initial render of cart items when cart.html loads
        renderCartItems();
    }

    // Initial update of the cart badge when any page loads (index.html or shop.html)
    updateCartBadge();

}); // End of DOMContentLoaded

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
      searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          const query = searchInput.value.trim().toLowerCase();

          const routes = {
            "western wear": "western.html",
            "formal wear": "formal.html",
            "ethnic wear": "ethnic.html",
            "crop top": "crop.html",
            "t-shirts": "tshirt.html",
            "sundresses": "sundresse.html",
            "casual wear": "casual.html",
            "denim dress": "denim.html"
          };

          if (routes[query]) {
            window.location.href = routes[query];
          } else {
            alert("No results found for: " + query);
          }
        }
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('#searchInput'); // your input field
  const searchForm = document.querySelector('#searchForm'); // your form if any

  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault(); // prevent form submission if inside a form
        performSearch(searchInput.value.trim());
      }
    });
  }

  function performSearch(query) {
    // Define the logic based on keyword
    if (query.toLowerCase().includes('crop')) {
      window.location.href = 'crop.html';
    } else if (query.toLowerCase().includes('western')) {
      window.location.href = 'western.html';
    } else {
      alert('No matching category found!');
    }
  }
});