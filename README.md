# Picobello BV Next.js frontend

Headless Next.js frontend for a Trip Administration project in Drupal ([picobello-bv](https://github.com/AppelBoomHD/picobello-bv))

## Available Commands

| Command                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm install`               | Install project dependencies                             |
| `npm start` / `npm run dev` | Builds project and open web server, watching for changes |
| `npm run build`             | Builds code bundle with production settings              |
| `npm serve`                 | Run a web server to serve built code bundle              |

## Development

After cloning the repo, run `npm install` from your project directory. Make a copy of `.env.example` and name it `.env`. Replace the values in `.env` with the correct values for your project.
Then, you can start the local development server by running `npm start` and navigate to http://localhost:3000.

## Production

After running `npm run build`, the files you need for production will be in the `dist` folder. To test code in your `dist` folder, run `npm run serve` and navigate to http://localhost:5000
