# Task: Update App Auth Flow - Splash to Homepage + Checkout-only Protection

## Steps:
1. ~~Create TODO.md~~ ✅
2. ✅ Edit `src/pages/SplashPage.tsx`: Change navigate('/login') → navigate('/home')
3. ✅ Edit `src/App.tsx`: Remove ProtectedRoute from public routes (/home, /menu, /search, /product/:id, /cart, /offers, /about, /contact, /faq, /terms)
4. ~~Verify ProtectedRoute remains ONLY on checkout & account pages~~ ✅ (/checkout, /order-success, /orders*, /profile*, /favorites, /settings*, /reservations*, /manage-address, /payment-methods)
5. Test: Run dev server, splash → /home OK, menu/cart OK, /checkout → /login
6. [COMPLETE] attempt_completion

**Current: Step 5**
