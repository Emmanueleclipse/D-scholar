//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Paper.sol";

contract User {
    mapping(address => Paper) public papers;
    address[] public papers_array;
    address public user_address;
    bool verified;

    constructor(address _address) {
        user_address = _address;
        verified = false;
        console.log("Deploying a User");
    }

    function getPapers() public view returns (address[] memory _address) {
        return papers_array;
    }

    function getPaper(address _paperAddress) public view returns (Paper) {
        return papers[_paperAddress];
    }

    function verify() public {
        verified = true;
    }

    function deployPaper(string memory _ipfsHash) public returns(address newContract) {
        if( msg.sender == user_address ) {
            Paper p = new Paper(_ipfsHash, user_address);
            papers[address(p)] = p;
            papers_array.push(address(p));
            return address(p);
        }
    }
}
