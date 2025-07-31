# Admin Dashboard By Faheem

A modern, responsive admin dashboard built with **React**, **Vite**, **Supabase**, and **shadcn/ui**. Easily manage products with authentication, robust CRUD operations, and a polished UI.

## Features

- **Authentication:** Secure login/logout using Supabase.
- **Product Management:** Add, edit, delete, and search products.
- **Responsive UI:** Beautiful glassmorphism design with Tailwind CSS and shadcn/ui components.
- **Live Search:** Filter products by name or category.
- **Loading & Error States:** User-friendly feedback for all actions.
- **Form Validation:** (Recommended for Product Form) Use `react-hook-form` and `yup` for robust validation.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-hook-form](https://react-hook-form.com/) & [yup](https://github.com/jquense/yup) (recommended for forms)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a project at [Supabase](https://supabase.com/).
   - Copy your Supabase URL and anon key into `src/supabaseClient.js`.

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Login:** Register/login with your Supabase credentials.

## Folder Structure

```
src/
  ├── components/      # Reusable UI components (shadcn/ui)
  ├── pages/           # Main pages (Dashboard, Login, Product Form)
  ├── supabaseClient.js
  └── App.jsx
```

## Customization

- **Styling:** Easily customize with Tailwind and shadcn/ui.
- **Validation:** Enhance forms with react-hook-form and yup for professional UX.
## 🌐 Live URL
- [Live URL](https://admin-dashboard-sable-psi.vercel.app/)
## License

MIT

---

Made with ❤️ by Faheem
