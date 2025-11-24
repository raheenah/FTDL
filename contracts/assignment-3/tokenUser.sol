// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./token.sol"; 

contract TokenUser {
    IERC20 public token;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }


    function deposit(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "transferFrom failed");
    }


    function withdraw(uint256 amount) external {
        require(token.transfer(msg.sender, amount), "transfer failed");
    }


    function contractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
