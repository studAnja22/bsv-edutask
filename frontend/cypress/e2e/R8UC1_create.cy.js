// Code by Anja22
describe('R8UC1: Task/Todo item GUI tests', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user

    beforeEach(function () {
        // create a fabricated user from a fixture
        cy.fixture('user.json')
        .then((user) => {
            cy.request({
            method: 'POST',
            url: 'http://localhost:5000/users/create',
            form: true,
            body: user
            }).then((response) => {
            uid = response.body._id.$oid
            name = user.firstName + ' ' + user.lastName
            email = user.email
            })
        })
        .then(() => {
            // enter the main main page
            cy.visit('http://localhost:3000')

            // detect a div which contains "Email Address", find the input and type (in a declarative way)
            cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)

            // submit the form on this page
            cy.get('form')
            .submit()

            // assert that the user is now logged in
            cy.get('h1')
            .should('contain.text', 'Your tasks, ' + name)
        })
        
    })

    it('R8UC1: User creates two task', () => {
        // Assert: Submit button on empty form should be disabled
        cy.log('Submit button is disabled when the form is empty')
        cy.get('input[type=submit]')
        .should('be.disabled')

        // Filling out the url
        cy.get('input[name="url"')
        .type('j64oZLF443g')//"In space with markiplier" YouTube video ID/key

        // Assert: Submit button should be disabled when title (description) is empty
        cy.log('Submit button is disabled when the title is empty')
        cy.get('input[type=submit]')
        .should('be.disabled')

        // Filling out the title (description)
        cy.get('input[name="title"')
        .type('Hello World')

        // Assert: Submit button should now be enabled
        cy.log('Submit button is enabled when title is filled')
        cy.get('input[type=submit]')
        .should('not.be.disabled')

        // Click the submit button
        cy.get('input[type=submit]').click()

        // Assert we added the 1 task element.
        cy.log('Asserting the task element is added')
        cy.get('p')
        .should('contain.text', 'Here you can find your 1 task')

        // Assert if newly added task element has status active
        cy.log('Asserting if the newly added task element has status active')
        cy.get('done-overlay')
        .should('not.exist')

        // Add one more unique task element
        cy.log("Adding new task with entire url instead of url view key.")
        cy.get('input[name="title"')
        .type('foobar')
        cy.get('input[name="url"')
        .type('https://www.youtube.com/watch?v=j64oZLF443g') //Testing if possible to add entire url
        cy.get('input[type=submit]').click()

        //Assert we added the second task element.
        cy.log('Asserting we added the second task element')
        cy.get('p')
        .should('contain.text', 'Here you can find your 2 task')

        //Assert order of elements in divs
        cy.log('Asserting the first task element is in first place')
        cy.get('.container-element')
        .first()
        .should('contain.text', 'Hello World')

        // The very last element will be the create form, we'll check if the second last is the new element
        cy.log('Asserting the newly created task element append to the bottom of the task/todo list')
        cy.get('.container-element').eq(-2)
        .should('contain.text', 'foobar')
    })

    it('R8UC1: User can add a new todo item and the items append at the bottom of the todo list', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('Todo Item Append At The Bottom')
        cy.get('input[name="url"')
        .type('j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Click on the first task element
        cy.log('User clicks the video')
        cy.get('.container-element')
        .first()
        .click()

        // Click on the input field (inline-form)
        cy.get('.inline-form')
        .type('There is much to be done')

        // User clicks the Add button
        cy.log('Submit button is enabled when there is text in the description')
        cy.get('input[type=submit][value="Add"]')
        .click()

        // Check todo list for the text 'There is much to be done'
        cy.get('.todo-list')
        .should('contain.text', 'There is much to be done')

        // Assert todo item appended to the bottom of the list
        cy.log('Asserting the new todo item is appended to the bottom of the list')
        cy.get('.todo-list')
        .last()
        .should('contain.text', 'There is much to be done')

        // Assert new todo item has status active (unchecked)
        cy.get('.checker')
        .last()
        .should('have.class', 'unchecked')
    })

    it('R8UC1: Add button should be disabled when the description is empty', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('Is Button Disabled?')
        cy.get('input[name="url"')
        .type('j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Click on the first task element
        cy.log('User clicks the video')
        cy.get('.container-element')
        .first()
        .click()

        // Add button should be disabled if the input field is empty
        cy.log('Submit button is disabled when the title is empty')
        cy.get('input[type=submit][value="Add"]')
        .should('be.disabled')
    })

    afterEach(function () {
        // clean up by deleting the user from the database
        cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
        cy.log(response.body)
        })
    })
})