## Prerequisites

- Node.js
- npm or yarn
- Python (if required for additional backend tasks)

## Getting Started

### Backend

1. Navigate to the backend directory:

    ```sh
    cd CSTech-Assignment-Backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `CSTech-Assignment-Backend` directory and add the following environment variables:

    ```env
    PORT=5000
    JWT_SECRET=your_jwt_secret
    MONGO_URI=your_mongodb_uri
    ```

4. Start the backend server:

    ```sh
    npm run dev
    ```

### Frontend

1. Navigate to the frontend directory:

    ```sh
    cd CSTech-Assignment-Frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `CSTech-Assignment-Frontend` directory and add the following environment variables:

    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```

4. Start the frontend development server:

    ```sh
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register a new user or login with existing credentials.
3. Add agents using the "Add Agents" form.
4. Upload a CSV file using the "Upload CSV" form to distribute tasks among agents.

## Available Scripts

### Backend

- `npm run dev`: Starts the backend server with nodemon for development.
- `npm start`: Starts the backend server.

### Frontend

- `npm run dev`: Starts the frontend development server.
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Runs ESLint to check for linting errors.
- `npm run preview`: Previews the production build.

## Dependencies

### Backend

- bcryptjs
- cookie-parser
- cors
- csv-parser
- dotenv
- express
- jsonwebtoken
- mongoose
- multer
- nodemon

### Frontend

- @tailwindcss/vite
- axios
- react
- react-dom
- react-router-dom
- tailwindcss

## License

This project is licensed under the MIT License.

