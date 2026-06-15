import pytest
from src.controllers.usercontroller import UserController
import unittest.mock as mock
#Code by Anja22

@pytest.mark.unit
def test_registered_email():
    """ Testing one registered user with uniq email and 
    one registered user where there's a duplicate email in the database.
    In case of a duplicate, the function should return the first instance of the user.
    So, user[0] will always be user: One, not user: Two.
    """
    sut = mock_setup()

    testPairs = test_pairs_registered()
    for testPair in testPairs:
        email, expected_user = testPair
        result = sut.get_user_by_email(email)
        assert result == expected_user

@pytest.mark.unit
def test_unregistered_email_yield_None():
    """ Testing one unregistered email, the function should return None according to the documentation.
    """
    # Test reveals that the expected behavior(return None) doesn't match actual behavior (raise IndexError)
    sut = mock_setup()
    result = sut.get_user_by_email("unregistered@email.com")
    assert result is None

@pytest.mark.unit
def test_invalid_email_yield_ValueError():
    """ Testing invalid email format, the function should raise a ValueError.
    """
    sut = mock_setup()
    with pytest.raises(ValueError):
        sut.get_user_by_email("email.com")
# ---Setup of Mock, side effect, database and test pairs for registered users---# 
def mock_setup():
    mocked_db = mock.MagicMock()
    mocked_db.find.side_effect = db_side_effect
    sut = UserController(dao=mocked_db)
    return sut

def db_side_effect(query):
    db = database()
    email = query["email"]
    result = []
    for user in db:
        if user["email"] == email:
            result.append(user)
    return result

def database():
    return [
        {"user": "One", "email": "email@email.com"},
        {"user": "Two", "email": "email@email.com"},
        {"user": "Three", "email": "test@email.com"},
        ]

def test_pairs_registered():
    return [
        ("test@email.com", {"user": "Three", "email": "test@email.com"}),
        ("email@email.com", {"user": "One", "email": "email@email.com"})
        ]
