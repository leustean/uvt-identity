pragma solidity ^0.8.0;

contract IdentityManager {
    event UserCreated(address _user);
    event UserUpdated(address _user);

    struct User {
        address account;
        bytes encryptedData;
        bytes userEncryptedSymmetricKey;
        bytes institutionEncryptedSymmetricKey;
        bool institutionManaged;
    }

    address public owner;
    mapping(address => User) public users;

    constructor(){
        owner = msg.sender;
    }

    modifier ownerRestricted() {
        require(msg.sender == owner);
        _;
    }

    function createUser(
        User calldata _user
    ) public ownerRestricted {
        User storage user = users[_user.account];
        require(user.account == address(0x0));
        users[_user.account] = _user;
        emit UserCreated(user.account);
    }

    function setUserData(
        address _user,
        bytes calldata _encryptedData
    ) public ownerRestricted {
        User storage user = users[_user];
        require(user.account != address(0x0));
        user.encryptedData = _encryptedData;
        emit UserUpdated(user.account);
    }

    function getUser(
        address _user
    ) public view returns (
        User memory
    ){
        User storage user = users[_user];
        require(user.account != address(0x0));
        return user;
    }

}
