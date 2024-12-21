// Import Cypress commands
describe('E2E Test: Add Products to Cart and Manage Quantities', () => {
  it('Logs in, navigates to the menu, adds products to cart, and manages quantities', () => {
    // Visit login page
    cy.visit('http://localhost:3000/pages/auth/login');

    // Login with username and password
    cy.get('#username').type('hana1'); // Replace with actual username selector
    cy.get('#password').type('hana123'); // Replace with actual password selector
    cy.get('button[type="submit"]').click();

    // Verify redirection to home page
    cy.url().should('include', 'pages/client/homepage');

    // Navigate to menu page using navbar
    cy.get('a[href="/pages/client/products"]').contains('Menu Items').click();
    cy.url().should('include', '/pages/client/products');

    // Add the first product to the cart
    cy.get('ul li').first().within(() => {
      cy.get('button').contains('Add to Cart').click(); // Locate the "Add to Cart" button
    });

    // Wait for the cart state to be updated (button with '+' should now be visible)
    cy.get('ul li').first().within(() => {
      cy.get('button').contains('+').should('be.visible'); // Wait until the button is visible
    });

    // Increment the quantity of the product
    cy.get('ul li').first().within(() => {
      cy.get('button').contains('+').click(); // Click the increment button
    });

    // Assert the updated quantity
    cy.get('ul li').first().within(() => {
      cy.get('span').should('contain.text', '2'); // Ensure quantity displays as 2
    });

    // Decrement the quantity of the product
    cy.get('ul li').first().within(() => {
      cy.get('button').contains('-').click(); // Click the decrement button
    });

    // Assert the updated quantity
    cy.get('ul li').first().within(() => {
      cy.get('span').should('contain.text', '1'); // Ensure quantity displays as 1
    });

    // Verify another product can be added to the cart
    cy.get('ul li').eq(1).within(() => {
      cy.get('button').contains('Add to Cart').click(); // Locate the "Add to Cart" button for the second product
    });

    // Assert the second product is also added to the cart
    cy.get('ul li').eq(1).within(() => {
      cy.get('span').should('contain.text', '1'); // Ensure quantity displays as 1 for the second product
    });

    // Navigate to the cart page using navbar
    cy.get('a[href="/pages/client/cart"]').contains('Cart').click();
    cy.url().should('include', '/pages/client/cart');

    // Verify cart contains the selected products
    cy.get('.cart-item').should('have.length', 2); // Ensure there are 2 items in the cart
    cy.get('.cart-item').first().within(() => {
      cy.get('.product-name').should('exist'); // Verify the first product's name is visible
    });
    cy.get('.cart-item').last().within(() => {
      cy.get('.product-name').should('exist'); // Verify the second product's name is visible
    });

    // Proceed to checkout
    cy.get('button').contains('Checkout').click();

    // Verify navigation to checkout page
    cy.url().should('include', '/pages/client/cart/checkout');

    // Enter address details for the order
    cy.get('#address').type('123 Test Street, Test City');

    // Enter payment method details
    cy.get('#paymentMethod').type('Credit Card'); // Assuming paymentMethod field is added

    // Place the order
    cy.get('button').contains('Place Order').click();

    // Assert that the order is successfully placed and confirmation message appears
    cy.contains('Order placed successfully!').should('be.visible'); // Replace with actual success message

    // Optionally, you can verify that the page navigates back to the homepage or another page after successful order placement
    cy.url().should('include', '/pages/client/homepage');
  });
});
