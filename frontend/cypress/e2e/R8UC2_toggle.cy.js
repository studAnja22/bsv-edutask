// Code by Anja22
describe('R8UC2: Task/Todo item GUI tests', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user

    before(function () {
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
    })

    beforeEach(function () {
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

    it('R8UC2: User toggles icon', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('Toggle me')
        cy.get('input[name="url"')
        .type('j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Assert we added the task successfully.
        cy.log('Asserting we added the second task')
        cy.get('p')
        .should('contain.text', 'Here you can find your 1 task')

        // Click on the video
        cy.log('User clicks the video')
        cy.get('.container-element')
        .first()
        .click()

        // First it'll be unchecked (active) then checked (done)
        cy.log('Assert the icon is active (unchecked)')
        cy.get('.checker')
        .should('have.class', 'unchecked')

        // User clicks the icon - which toggles to done (checked)
        cy.log('User clicks the icon to toggle to done (checked)')
        cy.get('.checker')
        .click()

        // Assert the icon toggled to done (checked)
        cy.log('Assert the icon is done (checked)')
        cy.get('.checker')
        .should('have.class', 'checked')

        // Check if theres a line through the text
        cy.log('Assert that the todo item is struck through (line-through)')
        cy.get('.checker.checked')
        .next('.editable')
        .should('be.visible')
        .should('contain.text', 'Watch video')
        .should('have.css', 'text-decoration')
        .and('include', 'line-through')

        // User clicks the icon again - which toggles to active (unchecked)
        cy.log('User clicks the icon to toggle to active (unchecked)')
        cy.get('.checker')
        .click()

        //Assert the icon toggled to active (unchecked)
        cy.log('Assert the icon is active (unchecked)')
        cy.get('.checker')
        .should('have.class', 'unchecked')

        //Check if the text is no longer struck through
        cy.log('Assert that the todo item is struck through (line-through)')
        cy.get('.checker.unchecked')
        .next('.editable')
        .should('be.visible')
        .should('contain.text', 'Watch video')
        .should('have.css', 'text-decoration')
        .and('not.include', 'line-through')
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