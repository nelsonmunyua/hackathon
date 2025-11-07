# JiraniLink

JiraniLink is a community-driven platform that connects neighbors to borrow and share items, fostering trust and collaboration within local communities. Built with React, this application allows users to browse available items, make borrow requests, and build a network of trusted neighbors.

## Features

- **Item Catalog**: Browse a comprehensive list of items available for borrowing from neighbors
- **Search & Filter**: Find items by name, description, or category
- **Borrow Requests**: Submit borrow requests with dates and manage approvals
- **User Profiles**: View neighbor profiles with ratings and reviews
- **Responsive Design**: Optimized for desktop and mobile devices
- **Pagination**: Efficient browsing through large item catalogs

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Linting**: ESLint
- **Styling**: CSS Modules

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hackathon
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- **Home Page**: Introduction to JiraniLink and its features
- **Catalog**: Browse and search for available items
- **My Items**: Manage your own items (future feature)
- **Profile**: View and edit your profile information

## Project Structure

```
hackathon/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── BorrowRequestModal.jsx
│   │   ├── ItemCard.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchBar.jsx
│   ├── data/
│   │   └── mockData.json
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   ├── Home.jsx
│   │   ├── MyItems.jsx
│   │   └── Profile.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contributors

- Nelson
- Jeff
- Victor
- Lewis
- Mark

## License

This project is licensed under the MIT License.
