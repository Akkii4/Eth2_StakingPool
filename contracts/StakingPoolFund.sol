pragma solidity ^0.7.0;

interface IDepositContract {
    function deposit(
        bytes calldata publicKey,
        bytes calldata passPhrase,
        bytes calldata authorization,
        bytes32 root
    ) external payable;
}

contract StakingPoolFund {
    mapping(address => uint) public accountBalances;

    mapping(bytes => bool) public usedPublicKeys;

    IDepositContract public depositContract =
        IDepositContract(0x00000000219ab540356cBB839Cbe05303d7705Fa);

    address public owner;

    uint public deadline;

    bool public finalized;

    uint public totalInvestment;

    uint public totalChange;

    mapping(address => bool) public claimedChange;

    event NewInvestor(address investor);

    constructor() {
        owner = msg.sender;

        deadline = block.timestamp + 7 days;
    }

    function invest() external payable {
        require(block.timestamp < deadline, "Sorry, the deadline has passed");

        if (accountBalances[msg.sender] == 0) {
            emit NewInvestor(msg.sender);
        }

        accountBalances[msg.sender] += msg.value;
    }

    function finalize() external {
        require(block.timestamp >= deadline, "It's too early to finalize");

        require(finalized == false, "Already finalized");

        finalized = true;

        totalInvestment = address(this).balance;

        totalChange = address(this).balance % 32 ether;
    }

    function claimChange() external {
        require(finalized == true, "Not yet finalized");

        require(accountBalances[msg.sender] > 0, "Not an investor");

        require(
            claimedChange[msg.sender] == false,
            "Already claimed the change"
        );

        claimedChange[msg.sender] = true;

        uint amount = (totalChange * accountBalances[msg.sender]) /
            totalInvestment;

        msg.sender.send(amount);
    }

    function deposit(
        bytes calldata publicKey,
        bytes calldata passPhrase,
        bytes calldata authorization,
        bytes32 root
    ) external {
        require(finalized == true, "Too early");

        require(msg.sender == owner, "Only the owner can deposit");

        require(address(this).balance >= 32 ether);

        require(
            usedPublicKeys[publicKey] == false,
            "This public key was already used"
        );

        depositContract.deposit{value: 32 ether}(
            publicKey,
            passPhrase,
            authorization,
            root
        );
    }
}
