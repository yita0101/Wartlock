# <img src="resources/wartlock_logo.png" width="30" height="30"> Wartlock

Wartlock is a user-friendly and secure cryptocurrency wallet designed specifically for the WART blockchain. It provides a graphical interface for managing WART assets, sending and receiving transactions, and ensuring private key security.

> Beta Notice: Wartlock is currently in its beta phase. Some security features are still in development, and the wallet is not yet fully audited. Use it at your own risk.

> **Warning: Light mode is currently non-functional. Please avoid using it until the next update, which will include fixes.**

## Features

- User-Friendly Interface – Simple and intuitive design for easy navigation.
- Secure Key Management – Your private keys remain under your control.
- Send & Receive WART – Easily manage your transactions with a seamless experience.
- Lightweight & Fast – Optimized for performance without compromising security.
- Cross Platform - Wartlock is supported for (Windows, Linux and MacOS)

## Installation & Setup

### Build from source

> Choose the command for your system to build, then run the setup

```
bun i
bun run build:win
bun run build:linux
bun run build:mac
```

OR

> Wartlock is in beta. Avoid using it with large amounts of WART until a full security audit is completed.

1. Download the latest release from [Releases](https://github.com/riven-labs/Wartlock/releases).
2. Install & Run
3. Create or Import Wallet

## Import from other wallets

If you were already using [andrewcrypto777/wart-wallet](https://github.com/andrewcrypto777/wart-wallet) you can import your wallet by your mnemonic using the **Recover Wallet** option, **Yet it's also still possible to import your wallets by copying `wartlock.db` into Wartlock directory**, Wartlock do have an almost identical database integrations to andrew's wallet and we do have migrations in place to make `wartwallet.db` work for wartlock.

> Note: **Copying the database would leave all your wallets without names, if you want to name your wallet you must edit `wartwallet.db` manually using something like DB SQLite browser**

## Docker build

### Build Linux:

```
DOCKER_BUILDKIT=1 docker build . -f dockerfiles/linux.dockerfile --output build
```

### Build Windows:

```
DOCKER_BUILDKIT=1 docker build . -f dockerfiles/win.dockerfile --output build
```

## Contributing

We welcome feedback and contributions! If you find bugs or have feature suggestions, open an issue or submit a pull request

## Developer fees (Optional)

To keep Wartlock growing and improving, we’ve included an optional 5% developer fee on wallet transactions. This small contribution helps **fund ongoing development, security enhancements, and new features.**

When sending a transaction, the developer fee is automatically calculated—but you’re in full control! **You can adjust it to any amount, even zero, or increase it if you’d like to give back more.**

Every contribution, big or small, helps make Wartlock even better. Thank you for your support! ❤️

> Developer donations don’t include network fees—your full contribution goes to Wartlock. The transaction is optimized for low network fees, but since it’s sent from your wallet, the fee will be deducted from your balance separately.

## Support Wartlock

Wartlock is an open-source project, and community support helps drive its development. If you find value in Wartlock and would like to contribute, consider donating or mining to support ongoing improvements.

## Donate WART

Send WART to the developer address:

```
aca4916c89b8fb47784d37ad592d378897f616569d3ee0d4
```

## Mine to Support Wartlock

You can also support Wartlock by mining on the developer address using **BZMiner**:

```bash
bzminer -a warthog -p stratum+tcp://de.warthog.herominers.com:1143 -w aca4916c89b8fb47784d37ad592d378897f616569d3ee0d4.donation --nc 1
```

Or janusminer ( Make sure to replace `YOUR_NODE_IP` and `YOUR_NODE_PORT` with your node information )

```bash
janusminer -a aca4916c89b8fb47784d37ad592d378897f616569d3ee0d4 -h YOUR_NODE_IP -p YOUR_NODE_PORT
```

Download BZMiner here: [BZMiner Releases](https://github.com/bzminer/bzminer/releases)
Download JanusMiner here: [JanusMiner Releases](https://github.com/CoinFuMasterShifu/janusminer/releases)

Your support helps maintain and improve Wartlock. Thank you.
