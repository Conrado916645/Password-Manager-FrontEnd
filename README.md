# (Frontend Portal)

The unified user interface for the architecture. This frontend provides a secure, intuitive, and highly responsive dashboard for managing infrastructure, handling zero-knowledge encrypted credentials, and administering remote VPN gateways.

---

## 🚀 Core Features

* **Modular Dashboard:** A clean, permission-driven portal granting access to specific system modules (System Admin, Password Vault, VPN Manager) based on user roles.
* **VPN Manager Interface:** Dedicated UI for creating, tracking, and updating VPN connections, remote gateways, and pre-shared keys.
* **Zero-Knowledge Vault UI:** Client-side handling of end-to-end encrypted payloads. Passwords and secrets are encrypted within the browser before ever reaching the backend.
* **Local-First Design:** Optimized for rapid, offline-capable, local network environments without relying on external cloud dependencies.
* **Responsive & Accessible:** Fully responsive design utilizing modern CSS utility classes for seamless scaling across devices with Light and Dark mode support.

## 🛠️ Technology Stack

* **Core Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for strict, type-safe UI components.
* **Build Tool:** [Vite](https://vitejs.dev/) for lightning-fast Hot Module Replacement (HMR) and optimized production builds.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first, highly customizable component styling.
* **Icons:** [Lucide React](https://lucide.dev/) for clean, consistent vector iconography.
* **Networking:** [Axios](https://axios-http.com/) for streamlined HTTP requests and API interceptor management.

---

## ⚙️ Local Development Setup

Follow these steps to configure and run the frontend environment locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/infra-sentinel-frontend.git](https://github.com/yourusername/infra-sentinel-frontend.git)
cd infra-sentinel-frontend
