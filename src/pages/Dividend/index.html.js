const html = `<p>A contract that pays dividend to shareholders should</p>
<ul>
<li>receive payment</li>
<li>for simplicity, have a fixed distribution of shares</li>
<li>shareholders can withdraw dividend at any time</li>
</ul>
<p>We let the user withdraw their dividend. For more information about <code>Push vs Pull</code> contract design, check out <a href="https://consensys.github.io/smart-contract-best-practices/recommendations/#favor-pull-over-push-for-external-calls">here</a></p>
<pre><code class="language-solidity">pragma solidity ^0.5.11;

contract Dividend {
    event AddShareholder(address indexed account, uint shares);
    event Deposit(address indexed sender, uint amount);
    event Withdraw(address indexed account, uint amount);

    uint public totalShares;
    mapping(address =&gt; uint) public shares;

    // We keep track of withdrawn amount so that the amount a shareholder can
    // withdraw can be calculated.
    uint public totalWithdrawn;
    mapping(address =&gt; uint) withdrawn;

    constructor(address[] memory _shareholders, uint[] memory _shares) public {
        require(_shareholders.length &gt; 0, "Shareholder addresses required");
        require(_shareholders.length == _shares.length, "shareholders.length != shares.length");

        for (uint i = 0; i &lt; _shareholders.length; i++) {
            _addShareholder(_shareholders[i], _shares[i]);
        }
    }

    function () external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Warning: For simplicity, we skip checks on arithmetic overflows.
    function withdraw(address payable account) public {
        require(shares[account] &gt; 0, "Not a shareholder");

        uint totalReceived = address(this).balance + totalWithdrawn;

        uint amount = totalReceived * shares[account] / totalShares - withdrawn[account];

        require(amount &gt; 0, "Payment amount must be &gt; 0");

        withdrawn[account] += amount;
        totalWithdrawn += amount;

        account.transfer(amount);

        emit Withdraw(account, amount);
    }

    // Helper function to get balance of this contract.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Private function to add shareholder.
    function _addShareholder(address _account, uint _shares) private {
        require(_account != address(0), "Invalid shareholder address");
        require(_shares &gt; 0, "Shares must be &gt; 0");
        require(shares[_account] == 0, "Shareholder already added");

        shares[_account] = _shares;
        totalShares += _shares;

        emit AddShareholder(_account, _shares);
    }
}
</code></pre>
`

export default html
