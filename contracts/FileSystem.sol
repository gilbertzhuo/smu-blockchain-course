// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.16;
pragma experimental ABIEncoderV2;

contract FileSystem {

    struct item{
        string name;
        string course;
        string issuer; 
        string date;
    }

    mapping(string => item) public store;

    event data(string id, string name, string course, string issuer, string date);
    function createCert(string memory id, string memory name, string memory course, string memory issuer, string memory date) public {
        store[id] = item(name, course, issuer, date);
        emit data(id, name, course, issuer, date);
    }

    function fetchCert(string memory id) public view returns(item memory) {
        return store[id];
    }
}