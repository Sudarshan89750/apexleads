# ApexLeads

> A comprehensive sales and marketing platform inspired by GoHighLevel, featuring a CRM, sales pipelines, and a central dashboard, built for demonstration.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Sudarshan89750/apexleads)

## About The Project

ApexLeads is a comprehensive, all-in-one sales and marketing platform designed to provide businesses with the tools they need to manage leads, nurture customer relationships, and automate their marketing efforts. This project is a clone of the popular GoHighLevel platform, built for demonstration purposes to showcase advanced UI/UX design and scalable architecture on the Cloudflare ecosystem. It features a central dashboard for at-a-glance metrics, a robust CRM for contact management, a visual sales pipeline (Kanban board) for tracking opportunities, and foundational placeholders for future features like calendars and marketing automation. The primary focus is on creating a visually stunning, intuitive, and highly performant user experience that feels like a premium, production-ready SaaS product.

**Disclaimer:** This application is a clone of GoHighLevel created for educational and demonstrative purposes only and is not affiliated with, endorsed by, or sponsored by GoHighLevel in any way.

## Key Features

-   **Dashboard:** A high-level overview of key business metrics using charts and stat cards.
-   **Contacts CRM:** Manage all customer and lead information in a sortable, searchable data table.
-   **Opportunities Pipeline:** A visual, drag-and-drop Kanban board to manage sales stages.
-   **Modern UI/UX:** Built with shadcn/ui and Tailwind CSS for a clean, responsive, and professional interface.
-   **Scalable Architecture:** Powered by Cloudflare Workers and Durable Objects for a robust and performant backend.

## Technology Stack

-   **Frontend:**
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [React Router](https://reactrouter.com/) for navigation
    -   [@dnd-kit](https://dndkit.com/) for drag-and-drop
    -   [Recharts](https://recharts.org/) for data visualization
-   **Backend:**
    -   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for stateful coordination

## Project Structure

-   `src/`: Contains the React frontend application built with Vite.
-   `worker/`: Contains the Hono backend API running on Cloudflare Workers.
-   `shared/`: Contains shared types and data structures used by both the frontend and backend to ensure type safety.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated (`wrangler login`).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/apexleads.git
    cd apexleads
    ```

2.  **Install dependencies:**
    The project uses Bun for package management.
    ```sh
    bun install
    ```

### Running in Development

To start the development server, which includes the Vite frontend and the local Wrangler server for the backend, run:

```sh
bun dev
```

This will open the application in your default browser, typically at `http://localhost:3000`. The frontend will automatically proxy API requests to the worker backend, enabling a seamless development experience.

## Deployment

This project is designed to be deployed seamlessly to the Cloudflare network.

1.  **Build the project:**
    This command bundles the frontend and backend for production.
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Run the deploy script to publish your application.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly to Cloudflare with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Sudarshan89750/apexleads)