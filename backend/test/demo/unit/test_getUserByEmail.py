import pytest
from src.controllers.usercontroller import UserController
import unittest.mock as mock
#Code by Anja22

@pytest.mark.unit
def test_registered_email_unique():
    """ Testing if function returns first instance of a user[0]
    when searching for a unique email in the mock database.
    """
    sut = mock_setup()
    email, expected_user = ("test@email.com", {"user": "Three", "email": "test@email.com"})
    result = sut.get_user_by_email(email)
    assert result == expected_user

@pytest.mark.unit
def test_registered_email_duplicate():
    """ Testing if the function returns the first instance of a user[0]
    when there are duplicates of that email in the database.
    """
    sut = mock_setup()
    email, expected_user = ("email@email.com", {"user": "One", "email": "email@email.com"})
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

@pytest.mark.unit
def test_database_operation_fail_exception():
    """ Testing if function raises an Exception if database operations fails with a valid, registered email
    """
    mocked_db = mock.MagicMock()
    mocked_db.find.side_effect = Exception
    sut = UserController(dao=mocked_db)

    with pytest.raises(Exception):
        sut.get_user_by_email("email@email.com")
    return
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
