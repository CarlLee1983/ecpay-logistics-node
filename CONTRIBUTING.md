# Contributing to ecpay-logistics-node

Thank you for your interest in contributing! We welcome bug reports, feature requests, and pull requests to make this SDK better for the community.

## How to Contribute

### 1. Reporting Bugs & Feature Requests

- **Check existing issues** to see if your topic has already been reported.
- **Open a new issue** using the provided templates.
- Provide a clear description, reproduction steps, and expected behavior.

### 2. Development Setup

This project uses [Bun](https://bun.sh/) for package management, testing, and development.

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

**Git Hooks**: This project uses [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) to run pre-commit checks. When you commit, it will automatically:
- Run TypeScript type checking
- Run Biome linting

If any check fails, the commit will be blocked. Fix the issues and try again.

The hooks are configured in `package.json` under the `simple-git-hooks` field. After installing dependencies, run `bun run prepare` to set up the hooks.

### 3. Coding Guidelines

- **TypeScript**: We use strict TypeScript. Ensure all types are defined (avoid `any`).
- **Style**: We use [Biome](https://biomejs.dev/) for linting and formatting.
  - No semicolons.
  - Single quotes.
  - 2-space indentation.
  - 100 character line width.
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
