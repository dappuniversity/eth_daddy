// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    // string public name;
    // string public symbol;
    // here we will use "name" and "symbol" variables from our ERC721.sol contract

    address public owner;
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol) {
        // passing same arguements in constructor of ERC721 contract 
        owner = msg.sender;
    }
    uint256 public maxSupply  = 0;
    uint256 public totalSupply = 0;

    modifier onlyOwner() {
        require(msg.sender == owner, "You don't have access to this function!");
        _;
    }
    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping (uint256 => Domain) public domains;
    
    function listDomain(string memory _name, uint256 _cost) public onlyOwner{
        domains[0]   =  Domain(_name, _cost, false);
        maxSupply++;
    }

    function getDomain(uint256 _id) public view returns(Domain memory){
        return domains[_id];
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function mint(uint256 _id) public payable {
        require(_id <= maxSupply, "Invalid Request");
        require(domains[_id].isOwned == false, "This is already owned by someone else");
        require(msg.value > domains[_id].cost, "You do not have sufficient funds!");
        _safeMint(msg.sender, _id);
        domains[_id].isOwned = true;
        totalSupply++;
        // getDomain(_id).isOwned = true; // for some weried reason, this does not work 
    }

    function withdraw() public onlyOwner {
        // payable(owner).transfer(address(this).balance);
        // this also works
        (bool success, ) = owner.call{value: address(this).balance}("we can write anything here while sending funds to owner");
        // calls CALL method in global variable OWNER and if it returns true in success, transaction gets completed
        require(success);
}
}
