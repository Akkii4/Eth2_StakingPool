# StakingPoolFund

StakingPoolFund is a smart contract for managing an investment pool where investors can contribute Ether during a specified investment period and then claim their share of any remaining Ether after the investment period ends. The contract also allows the owner to deposit Ether into a separate deposit contract using unique public keys.

## Installation

1. Clone this repository
2. Install dependencies: `npm install`

## Usage

1. Compile the contracts: `npx hardhat compile`
2. Run the tests: `npx hardhat test`
3. Deploy the contract: `npx hardhat run scripts/deploy.js --network <network-name>`

Replace `<network-name>` in the deploy command with the name of the network you want to deploy to (e.g. `rinkeby`, `mainnet`, etc.).

## Contract Details

### StakingPoolFund

This contract manages the investment pool and allows investors to invest during a specified investment period. After the investment period ends, investors can claim their share of any remaining Ether in the pool. The owner can also deposit Ether into a separate deposit contract using unique public keys.

### IDepositContract

This interface defines the deposit function for the deposit contract that the owner can deposit Ether into using unique public keys.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
