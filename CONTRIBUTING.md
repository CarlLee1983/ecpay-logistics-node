# Contributing to ecpay-logistics-node

Thank you for your interest in contributing! We welcome bug reports, feature requests, and pull requests to make this SDK better for the community.

## How to Contribute

### 1. Reporting Bugs & Feature Requests

- **Check existing issues** to see if your topic has already been reported.
- **Open a new issue** using the provided templates.
- Provide a clear description, reproduction steps, and expected behavior.

### 2. Development Setup

This project uses [Bun](https://bun.sh/) for testing and [pnpm](https://pnpm.io/) / [npm](https://www.npmjs.com/) for package management.

```bash
# Clone the repo
git clone https://github.com/CarlLee1983/ecpay-logistics-node.git
cd ecpay-logistics-node

# Install dependencies
bun install

# Run tests
bun test

# Run linting
bun run lint
```

### 3. Coding Guidelines

- **TypeScript**: We use strict TypeScript. Ensure all types are defined (avoid `any`).
- **Style**: We use `eslint` and `prettier` (via `eslint-plugin-prettier`).
  - No semicolons.
  - Single quotes.
  - 2-space indentation.
- **Testing**: New features **must** include unit tests. We target >95% coverage.
- **Commits**: Please follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: ...`, `fix: ...`, `docs: ...`).

### 4. Pull Request Process

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feat/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request against the `main` branch.
6.  Ensure all CI checks pass.

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
