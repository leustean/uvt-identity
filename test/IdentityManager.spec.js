const IdentityManager = artifacts.require("IdentityManager");

contract("IdentityManager", accounts => {
    it("owner should be able to create a user", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createUser({
            account: accounts[1],
            encryptedData: [2],
            userEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});


        const user = await identityManagerInstance.getUser.call(accounts[1]);

        assert.equal(user.account, accounts[1]);
        assert.equal(user.encryptedData, '0x02');
        assert.equal(user.userEncryptedSymmetricKey, '0x03');
        assert.equal(user.institutionEncryptedSymmetricKey, '0x04');
        assert.equal(user.institutionManaged, true);
    });

    it("not owner should NOT be able to create user", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        try {
            await identityManagerInstance.createUser({
                account: accounts[2],
                encryptedData: [2],
                userEncryptedSymmetricKey: [3],
                institutionEncryptedSymmetricKey: [4],
                institutionManaged: true
            }, {from: accounts[1]});
        } catch (error) {
            assert.equal(error.data.name, 'RuntimeError')
        }
    });

    it("owner should be able to update user data", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createUser({
            account: accounts[5],
            encryptedData: [2],
            userEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        await identityManagerInstance.setUserData(accounts[5], "0x20", {from: accounts[0]});

        const user = await identityManagerInstance.getUser.call(accounts[5]);

        assert.equal(user.account, accounts[5]);
        assert.equal(user.encryptedData, '0x20');
    });

    it("not owner should NOT be able to update user data", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createUser({
            account: accounts[6],
            encryptedData: [2],
            userEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        try {
            await identityManagerInstance.setUserData(accounts[6], "0x20", {from: accounts[1]});
        } catch (error) {
            assert.equal(error.data.name, 'RuntimeError')
        }
    });
});
