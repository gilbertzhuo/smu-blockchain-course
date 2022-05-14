// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
pragma experimental ABIEncoderV2;

contract FileSystem {
    struct item {
        string name;
        string sex;
        string ic;
        string dob;
        string vaccination_status;
        string date;
    }

    mapping(string => item) public store;

    event data(
        string id,
        string sex,
        string name,
        string ic,
        string dob,
        string date,
        string vaccination_status
    );

    function createCert(
        string memory id,
        string memory sex,
        string memory name,
        string memory ic,
        string memory dob,
        string memory date,
        string memory vaccination_status
    ) public {
        store[id] = item(name, sex, ic, dob, vaccination_status, date);
        emit data(id, name, sex, ic, dob, vaccination_status, date);
    }

    function fetchCert(string memory id) public view returns (item memory) {
        return store[id];
    }
}
