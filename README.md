# <img src="resources/wartlock_logo.png" width="30" height="30"> Wartlock
Wartlock is a user-friendly and secure cryptocurrency wallet designed specifically for the WART blockchain. It provides a graphical interface for managing WART assets, sending and receiving transactions, and ensuring private key security.

> Beta Notice: Wartlock is currently in its beta phase. Some security features are still in development, and the wallet is not yet fully audited. Use it at your own risk.

## Features
- User-Friendly Interface – Simple and intuitive design for easy navigation.
- Secure Key Management – Your private keys remain under your control.
- Send & Receive WART – Easily manage your transactions with a seamless experience.
- Lightweight & Fast – Optimized for performance without compromising security.
- Cross Platform - Wartlock is supported for (Windows, Linux and MacOS)

## Installation & Setup
> Wartlock is in beta. Avoid using it with large amounts of WART until a full security audit is completed.
1. Download the latest release from Releases (link to be updated).
2. Install & Run
3. Create or Import Wallet

## Import from other wallets
If you were already using [andrewcrypto777/wart-wallet](https://github.com/andrewcrypto777/wart-wallet) importing your wallet on wartlock using your mnemonic **isn't possible at the moment**, since andrew's wallet is using a different stack we can't generate the same address due to the different library implementations on Python and Nodejs, *Yet it's still possible to import your wallets by copying `wartlock.db` into Wartlock directory**, Wartlock do have an almost identical database integrations to andrew's wallet.
> Copying `wartlock.db` is a temporary solution, We're working on a recover wallet using private key feature soon


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
Download BZMiner here: [BZMiner Releases](https://github.com/bzminer/bzminer/releases)  

Your support helps maintain and improve Wartlock. Thank you.
