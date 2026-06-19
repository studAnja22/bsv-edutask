import json
import pytest
from src.util.dao import DAO
from src.util.validators import getValidator
from pymongo.errors import WriteError

#Code by Anja22
@pytest.fixture
def daoObject():
    """Attempts to creates a collection used for test and then
    after it served its purpose, removes it from the database.
    """
    sut = DAO('user')
    yield sut
    sut.collection.drop()

@pytest.mark.integration
def test_unique_email_returns_that_user(daoObject):
    """ Test if one can add a unique email to the database
    """
    # for User "required": ["firstName", "lastName", "email"]
    result = daoObject.create({"firstName": "Test",
                    "lastName": "User",
                    "email": "test@email.com"})
    assert result["firstName"] == "Test"

@pytest.mark.integration
def test_duplicate_user_returns_that_user(daoObject):
    """ Test if one can add a duplicate entry of the same email (unique item)
    """
    # for User "required": ["firstName", "lastName", "email"]
    daoObject.create({"firstName": "First",
                    "lastName": "User",
                    "email": "same@email.com"})
    result = daoObject.create({"firstName": "Second",
                    "lastName": "User",
                    "email": "same@email.com"})
    assert result["firstName"] == "Second"

@pytest.mark.integration
def test_returns_users_has_id(daoObject):
    """ Test if return object has attribute _id as promised in the documentation
    """
    # for User "required": ["firstName", "lastName", "email"]
    result = daoObject.create({"firstName": "Test",
                    "lastName": "User",
                    "email": "test@email.com"})
    assert result["_id"] is not None

@pytest.mark.integration
def test_email_is_a_random_string_returns_that_user(daoObject):
    """ Tests if email string has to be email format
    """
    # for User "required": ["firstName", "lastName", "email"]
    result = daoObject.create({"firstName": "Test",
                    "lastName": "User",
                    "email": "Not an Email"})
    assert result["email"] == "Not an Email"

@pytest.mark.integration
def test_returns_parsed_JSON_object(daoObject):
    """ Tests if the return object is actually a parsed JSON object as the documentation describes
    "returns: object -- the newly created MongoDB document (parsed to a JSON object)..."
    """
    # for User "required": ["firstName", "lastName", "email"]
    jsonObject = daoObject.create({"firstName": "Test",
                    "lastName": "User",
                    "email": "test@email.com"})
    result = is_json_object_json(jsonObject)
    assert result is True

#------------------------WriteErrors---------------------------
@pytest.mark.integration
def test_invalid_input_raise_WrightError(daoObject):
    """ Test if validator raise Wright Error if there are an invalid input
    """
    # for User "required": ["firstName", "lastName", "email"]
    with pytest.raises(WriteError):
        daoObject.create({"firstName": 123,
                    "lastName": "User",
                    "email": "test@email.com"})

@pytest.mark.integration
def test_multiple_invalid_input_raise_WrightError(daoObject):
    """ Test if validator raise Wright Error if there are multiple invalid inputs
    """
    # for User "required": ["firstName", "lastName", "email"]
    with pytest.raises(WriteError):
        daoObject.create({"firstName": 123,
                    "lastName": 456,
                    "email": "test@email.com"})

@pytest.mark.integration
def test_required_field_missing_raise_WrightError(daoObject):
    """ Test if validator raise Wright Error one of the required fields are missing
    """
    # for User "required": ["firstName", "lastName", "email"]
    with pytest.raises(WriteError):
        daoObject.create({"firstName": "Test",
                    "lastName": "User"})

@pytest.mark.integration
def test_unique_item_email_is_None_raise_WrightError(daoObject):
    """ Test if validator raise Wright Error if email is None
    """
    # for User "required": ["firstName", "lastName", "email"]
    with pytest.raises(WriteError):
        daoObject.create({"firstName": 123,
                    "lastName": "User",
                    "email": None})
#--------------------------Helpers-------------------------------
def is_json_object_json(json_object):
    """ Checks if json_object is actually a JSON object.
    """
    try:
        json.loads(json_object)
        return True
    except json.JSONDecodeError:
        return False