// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initbalance) payable{
        owner=payable(msg.sender);
        balance= initbalance;
    }
    function account() public view returns(address){
        return owner;
    }
    function getBalance() public view returns(uint256){
        return balance;
    }
    function deposit(uint256 _amount) public payable{
        balance+=_amount;
        emit Deposit(_amount);
    }
    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender==owner,"Only owner has access!");
        balance-=_withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }
}
