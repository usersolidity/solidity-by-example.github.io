const html = `<p>Functions and addresses declared <code>payable</code> can receive <code>ether</code> into the contract.</p>
<pre><code class="language-solidity">pragma solidity ^0.5.11;

contract Wallet {
    event Deposit(address sender, uint amount, uint balance);
    event Withdraw(uint amount, uint balance);
    event Transfer(address to, uint amount, uint balance);

    // Payable address can receive Ether
    address payable public owner;

    constructor() public payable {
        owner = msg.sender;
    }

    // Try calling this function along with some ether.
    // The balance of this contract will be automatically updated.
    function deposit() public payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // Try calling this function along with some ether.
    // The function would throw an error since this function is not payable.
    function notPayable() public {
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function withdraw(uint _amount) public onlyOwner {
        owner.transfer(_amount);
        emit Withdraw(_amount, address(this).balance);
    }

    function transfer(address payable _to, uint _amount) public onlyOwner {
        _to.transfer(_amount);
        emit Transfer(_to, _amount, address(this).balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
</code></pre>
`

export default html
