// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

contract Certificate is ERC721URIStorage {
    uint256 private  counter = 0;

    mapping(address => uint[]) public studentCertificates;
    event CertificateIssued(address,uint256);
    constructor() ERC721('Certifyme', 'CRT') {}

    function awardItem(
        string memory tokenURI
    ) public {   
        _mint(msg.sender, counter);
        _setTokenURI(counter, tokenURI);
        studentCertificates[msg.sender].push(counter);
        counter++;
        emit CertificateIssued(msg.sender, counter-1 );
        
    }

    function getCertificates(
        address _student
    ) external view returns (uint256[] memory) {
        return studentCertificates[_student];
    }
}
