# Security Policy

## Supported Versions

The following versions of `ecpay-logistics-node` are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please prioritize responsible disclosure.

1.  **Do NOT open a public GitHub issue.** This allows time for the vulnerability to be patched before it is widely known.
2.  Email the maintainer directly at [maintainer-email@example.com] (Replace with actual email if desired, or instruct to use private vulnerability reporting).
3.  Include as much detail as possible:
    - Type of vulnerability (e.g., XSS, SQL Injection - though unlikely in this SDK).
    - Full steps to reproduce.
    - Sample code or proof-of-concept.

## Security Features

This SDK includes built-in security features for ECPay Logistics integration:

- **CheckMacValue Generation**: Automatically calculates the required MD5 checksum for all requests.
- **CheckMacValue Verification**: Provides `LogisticsNotify.verify()` to validate callbacks from ECPay, preventing tampering.
- **Encapsulation**: Helper methods ensure correct parameter formatting, reducing the risk of malformed requests.

## Best Practices

- **Never commit your `HashKey` and `HashIV` to version control.** Use environment variables (e.g., `dotenv`).
- Always verify the checksum of incoming notifications using `LogisticsNotify.verify()`.
- Regularly update this package to the latest version to receive security patches.
