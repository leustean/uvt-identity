pragma solidity ^0.8.0;

contract IdentityManager {
    event StudentCreated(address _student);
    event StudentUpdated(address _student);

    struct Student {
        address student;
        bytes encryptedFirstName;
        bytes encryptedLastName;
        bytes encryptedData;
        bytes studentEncryptedSymmetricKey;
        bytes institutionEncryptedSymmetricKey;
        bool institutionManaged;
    }

    address public owner;
    mapping(address => Student) public students;

    constructor(){
        owner = msg.sender;
    }

    modifier ownerRestricted() {
        require(msg.sender == owner);
        _;
    }

    function createStudent(
        Student calldata _student
    ) public ownerRestricted {
        Student storage student = students[_student.student];
        require(student.student == address(0x0));
        students[_student.student] = _student;
        emit StudentCreated(student.student);
    }

    function setStudentData(
        address _student,
        bytes calldata _encryptedData
    ) public ownerRestricted {
        Student storage student = students[_student];
        require(student.student != address(0x0));
        student.encryptedData = _encryptedData;
        emit StudentUpdated(student.student);
    }

    function setStudentName(
        address _student,
        bytes calldata _encryptedFirstName,
        bytes calldata _encryptedLastName
    ) public ownerRestricted {
        Student storage student = students[_student];
        require(student.student != address(0x0));
        student.encryptedFirstName = _encryptedFirstName;
        student.encryptedLastName = _encryptedLastName;
        emit StudentUpdated(student.student);
    }

    function getStudent(
        address _student
    ) public view returns (
        Student memory
    ){
        Student storage student = students[_student];
        require(student.student != address(0x0));
        return student;
    }

}
